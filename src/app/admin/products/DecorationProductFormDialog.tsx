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
  Typography,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { PricingCalculator } from '@/components/PricingCalculator';

interface DecorationProduct {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  categoryId: string;
  vendorId: string;
  pricingType: string;
  hasColorPricing: boolean;
  hasArtworkPricing: boolean;
  hasSizePricing: boolean;
  colorPricingType?: string;
  maxColors?: number;
  artSetupFee?: number;
  sampleFee?: number;
  editFee?: number;
  rushFee?: number;
  minimumQuantity: number;
  estimatedTurnaround?: string;
  notes?: string;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    displayName: string;
  };
  vendor?: {
    id: string;
    name: string;
    displayName: string;
  };
}

interface DecorationCategory {
  id: string;
  name: string;
  displayName: string;
}

interface DecorationVendor {
  id: string;
  name: string;
  displayName: string;
}

interface DecorationProductFormDialogProps {
  open: boolean;
  decorationProduct?: DecorationProduct | null;
  onClose: () => void;
  onSave: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`decoration-product-tabpanel-${index}`}
      aria-labelledby={`decoration-product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function DecorationProductFormDialog({
  open,
  decorationProduct,
  onClose,
  onSave,
}: DecorationProductFormDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [categories, setCategories] = useState<DecorationCategory[]>([]);
  const [vendors, setVendors] = useState<DecorationVendor[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    categoryId: '',
    vendorId: '',
    pricingType: 'QUANTITY_BREAKS',
    hasColorPricing: false,
    hasArtworkPricing: false,
    hasSizePricing: false,
    colorPricingType: '',
    maxColors: 0,
    artSetupFee: 0,
    sampleFee: 0,
    editFee: 0,
    rushFee: 0,
    minimumQuantity: 12,
    estimatedTurnaround: '',
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchVendors();
      
      if (decorationProduct) {
        setFormData({
          name: decorationProduct.name || '',
          displayName: decorationProduct.displayName || '',
          description: decorationProduct.description || '',
          categoryId: decorationProduct.categoryId || '',
          vendorId: decorationProduct.vendorId || '',
          pricingType: decorationProduct.pricingType || 'QUANTITY_BREAKS',
          hasColorPricing: decorationProduct.hasColorPricing || false,
          hasArtworkPricing: decorationProduct.hasArtworkPricing || false,
          hasSizePricing: decorationProduct.hasSizePricing || false,
          colorPricingType: decorationProduct.colorPricingType || '',
          maxColors: decorationProduct.maxColors || 0,
          artSetupFee: decorationProduct.artSetupFee || 0,
          sampleFee: decorationProduct.sampleFee || 0,
          editFee: decorationProduct.editFee || 0,
          rushFee: decorationProduct.rushFee || 0,
          minimumQuantity: decorationProduct.minimumQuantity || 12,
          estimatedTurnaround: decorationProduct.estimatedTurnaround || '',
          notes: decorationProduct.notes || '',
          isActive: decorationProduct.isActive ?? true,
        });
      } else {
        // Reset form for new product
        setFormData({
          name: '',
          displayName: '',
          description: '',
          categoryId: '',
          vendorId: '',
          pricingType: 'QUANTITY_BREAKS',
          hasColorPricing: false,
          hasArtworkPricing: false,
          hasSizePricing: false,
          colorPricingType: '',
          maxColors: 0,
          artSetupFee: 0,
          sampleFee: 0,
          editFee: 0,
          rushFee: 0,
          minimumQuantity: 12,
          estimatedTurnaround: '',
          notes: '',
          isActive: true,
        });
      }
      
      setError('');
      setActiveTab(0);
    }
  }, [open, decorationProduct]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/decoration-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/admin/decoration-vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.displayName || !formData.categoryId || !formData.vendorId) {
        throw new Error('Name, display name, category, and vendor are required');
      }

      const url = decorationProduct 
        ? `/api/admin/decoration-products/${decorationProduct.id}`
        : '/api/admin/decoration-products';
      
      const method = decorationProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save decoration product');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving decoration product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save decoration product');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(decorationProduct);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Decoration Product' : 'Add Decoration Product'}
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Basic Info" />
          <Tab label="Pricing Config" />
          {isEditing && <Tab label="Price Calculator" />}
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              helperText="Internal name (e.g., screen_print_vector_standard)"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              required
              helperText="User-friendly name (e.g., Screen Print - Vector Artwork)"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={2}
              helperText="Description of this specific product offering"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Category"
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={formData.vendorId}
                  label="Vendor"
                  onChange={(e) => handleInputChange('vendorId', e.target.value)}
                >
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      {vendor.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minimum Quantity"
                type="number"
                value={formData.minimumQuantity}
                onChange={(e) => handleInputChange('minimumQuantity', parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
              />

              <TextField
                label="Estimated Turnaround"
                value={formData.estimatedTurnaround}
                onChange={(e) => handleInputChange('estimatedTurnaround', e.target.value)}
                helperText="e.g., 5-7 business days"
              />
            </Box>

            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={2}
              helperText="Special notes or requirements"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              }
              label="Active"
            />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Pricing Structure</Typography>
            
            <FormControl fullWidth>
              <InputLabel>Pricing Type</InputLabel>
              <Select
                value={formData.pricingType}
                label="Pricing Type"
                onChange={(e) => handleInputChange('pricingType', e.target.value)}
              >
                <MenuItem value="QUANTITY_BREAKS">Quantity Breaks</MenuItem>
                <MenuItem value="FLAT_RATE">Flat Rate</MenuItem>
                <MenuItem value="CUSTOM">Custom</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Typography variant="subtitle2">Pricing Features</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasColorPricing}
                  onChange={(e) => handleInputChange('hasColorPricing', e.target.checked)}
                />
              }
              label="Has Color-Based Pricing"
            />

            {formData.hasColorPricing && (
              <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                  <InputLabel>Color Pricing Type</InputLabel>
                  <Select
                    value={formData.colorPricingType}
                    label="Color Pricing Type"
                    onChange={(e) => handleInputChange('colorPricingType', e.target.value)}
                  >
                    <MenuItem value="PER_COLOR">Per Color (additional cost per color)</MenuItem>
                    <MenuItem value="FLAT_MULTI">Flat Multi (single vs multi-color pricing)</MenuItem>
                    <MenuItem value="INCLUSIVE">Inclusive (colors included in base price)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Max Colors"
                  type="number"
                  value={formData.maxColors}
                  onChange={(e) => handleInputChange('maxColors', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                  helperText="0 for unlimited"
                />
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasArtworkPricing}
                  onChange={(e) => handleInputChange('hasArtworkPricing', e.target.checked)}
                />
              }
              label="Has Artwork Type Pricing"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasSizePricing}
                  onChange={(e) => handleInputChange('hasSizePricing', e.target.checked)}
                />
              }
              label="Has Size-Based Pricing"
            />

            <Divider />

            <Typography variant="subtitle2">Fixed Fees</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Art Setup Fee"
                type="number"
                value={formData.artSetupFee}
                onChange={(e) => handleInputChange('artSetupFee', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />

              <TextField
                label="Sample Fee"
                type="number"
                value={formData.sampleFee}
                onChange={(e) => handleInputChange('sampleFee', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />

              <TextField
                label="Edit Fee"
                type="number"
                value={formData.editFee}
                onChange={(e) => handleInputChange('editFee', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />

              <TextField
                label="Rush Fee"
                type="number"
                value={formData.rushFee}
                onChange={(e) => handleInputChange('rushFee', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
              />
            </Box>
          </Box>
        </TabPanel>

        {isEditing && (
          <TabPanel value={activeTab} index={2}>
            <PricingCalculator
              decorationProductId={decorationProduct!.id}
              decorationProductName={decorationProduct!.displayName}
              hasColorPricing={formData.hasColorPricing}
              hasArtworkPricing={formData.hasArtworkPricing}
              hasSizePricing={formData.hasSizePricing}
              minimumQuantity={formData.minimumQuantity}
            />
          </TabPanel>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : (isEditing ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}