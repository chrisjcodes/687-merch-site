'use client';

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

interface VinylTypePricing {
  vinylType: string;
  description: string;
  quantityPricing: {
    minQty: number;
    maxQty?: number;
    price: number;
  }[];
}

interface HeatTransferVinylFormProps {
  initialData?: any;
  vendorId: string;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

const VINYL_TYPES = [
  { value: 'standard', label: 'Standard HTV', description: 'Basic heat transfer vinyl for cotton/poly blends' },
  { value: 'glitter', label: 'Glitter HTV', description: 'Sparkly finish with glitter particles' },
  { value: 'metallic', label: 'Metallic HTV', description: 'Shiny metallic finish' },
  { value: 'reflective', label: 'Reflective HTV', description: 'High-visibility reflective material' },
  { value: 'glow_in_dark', label: 'Glow-in-Dark HTV', description: 'Phosphorescent material that glows' },
  { value: 'holographic', label: 'Holographic HTV', description: 'Rainbow holographic effect' },
  { value: 'flock', label: 'Flock HTV', description: 'Soft, velvet-like texture' },
];

export function HeatTransferVinylForm({ 
  initialData, 
  vendorId, 
  onSave, 
  isEditing = false 
}: HeatTransferVinylFormProps) {
  const strategy = getDecorationStrategy('heat_transfer_vinyl')!;
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    estimatedTurnaround: '2-3 business days',
    notes: '',
    isActive: true,
    weedingFee: strategy.defaultFields.weedingFee || 15,
    applicationFee: strategy.defaultFields.applicationFee || 5,
    maxDesignSize: '12x12',
    colorLimit: 5,
    multiColorUpcharge: true,
  });

  const [vinylPricing, setVinylPricing] = useState<VinylTypePricing[]>([]);
  const [activeVinylType, setActiveVinylType] = useState('standard');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        estimatedTurnaround: initialData.estimatedTurnaround || '2-3 business days',
        notes: initialData.notes || '',
        isActive: initialData.isActive ?? true,
        weedingFee: initialData.weedingFee || strategy.defaultFields.weedingFee || 15,
        applicationFee: initialData.applicationFee || strategy.defaultFields.applicationFee || 5,
        maxDesignSize: initialData.maxDesignSize || '12x12',
        colorLimit: initialData.colorLimit || 5,
        multiColorUpcharge: initialData.multiColorUpcharge ?? true,
      });
    }
  }, [initialData, strategy]);

  const initializeDefaultPricing = () => {
    const defaultVinylPricing: VinylTypePricing[] = VINYL_TYPES.slice(0, 4).map(vinylType => ({
      vinylType: vinylType.value,
      description: vinylType.description,
      quantityPricing: strategy.quantityBreaks.slice(0, 5).map(qb => ({
        minQty: qb.minQty,
        maxQty: qb.maxQty,
        price: 0
      }))
    }));
    
    setVinylPricing(defaultVinylPricing);
  };

  const addVinylType = () => {
    const availableTypes = VINYL_TYPES.filter(
      type => !vinylPricing.find(vp => vp.vinylType === type.value)
    );
    
    if (availableTypes.length === 0) return;
    
    const selectedType = availableTypes.find(type => type.value === activeVinylType) || availableTypes[0];
    
    const newVinylType: VinylTypePricing = {
      vinylType: selectedType.value,
      description: selectedType.description,
      quantityPricing: [
        { minQty: strategy.defaultFields.minimumQuantity, price: 0 }
      ]
    };
    setVinylPricing([...vinylPricing, newVinylType]);
  };

  const removeVinylType = (index: number) => {
    setVinylPricing(vinylPricing.filter((_, i) => i !== index));
  };

  const updateVinylType = (index: number, field: string, value: any) => {
    const updated = [...vinylPricing];
    updated[index] = { ...updated[index], [field]: value };
    setVinylPricing(updated);
  };

  const addQuantityBreak = (vinylIndex: number) => {
    const updated = [...vinylPricing];
    updated[vinylIndex].quantityPricing.push({
      minQty: strategy.defaultFields.minimumQuantity,
      price: 0
    });
    setVinylPricing(updated);
  };

  const removeQuantityBreak = (vinylIndex: number, qtyIndex: number) => {
    const updated = [...vinylPricing];
    updated[vinylIndex].quantityPricing = updated[vinylIndex].quantityPricing.filter((_, i) => i !== qtyIndex);
    setVinylPricing(updated);
  };

  const updateQuantityBreak = (vinylIndex: number, qtyIndex: number, field: string, value: any) => {
    const updated = [...vinylPricing];
    updated[vinylIndex].quantityPricing[qtyIndex] = {
      ...updated[vinylIndex].quantityPricing[qtyIndex],
      [field]: value
    };
    setVinylPricing(updated);
  };

  const getVinylTypeLabel = (vinylType: string) => {
    return VINYL_TYPES.find(type => type.value === vinylType)?.label || vinylType;
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      vendorId,
      categoryId: strategy.id,
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: true,
      hasArtworkPricing: false,
      hasSizePricing: true,
      hasVariantPricing: true,
      colorPricingType: 'PER_COLOR',
      minimumQuantity: strategy.defaultFields.minimumQuantity,
      vinylPricing,
    };
    onSave(saveData);
  };

  const availableVinylTypes = VINYL_TYPES.filter(
    type => !vinylPricing.find(vp => vp.vinylType === type.value)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Heat Transfer Vinyl Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              helperText="Internal identifier (e.g., htv_standard_12x12)"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              required
              helperText="Customer-facing name (e.g., Heat Transfer Vinyl - Standard)"
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
                label="Max Design Size"
                value={formData.maxDesignSize}
                onChange={(e) => setFormData(prev => ({ ...prev, maxDesignSize: e.target.value }))}
                helperText='e.g., "12x12", "15x15"'
              />

              <TextField
                label="Color Limit"
                type="number"
                value={formData.colorLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, colorLimit: parseInt(e.target.value) || 5 }))}
                inputProps={{ min: 1, max: 10 }}
                helperText="Max colors per design"
              />

              <TextField
                label="Estimated Turnaround"
                value={formData.estimatedTurnaround}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTurnaround: e.target.value }))}
                helperText="e.g., 2-3 business days"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Service Fees */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Service Fees
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Weeding Fee"
              type="number"
              value={formData.weedingFee}
              onChange={(e) => setFormData(prev => ({ ...prev, weedingFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="Charge for removing excess vinyl"
            />

            <TextField
              label="Application Fee"
              type="number"
              value={formData.applicationFee}
              onChange={(e) => setFormData(prev => ({ ...prev, applicationFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="Per piece application charge"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.multiColorUpcharge}
                  onChange={(e) => setFormData(prev => ({ ...prev, multiColorUpcharge: e.target.checked }))}
                />
              }
              label="Multi-Color Upcharge"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Apply additional charges for multi-color designs
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Vinyl Type Pricing */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Vinyl Type & Quantity Pricing
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={initializeDefaultPricing}
                disabled={vinylPricing.length > 0}
              >
                Load Default Types
              </Button>
              <Button 
                startIcon={<AddIcon />} 
                size="small" 
                onClick={addVinylType}
                disabled={availableVinylTypes.length === 0}
              >
                Add Vinyl Type
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Configure pricing for different vinyl types and quantity breaks. 
            Premium vinyl types typically cost more than standard HTV.
          </Alert>

          {/* Quick Add Control */}
          {availableVinylTypes.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Vinyl Type to Add</InputLabel>
                <Select
                  value={activeVinylType}
                  label="Vinyl Type to Add"
                  onChange={(e) => setActiveVinylType(e.target.value)}
                >
                  {availableVinylTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {vinylPricing.map((vinylType, vinylIndex) => (
            <Card key={vinylIndex} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={getVinylTypeLabel(vinylType.vinylType)} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeVinylType(vinylIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={() => addQuantityBreak(vinylIndex)}
                  >
                    Add Quantity Break
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {vinylType.description}
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Min Qty</TableCell>
                        <TableCell>Max Qty</TableCell>
                        <TableCell>Price per Sq. Inch</TableCell>
                        <TableCell width={60}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vinylType.quantityPricing.map((qtyBreak, qtyIndex) => (
                        <TableRow key={qtyIndex}>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.minQty}
                              onChange={(e) => updateQuantityBreak(vinylIndex, qtyIndex, 'minQty', parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.maxQty || ''}
                              onChange={(e) => updateQuantityBreak(vinylIndex, qtyIndex, 'maxQty', e.target.value ? parseInt(e.target.value) : undefined)}
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
                              onChange={(e) => updateQuantityBreak(vinylIndex, qtyIndex, 'price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              InputProps={{ startAdornment: '$' }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => removeQuantityBreak(vinylIndex, qtyIndex)}
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
            helperText="Application temperature, fabric compatibility, care instructions"
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
          {isEditing ? 'Update Heat Transfer Vinyl' : 'Create Heat Transfer Vinyl'}
        </Button>
      </Box>
    </Box>
  );
}