'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Snackbar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string | null;
}

interface NewJobFormProps {
  customers: Customer[];
}

export function NewJobForm({ customers }: NewJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: '',
    productSku: '',
    variant: '',
    dueDate: '',
    notes: '',
  });
  
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    sizes.forEach(size => {
      initial[size] = 0;
    });
    return initial;
  });
  
  const [printSpec, setPrintSpec] = useState({
    design: '',
    placement: '',
    colors: '',
    special: '',
  });

  const totalQuantity = Object.values(sizeBreakdown).reduce((sum, qty) => sum + qty, 0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (size: string, value: string) => {
    const qty = parseInt(value) || 0;
    setSizeBreakdown(prev => ({
      ...prev,
      [size]: qty
    }));
  };

  const handlePrintSpecChange = (field: string, value: string) => {
    setPrintSpec(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.productSku) {
      setError('Please select a customer and enter a product SKU');
      return;
    }

    if (totalQuantity === 0) {
      setError('Please specify at least one item to order');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          productSku: formData.productSku,
          variant: formData.variant || undefined,
          sizeBreakdown,
          printSpec,
          dueDate: formData.dueDate || undefined,
          notes: formData.notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const { jobId } = await response.json();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/jobs/${jobId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                label="Customer"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                    {customer.company && ` - ${customer.company}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Product SKU"
              value={formData.productSku}
              onChange={(e) => handleInputChange('productSku', e.target.value)}
              fullWidth
              required
              placeholder="e.g., SHIRT-BASIC-COTTON"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Variant"
              value={formData.variant}
              onChange={(e) => handleInputChange('variant', e.target.value)}
              fullWidth
              placeholder="e.g., Navy"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Size Breakdown
            </Typography>
            <Grid container spacing={2}>
              {sizes.map((size) => (
                <Grid item xs={6} sm={3} key={size}>
                  <TextField
                    label={size}
                    type="number"
                    size="small"
                    fullWidth
                    value={sizeBreakdown[size]}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              ))}
            </Grid>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Total Quantity: {totalQuantity}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Print Specifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Design"
                  value={printSpec.design}
                  onChange={(e) => handlePrintSpecChange('design', e.target.value)}
                  fullWidth
                  placeholder="Logo name or design description"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Placement"
                  value={printSpec.placement}
                  onChange={(e) => handlePrintSpecChange('placement', e.target.value)}
                  fullWidth
                  placeholder="e.g., Front chest, Back center"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Colors"
                  value={printSpec.colors}
                  onChange={(e) => handlePrintSpecChange('colors', e.target.value)}
                  fullWidth
                  placeholder="e.g., White ink, 2-color"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Special Instructions"
                  value={printSpec.special}
                  onChange={(e) => handlePrintSpecChange('special', e.target.value)}
                  fullWidth
                  placeholder="Any special requirements"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              fullWidth
              placeholder="Any additional notes or requirements"
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">
                {error}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || totalQuantity === 0}
              sx={{ minWidth: 200 }}
            >
              {isSubmitting ? 'Creating Job...' : 'Create Job'}
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Job created successfully! Redirecting to job details...
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}