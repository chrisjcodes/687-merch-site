import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseUSPSResponse } from '@/lib/xmlParser';

interface AddressValidationRequest {
  street: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface USPSAddressValidateResponse {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  zip4?: string;
  valid: boolean;
  suggestions?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }[];
}

// POST - Validate address using USPS API
export async function POST(request: NextRequest) {
  try {
    // Skip auth for address validation - it's used during customer creation
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { street, street2, city, state, zipCode }: AddressValidationRequest = body;

    // Validate required fields
    if (!street) {
      return NextResponse.json(
        { error: 'Street address is required for validation' },
        { status: 400 }
      );
    }

    // Check if we have USPS API credentials
    const uspsUserId = process.env.USPS_USER_ID;
    if (!uspsUserId) {
      return NextResponse.json(
        { error: 'Address validation service not configured' },
        { status: 503 }
      );
    }

    try {
      // Build USPS API XML request
      const xmlRequest = `
        <AddressValidateRequest USERID="${uspsUserId}">
          <Revision>1</Revision>
          <Address ID="0">
            <Address1>${street2 || ''}</Address1>
            <Address2>${street}</Address2>
            <City>${city || ''}</City>
            <State>${state || ''}</State>
            <Zip5>${zipCode ? zipCode.substring(0, 5) : ''}</Zip5>
            <Zip4></Zip4>
          </Address>
        </AddressValidateRequest>
      `.trim();

      // Call USPS API
      const uspsResponse = await fetch('https://secure.shippingapis.com/ShippingAPI.dll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `API=Verify&XML=${encodeURIComponent(xmlRequest)}`,
      });

      if (!uspsResponse.ok) {
        throw new Error('USPS API request failed');
      }

      const responseText = await uspsResponse.text();

      // Parse XML response using our utility
      const parseResult = parseUSPSResponse(responseText);
      
      if (parseResult.success && parseResult.data) {
        const validatedAddress: USPSAddressValidateResponse = {
          street: parseResult.data.address2 || street,
          street2: parseResult.data.address1 || street2,
          city: parseResult.data.city || city || '',
          state: parseResult.data.state || state || '',
          zipCode: parseResult.data.zip5 || zipCode || '',
          zip4: parseResult.data.zip4 || undefined,
          valid: true,
        };

        return NextResponse.json({
          success: true,
          address: validatedAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: parseResult.error || 'Address could not be validated',
          originalAddress: {
            street,
            street2,
            city,
            state,
            zipCode,
          },
        });
      }
    } catch (apiError) {
      console.error('USPS API error:', apiError);
      return NextResponse.json({
        success: false,
        error: 'Address validation service temporarily unavailable',
        originalAddress: {
          street,
          street2,
          city,
          state,
          zipCode,
        },
      });
    }
  } catch (error) {
    console.error('Address validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check if address validation is available
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uspsUserId = process.env.USPS_USER_ID;
    
    return NextResponse.json({
      available: !!uspsUserId,
      service: 'USPS Address Validation API',
    });
  } catch (error) {
    console.error('Address validation check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}