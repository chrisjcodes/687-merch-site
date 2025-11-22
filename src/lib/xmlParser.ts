// Simple XML parsing utilities for USPS API responses
// This is a lightweight alternative to full XML parsers

export function parseUSPSResponse(xmlString: string) {
  // Helper function to extract text content between XML tags
  const extractTagContent = (tagName: string): string | null => {
    const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`, 'i');
    const match = xmlString.match(regex);
    return match ? match[1].trim() : null;
  };

  // Helper function to check if tag exists
  const hasTag = (tagName: string): boolean => {
    const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
    return regex.test(xmlString);
  };

  // Check for errors first
  if (hasTag('Error')) {
    const errorDescription = extractTagContent('Description');
    const errorNumber = extractTagContent('Number');
    return {
      success: false,
      error: errorDescription || 'Unknown error occurred',
      errorCode: errorNumber,
    };
  }

  return {
    success: true,
    data: {
      address2: extractTagContent('Address2'), // Street address
      address1: extractTagContent('Address1'), // Apt/Suite
      city: extractTagContent('City'),
      state: extractTagContent('State'),
      zip5: extractTagContent('Zip5'),
      zip4: extractTagContent('Zip4'),
    },
  };
}

export function parseUSPSCityStateResponse(xmlString: string) {
  // Helper function to extract text content between XML tags
  const extractTagContent = (tagName: string): string | null => {
    const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`, 'i');
    const match = xmlString.match(regex);
    return match ? match[1].trim() : null;
  };

  // Helper function to check if tag exists
  const hasTag = (tagName: string): boolean => {
    const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
    return regex.test(xmlString);
  };

  // Check for errors first
  if (hasTag('Error')) {
    const errorDescription = extractTagContent('Description');
    const errorNumber = extractTagContent('Number');
    return {
      success: false,
      error: errorDescription || 'ZIP code not found',
      errorCode: errorNumber,
    };
  }

  // Check if we have a valid ZipCode response
  if (hasTag('ZipCode')) {
    return {
      success: true,
      data: {
        city: extractTagContent('City'),
        state: extractTagContent('State'),
        zip5: extractTagContent('Zip5'),
      },
    };
  }

  return {
    success: false,
    error: 'Invalid response format',
  };
}