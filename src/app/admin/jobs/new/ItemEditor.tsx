'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Alert,
} from '@mui/material';

interface PlacementAnchor {
  id: string;
  name: string;
  description?: string;
  anchorType: string;
  maxOffsetUp?: number;
  maxOffsetDown?: number;
  maxOffsetLeft?: number;
  maxOffsetRight?: number;
  maxDesignWidth: number;
  maxDesignHeight: number;
  minDesignWidth?: number;
  minDesignHeight?: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  currentPrice: string;
  category: string;
  availableSizes: string[];
  variants: ProductVariant[];
  sizePricing: SizePricing[];
  decorationMethods?: string[];
  placementAnchors?: PlacementAnchor[];
}

interface ProductVariant {
  id: string;
  name: string;
  priceAdjustment: string;
  isActive: boolean;
}

interface SizePricing {
  id: string;
  size: string;
  currentPrice: string;
  isActive: boolean;
}

interface Placement {
  id: string;
  anchorPoint: string;
  offsetUp: number;    // Distance up from anchor (inches)
  offsetDown: number;  // Distance down from anchor (inches)
  offsetLeft: number;  // Distance left from anchor (inches) 
  offsetRight: number; // Distance right from anchor (inches)
  width: number;
  height: number;
  decorationMethod: string;
  transferCost: number;
  designFileName?: string;
  designFileUrl?: string;
}

interface JobItem {
  id: string;
  itemType: string;
  productId?: string;
  variantId?: string;
  variant: string;
  sizeBreakdown: Record<string, number>;
  quantity: number;
  markupPercentage: number;
  placements: Placement[];
  costPerItem: number;
}

interface ItemEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: JobItem) => void;
  item: JobItem | null;
  products: Product[];
  isEditing?: boolean;
}


