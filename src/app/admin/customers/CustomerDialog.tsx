'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Warning as WarningIcon,
  Search as SearchIcon,
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
  name: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id'>) => Promise<boolean>;
  customer?: Customer | null; // null for new, customer object for edit
  loading?: boolean;
}

export function CustomerDialog({
  open,
  onClose,
  onSave,
  customer = null,
  loading = false,
}: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
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

  const isEditing = customer !== null;

  useEffect(() => {
    if (open) {
      if (customer) {
        // Editing existing customer
        setFormData({
          name: customer.name,
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
        // Creating new customer
        setFormData({
          name: '',
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
    }
  }, [open, customer]);

  // ZIP code lookup handler
  const handleZipCodeLookup = useCallback(async (zipCode: string) => {
    if (zipCode.length >= 5) {
      const result = await lookupZipCode(zipCode);
      if (result.success && result.result) {
        setFormData(prev => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            city: result.result?.city || prev.shipping.city,
            state: result.result?.state || prev.shipping.state,
            zipCode: result.result?.zipCode || prev.shipping.zipCode,
          },
        }));
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        defaultShip: shippingAddress,
      });

      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
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
    setErrors({});
    onClose();
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Basic Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Basic Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
                disabled={submitting || loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
                disabled={submitting || loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                value={formData.company}
                onChange={handleChange('company')}
                error={!!errors.company}
                helperText={errors.company}
                fullWidth
                disabled={submitting || loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                disabled={submitting || loading}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Shipping Address */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Default Shipping Address
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Optional: This address will be used as the default for new jobs
          </Typography>
          
          <Grid container spacing={2}>
            {/* ZIP Code Lookup for Auto-fill */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="ZIP Code"
                value={formData.shipping.zipCode}
                onChange={(e) => {
                  handleChange('shipping.zipCode')(e);
                  if (e.target.value.length === 5) {
                    handleZipCodeLookup(e.target.value);
                  }
                }}
                fullWidth
                disabled={submitting || loading || lookingUp}
                placeholder="90210"
                InputProps={{
                  endAdornment: lookingUp ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
                helperText="City and state will auto-fill"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={formData.shipping.city}
                onChange={handleChange('shipping.city')}
                fullWidth
                disabled={submitting || loading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                value={formData.shipping.state}
                onChange={handleChange('shipping.state')}
                fullWidth
                disabled={submitting || loading}
                placeholder="CA"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Street Address"
                value={formData.shipping.street}
                onChange={handleChange('shipping.street')}
                fullWidth
                disabled={submitting || loading}
                placeholder="123 Main Street"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Apartment, Suite, Unit, etc. (Optional)"
                value={formData.shipping.street2}
                onChange={handleChange('shipping.street2')}
                fullWidth
                disabled={submitting || loading}
                placeholder="Apt 4B, Suite 100, Unit 5, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Country"
                value={formData.shipping.country}
                onChange={handleChange('shipping.country')}
                fullWidth
                disabled={submitting || loading}
              />
            </Grid>
            
            {/* Address Validation */}
            {(formData.shipping.street && formData.shipping.city && formData.shipping.state && formData.shipping.zipCode) && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={validating ? <CircularProgress size={16} /> : <SearchIcon />}
                    onClick={handleValidateAddress}
                    disabled={validating || submitting || loading}
                    size="small"
                  >
                    {validating ? 'Validating...' : 'Validate Address'}
                  </Button>
                  
                  {addressValidation.status !== 'none' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {addressValidation.status === 'valid' && (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                      {addressValidation.status === 'invalid' && (
                        <WarningIcon color="error" fontSize="small" />
                      )}
                      {addressValidation.status === 'warning' && (
                        <WarningIcon color="warning" fontSize="small" />
                      )}
                      <Typography 
                        variant="body2" 
                        color={
                          addressValidation.status === 'valid' ? 'success.main' : 
                          addressValidation.status === 'invalid' ? 'error.main' : 
                          'warning.main'
                        }
                      >
                        {addressValidation.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={submitting || loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || loading}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}