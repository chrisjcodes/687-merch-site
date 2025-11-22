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
  Divider,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getDecorationStrategy } from '@/lib/decoration-strategies';

interface QuantityPricing {
  minQty: number;
  maxQty?: number;
  colorPricing: {
    colors: number;
    price: number;
    artworkType: string;
    variantType?: string;
  }[];
}

interface ScreenPrintTransferFormProps {
  initialData?: any;
  vendorId: string;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

export function ScreenPrintTransferForm({ 
  initialData, 
  vendorId, 
  onSave, 
  isEditing = false 
}: ScreenPrintTransferFormProps) {
  const strategy = getDecorationStrategy('SCREEN_PRINT_TRANSFERS')!;
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    estimatedTurnaround: '3-5 business days',
    notes: '',
    isActive: true,
    // Strategy-specific fields
    selectedGangSheet: 'standard', // standard or jumbo
    rushServiceAvailable: false,
    rushFee: strategy.defaultFields.rushFee || 0,
    colorLimit: 6,
  });

  const [quantityPricing, setQuantityPricing] = useState<QuantityPricing[]>([]);
  const [activeArtworkType, setActiveArtworkType] = useState('VECTOR');
  const [activeColors, setActiveColors] = useState(1);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        estimatedTurnaround: initialData.estimatedTurnaround || '3-5 business days',
        notes: initialData.notes || '',
        isActive: initialData.isActive ?? true,
        selectedGangSheet: initialData.variantType || 'standard',
        rushServiceAvailable: initialData.rushFee > 0,
        rushFee: initialData.rushFee || 0,
        colorLimit: initialData.maxColors || 6,
      });
    }
  }, [initialData]);

  const initializeDefaultPricing = () => {
    // Initialize with some default pricing structure for screen print transfers
    const defaultPricing: QuantityPricing[] = strategy.quantityBreaks.slice(0, 6).map(qb => ({
      minQty: qb.minQty,
      maxQty: qb.maxQty,
      colorPricing: [
        { colors: 1, price: 0, artworkType: 'VECTOR' },
        { colors: 2, price: 0, artworkType: 'VECTOR' },
      ]
    }));
    setQuantityPricing(defaultPricing);
  };

  const addQuantityBreak = () => {
    const newBreak: QuantityPricing = {
      minQty: 1,
      maxQty: undefined,
      colorPricing: [
        { colors: 1, price: 0, artworkType: activeArtworkType }
      ]
    };
    setQuantityPricing([...quantityPricing, newBreak]);
  };

  const removeQuantityBreak = (index: number) => {
    setQuantityPricing(quantityPricing.filter((_, i) => i !== index));
  };

  const updateQuantityBreak = (index: number, field: string, value: any) => {
    const updated = [...quantityPricing];
    updated[index] = { ...updated[index], [field]: value };
    setQuantityPricing(updated);
  };

  const addColorPricing = (qbIndex: number) => {
    const updated = [...quantityPricing];
    updated[qbIndex].colorPricing.push({
      colors: activeColors,
      price: 0,
      artworkType: activeArtworkType
    });
    setQuantityPricing(updated);
  };

  const removeColorPricing = (qbIndex: number, colorIndex: number) => {
    const updated = [...quantityPricing];
    updated[qbIndex].colorPricing = updated[qbIndex].colorPricing.filter((_, i) => i !== colorIndex);
    setQuantityPricing(updated);
  };

  const updateColorPricing = (qbIndex: number, colorIndex: number, field: string, value: any) => {
    const updated = [...quantityPricing];
    updated[qbIndex].colorPricing[colorIndex] = {
      ...updated[qbIndex].colorPricing[colorIndex],
      [field]: value
    };
    setQuantityPricing(updated);
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      vendorId,
      categoryId: strategy.id, // Will need to be mapped to actual category ID
      pricingType: 'QUANTITY_BREAKS',
      hasColorPricing: true,
      hasArtworkPricing: true,
      hasSizePricing: true,
      hasVariantPricing: true,
      colorPricingType: 'PER_COLOR',
      minimumQuantity: strategy.defaultFields.minimumQuantity,
      variantType: formData.selectedGangSheet.toUpperCase(),
      quantityPricing, // This would need to be converted to the database pricing structure
    };
    onSave(saveData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Basic Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Screen Print Transfer Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              helperText="Internal identifier (e.g., screen_print_vector_standard)"
            />

            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              required
              helperText="Customer-facing name (e.g., Screen Print - Vector Artwork)"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              helperText="Describe this specific screen print offering"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Gang Sheet Size</InputLabel>
                <Select
                  value={formData.selectedGangSheet}
                  label="Gang Sheet Size"
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedGangSheet: e.target.value }))}
                >
                  <MenuItem value="standard">Standard (11.25" × 14")</MenuItem>
                  <MenuItem value="jumbo">Jumbo (12.5" × 17.5")</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Color Limit"
                type="number"
                value={formData.colorLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, colorLimit: parseInt(e.target.value) || 6 }))}
                inputProps={{ min: 1, max: 10 }}
                helperText="Max colors per design"
              />
            </Box>

            <TextField
              label="Estimated Turnaround"
              value={formData.estimatedTurnaround}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedTurnaround: e.target.value }))}
              helperText="e.g., 3-5 business days"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Rush Service */}
      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={formData.rushServiceAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, rushServiceAvailable: e.target.checked }))}
              />
            }
            label="Rush Service Available"
          />
          
          {formData.rushServiceAvailable && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Rush Fee"
                type="number"
                value={formData.rushFee}
                onChange={(e) => setFormData(prev => ({ ...prev, rushFee: parseFloat(e.target.value) || 0 }))}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{ startAdornment: '$' }}
                helperText="Per color, per order rush charge"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quantity & Pricing Configuration */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Quantity Break Pricing
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={initializeDefaultPricing}
                disabled={quantityPricing.length > 0}
              >
                Load Defaults
              </Button>
              <Button 
                startIcon={<AddIcon />} 
                size="small" 
                onClick={addQuantityBreak}
              >
                Add Break
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Configure pricing for different quantity breaks, colors, and artwork types. 
            Each quantity break can have multiple color/artwork combinations.
          </Alert>

          {/* Quick Add Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Artwork Type</InputLabel>
              <Select
                value={activeArtworkType}
                label="Artwork Type"
                onChange={(e) => setActiveArtworkType(e.target.value)}
              >
                {strategy.artworkTypes?.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Colors"
              type="number"
              size="small"
              value={activeColors}
              onChange={(e) => setActiveColors(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: formData.colorLimit }}
              sx={{ width: 80 }}
            />
          </Box>

          {/* Pricing Table */}
          {quantityPricing.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Quantity Range</TableCell>
                    <TableCell>Colors</TableCell>
                    <TableCell>Artwork Type</TableCell>
                    <TableCell>Price per Unit</TableCell>
                    <TableCell width={100}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quantityPricing.map((qb, qbIndex) => (
                    <>
                      {qb.colorPricing.map((colorPricing, colorIndex) => (
                        <TableRow key={`${qbIndex}-${colorIndex}`}>
                          {colorIndex === 0 && (
                            <TableCell rowSpan={qb.colorPricing.length} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <TextField
                                  label="Min Qty"
                                  type="number"
                                  size="small"
                                  value={qb.minQty}
                                  onChange={(e) => updateQuantityBreak(qbIndex, 'minQty', parseInt(e.target.value) || 1)}
                                  inputProps={{ min: 1 }}
                                  sx={{ width: 80 }}
                                />
                                <TextField
                                  label="Max Qty"
                                  type="number"
                                  size="small"
                                  value={qb.maxQty || ''}
                                  onChange={(e) => updateQuantityBreak(qbIndex, 'maxQty', e.target.value ? parseInt(e.target.value) : undefined)}
                                  inputProps={{ min: qb.minQty + 1 }}
                                  sx={{ width: 80 }}
                                  helperText="Leave empty for +"
                                />
                              </Box>
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip 
                              label={`${colorPricing.colors} Color${colorPricing.colors > 1 ? 's' : ''}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select
                                value={colorPricing.artworkType}
                                onChange={(e) => updateColorPricing(qbIndex, colorIndex, 'artworkType', e.target.value)}
                                displayEmpty
                              >
                                {strategy.artworkTypes?.map(type => (
                                  <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={colorPricing.price}
                              onChange={(e) => updateColorPricing(qbIndex, colorIndex, 'price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              InputProps={{ startAdornment: '$' }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {colorIndex === 0 && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => addColorPricing(qbIndex)}
                                  color="primary"
                                >
                                  <AddIcon />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small" 
                                onClick={() => colorIndex === 0 && qb.colorPricing.length === 1 
                                  ? removeQuantityBreak(qbIndex) 
                                  : removeColorPricing(qbIndex, colorIndex)
                                }
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
          {isEditing ? 'Update Screen Print Product' : 'Create Screen Print Product'}
        </Button>
      </Box>
    </Box>
  );
}