'use client';

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Warning as WarningIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useAddressValidation } from '@/hooks/useAddressValidation';

interface ShippingAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface Customer {
  id: string;
  name?: string;        // Keep for backward compatibility
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

interface CustomerFormProps {
  customer?: Customer;
  onSave: (customerData: CustomerFormData) => Promise<boolean>;
  onCancel: () => void;
  submitButtonText?: string;
}

export function CustomerForm({
  customer,
  onSave,
  onCancel,
  submitButtonText = 'Save Customer',
}: CustomerFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    shipping: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{
    status: 'none' | 'valid' | 'invalid' | 'warning';
    message?: string;
  }>({ status: 'none' });
  
  const { validateAddress, lookupZipCode, validating, lookingUp } = useAddressValidation();

  const isEditing = !!customer;

  // Initialize form data
  useEffect(() => {
    if (customer) {
      // Editing existing customer
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email,
        company: customer.company || '',
        phone: customer.phone || '',
        shipping: {
          street: customer.defaultShip?.street || '',
          street2: customer.defaultShip?.street2 || '',
          city: customer.defaultShip?.city || '',
          state: customer.defaultShip?.state || '',
          zipCode: customer.defaultShip?.zipCode || '',
          country: customer.defaultShip?.country || 'United States',
        },
      });
    } else {
      // Creating new customer - form is already initialized with empty values
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        shipping: {
          street: '',
          street2: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
        },
      });
    }
    setErrors({});
    setAddressValidation({ status: 'none' });
  }, [customer]);

  // ZIP code lookup handler
  const handleZipCodeLookup = useCallback(async (zipCode: string) => {
    if (zipCode.length === 5) {
      console.log('Looking up ZIP code:', zipCode);
      
      // Simple ZIP lookup using a basic API or static data for now
      // This avoids authentication issues while we set up USPS properly
      try {
        // For now, let's implement a simple ZIP lookup that works
        const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
        if (response.ok) {
          const data = await response.json();
          const place = data.places?.[0];
          if (place) {
            console.log('ZIP lookup successful:', place);
            setFormData(prev => ({
              ...prev,
              shipping: {
                ...prev.shipping,
                city: place['place name'] || prev.shipping.city,
                state: place['state abbreviation'] || prev.shipping.state,
                zipCode: zipCode,
              },
            }));
            return;
          }
        }
      } catch (error) {
        console.log('ZIP lookup failed, trying fallback:', error);
      }

      // Fallback to USPS if the free service fails
      const result = await lookupZipCode(zipCode);
      console.log('USPS ZIP lookup result:', result);
      
      if (result.success && result.result) {
        console.log('Updating form with USPS result:', result.result);
        setFormData(prev => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            city: result.result?.city || prev.shipping.city,
            state: result.result?.state || prev.shipping.state,
            zipCode: result.result?.zipCode || zipCode,
          },
        }));
      } else {
        console.error('Both ZIP lookup services failed:', result.error);
      }
    }
  }, [lookupZipCode]);

  // Address validation handler
  const handleValidateAddress = useCallback(async () => {
    const { shipping } = formData;
    if (!shipping.street || !shipping.city || !shipping.state || !shipping.zipCode) {
      setAddressValidation({
        status: 'warning',
        message: 'Please fill in all required address fields for validation',
      });
      return;
    }

    const result = await validateAddress(shipping);
    if (result.success && result.address) {
      setAddressValidation({
        status: 'valid',
        message: 'Address validated successfully',
      });
      
      // Update form with validated address
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          street: result.address?.street || prev.shipping.street,
          street2: result.address?.street2 || prev.shipping.street2,
          city: result.address?.city || prev.shipping.city,
          state: result.address?.state || prev.shipping.state,
          zipCode: result.address?.zipCode || prev.shipping.zipCode,
        },
      }));
    } else {
      setAddressValidation({
        status: 'invalid',
        message: result.error || 'Address could not be validated',
      });
    }
  }, [formData, validateAddress]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Prepare shipping address
      const hasShippingData = formData.shipping.street.trim() || 
                              formData.shipping.city.trim() || 
                              formData.shipping.state.trim() || 
                              formData.shipping.zipCode.trim();
      
      const shippingAddress = hasShippingData ? {
        street: formData.shipping.street.trim(),
        street2: formData.shipping.street2.trim() || undefined,
        city: formData.shipping.city.trim(),
        state: formData.shipping.state.trim(),
        zipCode: formData.shipping.zipCode.trim(),
        country: formData.shipping.country.trim() || 'United States',
      } : undefined;

      const success = await onSave({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        defaultShip: shippingAddress,
      });
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (field.startsWith('shipping.')) {
      const shippingField = field.replace('shipping.', '');
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          [shippingField]: event.target.value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Contact Information Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              Contact Information
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
                required
                disabled={submitting}
                placeholder="John"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
                required
                disabled={submitting}
                placeholder="Doe"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
                disabled={submitting}
                placeholder="john@example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange('phone')}
                fullWidth
                disabled={submitting}
                placeholder="(555) 123-4567"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company (Optional)"
                value={formData.company}
                onChange={handleChange('company')}
                fullWidth
                disabled={submitting}
                placeholder="Acme Corporation"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Shipping Address Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              Default Shipping Address
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            This address will be used as the default for new orders
          </Typography>
          
          {/* ZIP Code First - Auto-fill City/State */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Step 1: Enter ZIP Code
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="ZIP Code"
                  value={formData.shipping.zipCode}
                  onChange={(e) => {
                    handleChange('shipping.zipCode')(e);
                    if (e.target.value.length === 5) {
                      console.log('ZIP entered:', e.target.value);
                      handleZipCodeLookup(e.target.value);
                    }
                  }}
                  fullWidth
                  disabled={submitting || lookingUp}
                  placeholder="90210"
                  InputProps={{
                    endAdornment: lookingUp ? (
                      <CircularProgress size={20} />
                    ) : null,
                  }}
                  helperText={lookingUp ? "Looking up city and state..." : "City and state will auto-fill"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  value={formData.shipping.city}
                  onChange={handleChange('shipping.city')}
                  fullWidth
                  disabled={submitting}
                  placeholder="Auto-filled from ZIP"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  value={formData.shipping.state}
                  onChange={handleChange('shipping.state')}
                  fullWidth
                  disabled={submitting}
                  placeholder="Auto-filled from ZIP"
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Street Address */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Step 2: Enter Street Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  value={formData.shipping.street}
                  onChange={handleChange('shipping.street')}
                  fullWidth
                  disabled={submitting}
                  placeholder="123 Main Street"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Apartment, Suite, Unit (Optional)"
                  value={formData.shipping.street2}
                  onChange={handleChange('shipping.street2')}
                  fullWidth
                  disabled={submitting}
                  placeholder="Apt 4B, Suite 100, etc."
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Country"
                  value={formData.shipping.country}
                  onChange={handleChange('shipping.country')}
                  fullWidth
                  disabled={submitting}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          onClick={onCancel}
          disabled={submitting}
          size="large"
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
          size="large"
          sx={{ minWidth: 160 }}
        >
          {submitting ? 'Saving...' : submitButtonText}
        </Button>
      </Box>
    </Box>
  );
}