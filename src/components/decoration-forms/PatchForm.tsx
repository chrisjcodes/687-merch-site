'use client';

import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getDecorationStrategy } from '@/lib/decoration-strategies';

interface SizePricing {
  sizeRange: string;
  minSize?: number;
  maxSize?: number;
  quantityPricing: {
    minQty: number;
    maxQty?: number;
    price: number;
  }[];
}

interface PatchFormProps {
  strategyId: 'leather_patches' | '3d_embroidered_patches';
  initialData?: any;
  vendorId: string;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

export function PatchForm({ 
  strategyId,
  initialData, 
  vendorId, 
  onSave, 
  isEditing = false 
}: PatchFormProps) {
  const strategy = getDecorationStrategy(strategyId)!;
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    estimatedTurnaround: '5-7 business days',
    notes: '',
    isActive: true,
    // Fixed fees from strategy
    artSetupFee: strategy.defaultFields.artSetupFee || 0,
    sampleFee: strategy.defaultFields.sampleFee || 0,
    editFee: strategy.defaultFields.editFee || 0,
    minimumQuantity: strategy.defaultFields.minimumQuantity,
    maxColors: strategy.defaultFields.maxColors || 0,
  });

  const [sizePricing, setSizePricing] = useState<SizePricing[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        estimatedTurnaround: initialData.estimatedTurnaround || '5-7 business days',
        notes: initialData.notes || '',
        isActive: initialData.isActive ?? true,
        artSetupFee: initialData.artSetupFee || strategy.defaultFields.artSetupFee || 0,
        sampleFee: initialData.sampleFee || strategy.defaultFields.sampleFee || 0,
        editFee: initialData.editFee || strategy.defaultFields.editFee || 0,
        minimumQuantity: initialData.minimumQuantity || strategy.defaultFields.minimumQuantity,
        maxColors: initialData.maxColors || strategy.defaultFields.maxColors || 0,
      });
    }
  }, [initialData, strategy]);

  const initializeDefaultPricing = () => {
    if (!strategy.sizeRanges) return;
    
    const defaultSizePricing: SizePricing[] = strategy.sizeRanges.map(sizeRange => ({
      sizeRange: sizeRange.name,
      minSize: sizeRange.minSize,
      maxSize: sizeRange.maxSize,
      quantityPricing: strategy.quantityBreaks.slice(0, 5).map(qb => ({
        minQty: qb.minQty,
        maxQty: qb.maxQty,
        price: 0
      }))
    }));
    
    setSizePricing(defaultSizePricing);
  };

  const addSizeRange = () => {
    const newSizeRange: SizePricing = {
      sizeRange: 'Custom Size',
      quantityPricing: [
        { minQty: strategy.defaultFields.minimumQuantity, price: 0 }
      ]
    };
    setSizePricing([...sizePricing, newSizeRange]);
  };

  const removeSizeRange = (index: number) => {
    setSizePricing(sizePricing.filter((_, i) => i !== index));
  };

  const updateSizeRange = (index: number, field: string, value: any) => {
    const updated = [...sizePricing];
    updated[index] = { ...updated[index], [field]: value };
    setSizePricing(updated);
  };

  const addQuantityBreak = (sizeIndex: number) => {
    const updated = [...sizePricing];
    updated[sizeIndex].quantityPricing.push({
      minQty: strategy.defaultFields.minimumQuantity,
      price: 0
    });
    setSizePricing(updated);
  };

  const removeQuantityBreak = (sizeIndex: number, qtyIndex: number) => {
    const updated = [...sizePricing];
    updated[sizeIndex].quantityPricing = updated[sizeIndex].quantityPricing.filter((_, i) => i !== qtyIndex);
    setSizePricing(updated);
  };

  const updateQuantityBreak = (sizeIndex: number, qtyIndex: number, field: string, value: any) => {
    const updated = [...sizePricing];
    updated[sizeIndex].quantityPricing[qtyIndex] = {
      ...updated[sizeIndex].quantityPricing[qtyIndex],
      [field]: value
    };
    setSizePricing(updated);
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      vendorId,
      categoryId: strategy.id, // Will need to be mapped to actual category ID
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: strategy.hasColorPricing,
      hasArtworkPricing: strategy.hasArtworkPricing,
      hasSizePricing: true,
      hasVariantPricing: strategy.hasVariantPricing,
      colorPricingType: strategy.colorPricingType,
      sizePricing, // This would need to be converted to the database pricing structure
    };
    onSave(saveData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {strategy.displayName} Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              helperText="Internal identifier (e.g., leather_patches_standard)"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              required
              helperText="Customer-facing name (e.g., Custom Leather Patches)"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              helperText={strategy.description}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Minimum Quantity"
                type="number"
                value={formData.minimumQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumQuantity: parseInt(e.target.value) || strategy.defaultFields.minimumQuantity }))}
                inputProps={{ min: 1 }}
              />

              <TextField
                label="Estimated Turnaround"
                value={formData.estimatedTurnaround}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTurnaround: e.target.value }))}
                helperText="e.g., 5-7 business days"
              />

              {strategyId === '3d_embroidered_patches' && (
                <TextField
                  label="Max Colors Included"
                  type="number"
                  value={formData.maxColors}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxColors: parseInt(e.target.value) || 0 }))}
                  inputProps={{ min: 1 }}
                  helperText="Colors included in base price"
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Fixed Fees */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Fixed Fees
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Art Setup Fee"
              type="number"
              value={formData.artSetupFee}
              onChange={(e) => setFormData(prev => ({ ...prev, artSetupFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="One-time setup charge"
            />

            <TextField
              label="Pre-Production Sample"
              type="number"
              value={formData.sampleFee}
              onChange={(e) => setFormData(prev => ({ ...prev, sampleFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
            />

            <TextField
              label="Edit Fee"
              type="number"
              value={formData.editFee}
              onChange={(e) => setFormData(prev => ({ ...prev, editFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="Charge for design changes"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Size & Quantity Pricing */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Size & Quantity Pricing
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={initializeDefaultPricing}
                disabled={sizePricing.length > 0}
              >
                Load Default Sizes
              </Button>
              <Button 
                startIcon={<AddIcon />} 
                size="small" 
                onClick={addSizeRange}
              >
                Add Size Range
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            {strategy.sizeCalculationMethod === 'AVERAGE' 
              ? 'Size calculation: (Length + Width) / 2'
              : `Size calculation: ${strategy.sizeCalculationMethod?.toLowerCase()}`
            }
          </Alert>

          {sizePricing.map((sizeRange, sizeIndex) => (
            <Card key={sizeIndex} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={sizeRange.sizeRange} color="primary" variant="outlined" />
                    <IconButton 
                      size="small" 
                      onClick={() => removeSizeRange(sizeIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={() => addQuantityBreak(sizeIndex)}
                  >
                    Add Quantity Break
                  </Button>
                </Box>

                {strategy.sizeRanges && (
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Size Range Name"
                      value={sizeRange.sizeRange}
                      onChange={(e) => updateSizeRange(sizeIndex, 'sizeRange', e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="Min Size"
                      type="number"
                      value={sizeRange.minSize || ''}
                      onChange={(e) => updateSizeRange(sizeIndex, 'minSize', e.target.value ? parseFloat(e.target.value) : undefined)}
                      size="small"
                      inputProps={{ step: 0.1 }}
                    />
                    <TextField
                      label="Max Size"
                      type="number"
                      value={sizeRange.maxSize || ''}
                      onChange={(e) => updateSizeRange(sizeIndex, 'maxSize', e.target.value ? parseFloat(e.target.value) : undefined)}
                      size="small"
                      inputProps={{ step: 0.1 }}
                    />
                  </Box>
                )}

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Min Qty</TableCell>
                        <TableCell>Max Qty</TableCell>
                        <TableCell>Price per Unit</TableCell>
                        <TableCell width={60}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sizeRange.quantityPricing.map((qtyBreak, qtyIndex) => (
                        <TableRow key={qtyIndex}>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.minQty}
                              onChange={(e) => updateQuantityBreak(sizeIndex, qtyIndex, 'minQty', parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.maxQty || ''}
                              onChange={(e) => updateQuantityBreak(sizeIndex, qtyIndex, 'maxQty', e.target.value ? parseInt(e.target.value) : undefined)}
                              inputProps={{ min: qtyBreak.minQty + 1 }}
                              sx={{ width: 80 }}
                              placeholder="Leave empty for +"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.price}
                              onChange={(e) => updateQuantityBreak(sizeIndex, qtyIndex, 'price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              InputProps={{ startAdornment: '$' }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => removeQuantityBreak(sizeIndex, qtyIndex)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Notes and Status */}
      <Card>
        <CardContent>
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            multiline
            rows={2}
            fullWidth
            helperText="Special requirements, limitations, or vendor-specific notes"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Active"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} size="large">
          {isEditing ? `Update ${strategy.displayName}` : `Create ${strategy.displayName}`}
        </Button>
      </Box>
    </Box>
  );
}