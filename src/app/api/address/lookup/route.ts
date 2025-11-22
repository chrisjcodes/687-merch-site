import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseUSPSCityStateResponse } from '@/lib/xmlParser';

interface ZipLookupResponse {
  zipCode: string;
  city: string;
  state: string;
  valid: boolean;
}

// GET - Look up city and state by ZIP code
export async function GET(request: NextRequest) {
  try {
    // Skip auth for address lookup - it's used during customer creation
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zip');

    if (!zipCode) {
      return NextResponse.json(
        { error: 'ZIP code parameter is required' },
        { status: 400 }
      );
    }

    // Validate ZIP code format (5 digits, optionally followed by dash and 4 more digits)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      return NextResponse.json(
        { error: 'Invalid ZIP code format' },
        { status: 400 }
      );
    }

    const uspsUserId = process.env.USPS_USER_ID;
    if (!uspsUserId) {
      return NextResponse.json(
        { error: 'Address lookup service not configured' },
        { status: 503 }
      );
    }

    try {
      // Use ZIP code to get city and state from USPS
      const zip5 = zipCode.substring(0, 5);
      
      // Build USPS City/State Lookup XML request
      const xmlRequest = `
        <CityStateLookupRequest USERID="${uspsUserId}">
          <ZipCode ID="0">
            <Zip5>${zip5}</Zip5>
          </ZipCode>
        </CityStateLookupRequest>
      `.trim();

      const uspsResponse = await fetch('https://secure.shippingapis.com/ShippingAPI.dll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `API=CityStateLookup&XML=${encodeURIComponent(xmlRequest)}`,
      });

      if (!uspsResponse.ok) {
        throw new Error('USPS API request failed');
      }

      const responseText = await uspsResponse.text();

      // Parse XML response using our utility
      const parseResult = parseUSPSCityStateResponse(responseText);
      
      if (parseResult.success && parseResult.data) {
        const result: ZipLookupResponse = {
          zipCode: parseResult.data.zip5 || zip5,
          city: parseResult.data.city || '',
          state: parseResult.data.state || '',
          valid: true,
        };

        return NextResponse.json({
          success: true,
          result,
        });
      }

      return NextResponse.json({
        success: false,
        error: parseResult.error || 'ZIP code not found',
      });

    } catch (apiError) {
      console.error('USPS ZIP lookup error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'ZIP code lookup service temporarily unavailable',
      });
    }
  } catch (error) {
    console.error('ZIP lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}