export function ItemEditor({ open, onClose, onSave, item, products, isEditing = false }: ItemEditorProps) {
  const [editItem, setEditItem] = useState<JobItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize editItem when dialog opens
  useEffect(() => {
    if (open) {
      if (item) {
        setEditItem({ ...item });
      } else {
        // Create new item
        const newId = `item-${Date.now()}`;
        const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
        setEditItem({
          id: newId,
          itemType: '',
          productId: '',
          variantId: '',
          variant: '',
          sizeBreakdown: defaultSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
          quantity: 0,
          markupPercentage: 0,
          placements: [],
          costPerItem: 0,
        });
      }
      setErrors({});
    }
  }, [open, item]);

  const getProductById = (productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  const getVariantById = (product: Product, variantId: string): ProductVariant | undefined => {
    return product.variants.find(v => v.id === variantId);
  };

  const updateEditItem = (field: keyof JobItem, value: any) => {
    if (!editItem) return;
    setEditItem(prevItem => prevItem ? { ...prevItem, [field]: value } : null);
  };

  const updateSizeBreakdown = (size: string, value: string) => {
    if (!editItem) return;
    const qty = parseInt(value) || 0;
    setEditItem({
      ...editItem,
      sizeBreakdown: { ...editItem.sizeBreakdown, [size]: qty }
    });
  };

  const addPlacement = () => {
    if (!editItem || !editItem.productId) return;
    
    const newPlacement: Placement = {
      id: `placement-${Date.now()}`,
      anchorPoint: '',
      offsetUp: 0,
      offsetDown: 0,
      offsetLeft: 0,
      offsetRight: 0,
      width: 0,
      height: 0,
      decorationMethod: '',
      transferCost: 0,
    };
    
    setEditItem({
      ...editItem,
      placements: [...editItem.placements, newPlacement]
    });
  };

  const updatePlacement = (placementId: string, field: keyof Placement, value: any) => {
    if (!editItem) return;
    console.log('updatePlacement called:', placementId, field, value);
    setEditItem(prevItem => {
      if (!prevItem) return null;
      const updatedItem = {
        ...prevItem,
        placements: prevItem.placements.map(p => 
          p.id === placementId ? { ...p, [field]: value } : p
        )
      };
      console.log('Updated placement:', updatedItem.placements.find(p => p.id === placementId));
      return updatedItem;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, placementId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/jobs/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      updatePlacement(placementId, 'designFileUrl', data.url);
      updatePlacement(placementId, 'designFileName', file.name);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    }
  };

  const removePlacement = (placementId: string) => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      placements: editItem.placements.filter(p => p.id !== placementId)
    });
  };

  const validateItem = (): boolean => {
    if (!editItem) return false;
    
    const newErrors: Record<string, string> = {};
    
    if (!editItem.productId) {
      newErrors.product = 'Product is required';
    }
    
    const selectedProduct = getProductById(editItem.productId || '');
    if (selectedProduct) {
      const hasMultipleSizes = selectedProduct.availableSizes.length > 1;
      const totalQty = hasMultipleSizes 
        ? Object.values(editItem.sizeBreakdown).reduce((sum, qty) => sum + qty, 0)
        : editItem.quantity;
      
      if (totalQty <= 0) {
        newErrors.quantity = 'Quantity is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!editItem || !validateItem()) return;
    
    onSave(editItem);
    onClose();
  };

  const handleClose = () => {
    setEditItem(null);
    setErrors({});
    onClose();
  };

  if (!editItem) return null;

  const selectedProduct = getProductById(editItem.productId || '');
  const selectedVariant = editItem.variantId ? getVariantById(selectedProduct!, editItem.variantId) : null;
  const hasMultipleSizes = selectedProduct && selectedProduct.availableSizes.length > 1;
  const hasSizePricing = selectedProduct && selectedProduct.sizePricing.length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Item' : 'Add New Item'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Product Selection */}
          <FormControl fullWidth error={!!errors.product}>
            <InputLabel>Product *</InputLabel>
            <Select
              key={`product-select-${editItem.id}`}
              value={editItem.productId || ''}
              onChange={(e) => {
                const productId = e.target.value as string;
                updateEditItem('productId', productId);
                updateEditItem('variantId', ''); // Reset variant when product changes
              }}
              label="Product *"
            >
              <MenuItem value="">
                <em>Select a product...</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {product.name} ({product.sku})
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Base Price: ${product.currentPrice}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.product && <Typography variant="caption" color="error">{errors.product}</Typography>}
          </FormControl>

          {/* Variant Selection */}
          {selectedProduct && selectedProduct.variants.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Variant</InputLabel>
              <Select
                value={editItem.variantId}
                onChange={(e) => updateEditItem('variantId', e.target.value)}
                label="Variant"
              >
                <MenuItem value="">
                  <em>No variant</em>
                </MenuItem>
                {selectedProduct.variants.filter(v => v.isActive).map((variant) => (
                  <MenuItem key={variant.id} value={variant.id}>
                    <Box>
                      <Typography variant="body2">
                        {variant.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Price adjustment: {variant.priceAdjustment >= 0 ? '+' : ''}${variant.priceAdjustment}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Markup Percentage */}
          <TextField
            label="Markup Percentage (%)"
            type="number"
            value={editItem.markupPercentage}
            onChange={(e) => updateEditItem('markupPercentage', parseFloat(e.target.value) || 0)}
            placeholder="0"
            inputProps={{ min: 0, max: 1000, step: 0.1 }}
            helperText="Markup percentage applied to base product cost"
          />

          {/* Quantities with Pricing */}
          {selectedProduct && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quantities *
              </Typography>
              
              {hasMultipleSizes ? (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 'medium' }}>
                    Size Breakdown (Base + Variant Adjustment)
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {selectedProduct.availableSizes.map((size) => {
                      const qty = editItem.sizeBreakdown[size] || 0;
                      const sizePrice = selectedProduct.sizePricing?.find(sp => sp.size === size);
                      const variantAdjustment = Number(selectedVariant?.priceAdjustment) || 0;
                      const basePriceForSize = sizePrice 
                        ? Number(sizePrice.currentPrice) + variantAdjustment 
                        : Number(selectedProduct.currentPrice) + variantAdjustment;
                      
                      return (
                        <Box
                          key={size}
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: qty > 0 ? 'primary.main' : 'grey.300',
                            borderRadius: 1,
                            bgcolor: qty > 0 ? 'primary.50' : 'white',
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {size}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                            ${basePriceForSize.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color={qty > 0 ? "primary" : "text.secondary"} sx={{ mb: 1, display: 'block', minHeight: '16px' }}>
                            {qty > 0 ? `${qty}x = $${(basePriceForSize * qty).toFixed(2)}` : 'None'}
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={qty || ''}
                            onChange={(e) => updateSizeBreakdown(size, e.target.value)}
                            inputProps={{ min: 0 }}
                            placeholder="0"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: qty > 0 ? 'primary.main' : undefined,
                                },
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.50', borderRadius: 0.5, border: 1, borderColor: 'primary.200' }}>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      Total Quantity: {Object.values(editItem.sizeBreakdown).reduce((sum, qty) => sum + qty, 0)}
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <TextField
                  label="Total Quantity *"
                  type="number"
                  value={editItem.quantity || ''}
                  onChange={(e) => updateEditItem('quantity', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                  placeholder="0"
                  fullWidth
                  required
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
              )}
            </Box>
          )}

          {/* Print Placements */}
          {selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2">
                  Print Placements
                </Typography>
                <Button
                  disabled={!editItem.productId}
                  size="small"
                  variant="contained"
                  onClick={addPlacement}
                >
                  Add Placement
                </Button>
              </Box>

              {editItem.placements.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body2" color="textSecondary">
                    No print placements added yet
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Add placement locations for designs, logos, or text
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {editItem.placements.map((placement, index) => (
                    <Paper key={placement.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Placement {index + 1}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removePlacement(placement.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel>Anchor Point *</InputLabel>
                          <Select
                            key={`anchor-select-${placement.id}-${placement.anchorPoint || 'empty'}`}
                            value={placement.anchorPoint || ''}
                            onChange={(e) => {
                              const anchorName = e.target.value as string;
                              console.log('Anchor point selected:', anchorName);
                              console.log('Placement ID:', placement.id);
                              updatePlacement(placement.id, 'anchorPoint', anchorName);
                              
                              // Auto-populate recommended design size from selected anchor
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === anchorName);
                              if (anchorData) {
                                console.log('Auto-populating size:', anchorData.maxDesignWidth, 'x', anchorData.maxDesignHeight);
                                updatePlacement(placement.id, 'width', anchorData.maxDesignWidth);
                                updatePlacement(placement.id, 'height', anchorData.maxDesignHeight);
                              }
                            }}
                            label="Anchor Point *"
                          >
                            <MenuItem value="">
                              <em>Select anchor point...</em>
                            </MenuItem>
                            {(() => {
                              console.log('Selected product:', selectedProduct?.name);
                              console.log('Selected product anchors:', selectedProduct?.placementAnchors?.length);
                              return selectedProduct?.placementAnchors?.map((anchor) => {
                                console.log('Rendering anchor:', anchor);
                                return (
                              <MenuItem key={anchor.id} value={anchor.name}>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {anchor.name}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {anchor.description} (Max Design: {anchor.maxDesignWidth}" x {anchor.maxDesignHeight}")
                                  </Typography>
                                </Box>
                              </MenuItem>
                              );
                              });
                            })() || (
                              <MenuItem value="" disabled>
                                <em>No anchor points available</em>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>

                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                          Position from Anchor Point (inches)
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <TextField
                            label="Up from anchor"
                            type="number"
                            value={placement.offsetUp || ''}
                            onChange={(e) => updatePlacement(placement.id, 'offsetUp', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.25 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              return anchorData?.maxOffsetUp ? `Max: ${anchorData.maxOffsetUp}"` : '';
                            })()}
                          />
                          <TextField
                            label="Down from anchor"
                            type="number"
                            value={placement.offsetDown || ''}
                            onChange={(e) => updatePlacement(placement.id, 'offsetDown', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.25 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              return anchorData?.maxOffsetDown ? `Max: ${anchorData.maxOffsetDown}"` : '';
                            })()}
                          />
                          <TextField
                            label="Left from anchor"
                            type="number"
                            value={placement.offsetLeft || ''}
                            onChange={(e) => updatePlacement(placement.id, 'offsetLeft', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.25 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              return anchorData?.maxOffsetLeft ? `Max: ${anchorData.maxOffsetLeft}"` : '';
                            })()}
                          />
                          <TextField
                            label="Right from anchor"
                            type="number"
                            value={placement.offsetRight || ''}
                            onChange={(e) => updatePlacement(placement.id, 'offsetRight', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.25 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              return anchorData?.maxOffsetRight ? `Max: ${anchorData.maxOffsetRight}"` : '';
                            })()}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <TextField
                            label="Width (inches)"
                            type="number"
                            value={placement.width || ''}
                            onChange={(e) => updatePlacement(placement.id, 'width', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.1 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              if (anchorData) {
                                return `Max: ${anchorData.maxDesignWidth}"${anchorData.minDesignWidth ? `, Min: ${anchorData.minDesignWidth}"` : ''}`;
                              }
                              return '';
                            })()}
                          />
                          <TextField
                            label="Height (inches)"
                            type="number"
                            value={placement.height || ''}
                            onChange={(e) => updatePlacement(placement.id, 'height', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.1 }}
                            placeholder="0"
                            helperText={(() => {
                              const anchorData = selectedProduct?.placementAnchors?.find(anchor => anchor.name === placement.anchorPoint);
                              if (anchorData) {
                                return `Max: ${anchorData.maxDesignHeight}"${anchorData.minDesignHeight ? `, Min: ${anchorData.minDesignHeight}"` : ''}`;
                              }
                              return '';
                            })()}
                          />
                        </Box>
                        
                        <FormControl fullWidth>
                          <InputLabel>Decoration Method *</InputLabel>
                          <Select
                            value={placement.decorationMethod}
                            onChange={(e) => updatePlacement(placement.id, 'decorationMethod', e.target.value)}
                            label="Decoration Method *"
                          >
                            <MenuItem value="">
                              <em>Select decoration method...</em>
                            </MenuItem>
                            {selectedProduct?.decorationMethods?.map((method) => (
                              <MenuItem key={method} value={method}>
                                <Typography variant="body2">
                                  {method}
                                </Typography>
                              </MenuItem>
                            )) || (
                              <MenuItem value="" disabled>
                                <em>No decoration methods available</em>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                        
                        <TextField
                          label="Transfer/Patch Cost ($)"
                          type="number"
                          value={placement.transferCost || ''}
                          onChange={(e) => updatePlacement(placement.id, 'transferCost', parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, step: 0.01 }}
                          placeholder="0.00"
                          helperText="Cost per transfer, patch, or special decoration"
                        />
                        
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Design File
                          </Typography>
                          {placement.designFileUrl ? (
                            <Box sx={{ 
                              p: 2, 
                              border: '1px dashed', 
                              borderColor: 'success.main',
                              borderRadius: 1,
                              backgroundColor: 'success.50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="success.main">
                                  📎 {placement.designFileName || 'Uploaded file'}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  updatePlacement(placement.id, 'designFileUrl', '');
                                  updatePlacement(placement.id, 'designFileName', '');
                                }}
                              >
                                Remove
                              </Button>
                            </Box>
                          ) : (
                            <Box>
                              <input
                                accept=".png,.jpg,.jpeg,.svg,.pdf,.eps,.ai"
                                style={{ display: 'none' }}
                                id={`design-file-${placement.id}`}
                                type="file"
                                onChange={(e) => handleFileUpload(e, placement.id)}
                              />
                              <label htmlFor={`design-file-${placement.id}`}>
                                <Button
                                  variant="outlined"
                                  component="span"
                                  fullWidth
                                  sx={{ 
                                    p: 3,
                                    border: '2px dashed',
                                    borderColor: 'grey.300',
                                    '&:hover': {
                                      borderColor: 'primary.main',
                                      backgroundColor: 'primary.50'
                                    }
                                  }}
                                >
                                  📁 Upload Design File
                                </Button>
                              </label>
                              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                Accepted formats: PNG, JPG, SVG, PDF, EPS, AI
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!selectedProduct || (hasMultipleSizes ? Object.values(editItem.sizeBreakdown).reduce((sum, qty) => sum + qty, 0) <= 0 : editItem.quantity <= 0)}
        >
          {isEditing ? 'Save Changes' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}