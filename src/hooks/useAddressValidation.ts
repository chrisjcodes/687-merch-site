import { useState, useCallback } from 'react';

interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ValidationResult {
  success: boolean;
  address?: Address & { zip4?: string };
  error?: string;
  originalAddress?: Address;
}

interface ZipLookupResult {
  success: boolean;
  result?: {
    zipCode: string;
    city: string;
    state: string;
    valid: boolean;
  };
  error?: string;
}

export function useAddressValidation() {
  const [validating, setValidating] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);

  const validateAddress = useCallback(async (address: Partial<Address>): Promise<ValidationResult> => {
    if (!address.street) {
      return { success: false, error: 'Street address is required' };
    }

    setValidating(true);
    try {
      const response = await fetch('/api/address/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Validation failed' };
      }

      return data;
    } catch (error) {
      console.error('Address validation error:', error);
      return { 
        success: false, 
        error: 'Unable to validate address. Please check your connection.' 
      };
    } finally {
      setValidating(false);
    }
  }, []);

  const lookupZipCode = useCallback(async (zipCode: string): Promise<ZipLookupResult> => {
    if (!zipCode || zipCode.length < 5) {
      return { success: false, error: 'Please enter a valid ZIP code' };
    }

    setLookingUp(true);
    try {
      const response = await fetch(`/api/address/lookup?zip=${encodeURIComponent(zipCode)}`);
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Lookup failed' };
      }

      return data;
    } catch (error) {
      console.error('ZIP lookup error:', error);
      return { 
        success: false, 
        error: 'Unable to lookup ZIP code. Please check your connection.' 
      };
    } finally {
      setLookingUp(false);
    }
  }, []);

  const checkServiceAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/address/validate');
      const data = await response.json();
      return data.available || false;
    } catch {
      return false;
    }
  }, []);

  return {
    validateAddress,
    lookupZipCode,
    checkServiceAvailability,
    validating,
    lookingUp,
  };
}