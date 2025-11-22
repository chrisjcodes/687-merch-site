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

interface StitchCountPricing {
  minStitches: number;
  maxStitches?: number;
  quantityPricing: {
    minQty: number;
    maxQty?: number;
    price: number;
  }[];
}

interface DirectEmbroideryFormProps {
  initialData?: any;
  vendorId: string;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

export function DirectEmbroideryForm({ 
  initialData, 
  vendorId, 
  onSave, 
  isEditing = false 
}: DirectEmbroideryFormProps) {
  const strategy = getDecorationStrategy('direct_embroidery')!;
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    estimatedTurnaround: '7-10 business days',
    notes: '',
    isActive: true,
    digitizingFee: strategy.defaultFields.digitizingFee || 50,
    editFee: strategy.defaultFields.editFee || 15,
    maxStitchCount: 15000,
    threadChangeLimit: 12,
    densityCompliance: true,
  });

  const [stitchPricing, setStitchPricing] = useState<StitchCountPricing[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        estimatedTurnaround: initialData.estimatedTurnaround || '7-10 business days',
        notes: initialData.notes || '',
        isActive: initialData.isActive ?? true,
        digitizingFee: initialData.digitizingFee || strategy.defaultFields.digitizingFee || 50,
        editFee: initialData.editFee || strategy.defaultFields.editFee || 15,
        maxStitchCount: initialData.maxStitchCount || 15000,
        threadChangeLimit: initialData.threadChangeLimit || 12,
        densityCompliance: initialData.densityCompliance ?? true,
      });
    }
  }, [initialData, strategy]);

  const initializeDefaultPricing = () => {
    const defaultStitchPricing: StitchCountPricing[] = [
      {
        minStitches: 1,
        maxStitches: 5000,
        quantityPricing: strategy.quantityBreaks.slice(0, 5).map(qb => ({
          minQty: qb.minQty,
          maxQty: qb.maxQty,
          price: 0
        }))
      },
      {
        minStitches: 5001,
        maxStitches: 10000,
        quantityPricing: strategy.quantityBreaks.slice(0, 5).map(qb => ({
          minQty: qb.minQty,
          maxQty: qb.maxQty,
          price: 0
        }))
      },
      {
        minStitches: 10001,
        maxStitches: 15000,
        quantityPricing: strategy.quantityBreaks.slice(0, 5).map(qb => ({
          minQty: qb.minQty,
          maxQty: qb.maxQty,
          price: 0
        }))
      }
    ];
    
    setStitchPricing(defaultStitchPricing);
  };

  const addStitchRange = () => {
    const newRange: StitchCountPricing = {
      minStitches: 1,
      maxStitches: 5000,
      quantityPricing: [
        { minQty: strategy.defaultFields.minimumQuantity, price: 0 }
      ]
    };
    setStitchPricing([...stitchPricing, newRange]);
  };

  const removeStitchRange = (index: number) => {
    setStitchPricing(stitchPricing.filter((_, i) => i !== index));
  };

  const updateStitchRange = (index: number, field: string, value: any) => {
    const updated = [...stitchPricing];
    updated[index] = { ...updated[index], [field]: value };
    setStitchPricing(updated);
  };

  const addQuantityBreak = (stitchIndex: number) => {
    const updated = [...stitchPricing];
    updated[stitchIndex].quantityPricing.push({
      minQty: strategy.defaultFields.minimumQuantity,
      price: 0
    });
    setStitchPricing(updated);
  };

  const removeQuantityBreak = (stitchIndex: number, qtyIndex: number) => {
    const updated = [...stitchPricing];
    updated[stitchIndex].quantityPricing = updated[stitchIndex].quantityPricing.filter((_, i) => i !== qtyIndex);
    setStitchPricing(updated);
  };

  const updateQuantityBreak = (stitchIndex: number, qtyIndex: number, field: string, value: any) => {
    const updated = [...stitchPricing];
    updated[stitchIndex].quantityPricing[qtyIndex] = {
      ...updated[stitchIndex].quantityPricing[qtyIndex],
      [field]: value
    };
    setStitchPricing(updated);
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      vendorId,
      categoryId: strategy.id,
      pricingType: 'STITCH_COUNT',
      hasColorPricing: false,
      hasArtworkPricing: false,
      hasSizePricing: false,
      hasVariantPricing: false,
      colorPricingType: 'NONE',
      minimumQuantity: strategy.defaultFields.minimumQuantity,
      stitchPricing,
    };
    onSave(saveData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Direct Embroidery Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              helperText="Internal identifier (e.g., direct_embroidery_standard)"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              required
              helperText="Customer-facing name (e.g., Custom Embroidery)"
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
                label="Max Stitch Count"
                type="number"
                value={formData.maxStitchCount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxStitchCount: parseInt(e.target.value) || 15000 }))}
                inputProps={{ min: 1000, max: 50000 }}
                helperText="Maximum stitches per design"
              />

              <TextField
                label="Thread Change Limit"
                type="number"
                value={formData.threadChangeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, threadChangeLimit: parseInt(e.target.value) || 12 }))}
                inputProps={{ min: 1, max: 20 }}
                helperText="Max thread color changes"
              />

              <TextField
                label="Estimated Turnaround"
                value={formData.estimatedTurnaround}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTurnaround: e.target.value }))}
                helperText="e.g., 7-10 business days"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Setup Fees */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Setup & Service Fees
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Digitizing Fee"
              type="number"
              value={formData.digitizingFee}
              onChange={(e) => setFormData(prev => ({ ...prev, digitizingFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="One-time digitizing setup"
            />

            <TextField
              label="Edit Fee"
              type="number"
              value={formData.editFee}
              onChange={(e) => setFormData(prev => ({ ...prev, editFee: parseFloat(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: '$' }}
              helperText="Design modification charge"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.densityCompliance}
                  onChange={(e) => setFormData(prev => ({ ...prev, densityCompliance: e.target.checked }))}
                />
              }
              label="Density Compliance Required"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Enforce industry-standard stitch density guidelines
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stitch Count Pricing */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Stitch Count Pricing
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={initializeDefaultPricing}
                disabled={stitchPricing.length > 0}
              >
                Load Default Ranges
              </Button>
              <Button 
                startIcon={<AddIcon />} 
                size="small" 
                onClick={addStitchRange}
              >
                Add Stitch Range
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Pricing is based on total stitch count. Higher stitch counts typically cost more due to 
            increased production time and thread usage.
          </Alert>

          {stitchPricing.map((stitchRange, stitchIndex) => (
            <Card key={stitchIndex} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={`${stitchRange.minStitches.toLocaleString()} - ${stitchRange.maxStitches?.toLocaleString() || '∞'} stitches`} 
                      color="primary" 
                      variant="outlined" 
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeStitchRange(stitchIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={() => addQuantityBreak(stitchIndex)}
                  >
                    Add Quantity Break
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Min Stitches"
                    type="number"
                    value={stitchRange.minStitches}
                    onChange={(e) => updateStitchRange(stitchIndex, 'minStitches', parseInt(e.target.value) || 1)}
                    size="small"
                    inputProps={{ min: 1, step: 100 }}
                  />
                  <TextField
                    label="Max Stitches"
                    type="number"
                    value={stitchRange.maxStitches || ''}
                    onChange={(e) => updateStitchRange(stitchIndex, 'maxStitches', e.target.value ? parseInt(e.target.value) : undefined)}
                    size="small"
                    inputProps={{ min: stitchRange.minStitches + 1, step: 100 }}
                    placeholder="Leave empty for unlimited"
                  />
                </Box>

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
                      {stitchRange.quantityPricing.map((qtyBreak, qtyIndex) => (
                        <TableRow key={qtyIndex}>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.minQty}
                              onChange={(e) => updateQuantityBreak(stitchIndex, qtyIndex, 'minQty', parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={qtyBreak.maxQty || ''}
                              onChange={(e) => updateQuantityBreak(stitchIndex, qtyIndex, 'maxQty', e.target.value ? parseInt(e.target.value) : undefined)}
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
                              onChange={(e) => updateQuantityBreak(stitchIndex, qtyIndex, 'price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              InputProps={{ startAdornment: '$' }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => removeQuantityBreak(stitchIndex, qtyIndex)}
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
            helperText="Technical requirements, limitations, or embroidery-specific notes"
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
          {isEditing ? 'Update Direct Embroidery' : 'Create Direct Embroidery'}
        </Button>
      </Box>
    </Box>
  );
}