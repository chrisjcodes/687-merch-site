'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { ProductCategory } from '@prisma/client';

const categoryLabels: Record<ProductCategory, string> = {
  TOPS: 'Tops',
  BOTTOMS: 'Bottoms',
  HEADWEAR: 'Headwear',
  ACCESSORIES: 'Accessories',
};

interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  basePrice: number;
  currentPrice: number;
  isActive: boolean;
}

interface ProductFormDialogProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: () => void;
}

export function ProductFormDialog({ open, product, onClose, onSave }: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '' as ProductCategory | '',
    brand: '',
    basePrice: 0,
    currentPrice: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        brand: product.brand || '',
        basePrice: product.basePrice,
        currentPrice: product.currentPrice,
        isActive: product.isActive,
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        category: '',
        brand: '',
        basePrice: 0,
        currentPrice: 0,
        isActive: true,
      });
    }
    setError('');
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sku || !formData.name || !formData.category) {
      setError('SKU, name, and category are required');
      return;
    }

    if (formData.basePrice < 0 || formData.currentPrice < 0) {
      setError('Prices cannot be negative');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice),
          currentPrice: Number(formData.currentPrice),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} product`);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Edit Applique' : 'Add New Applique'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              label="SKU"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              required
              fullWidth
              placeholder="e.g., TS001-BLK-SM"
            />

            <TextField
              label="Applique Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              placeholder="e.g., Basic Cotton T-Shirt"
            />

            <FormControl required fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Brand"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              fullWidth
              placeholder="e.g., Gildan, Bella+Canvas"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Base Price"
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />

              <TextField
                label="Current Price"
                type="number"
                value={formData.currentPrice}
                onChange={(e) => handleChange('currentPrice', e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                />
              }
              label="Active Applique"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}