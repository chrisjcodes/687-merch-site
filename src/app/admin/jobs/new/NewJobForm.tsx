'use client';

import { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Divider,
  ListSubheader,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { ItemEditor } from './ItemEditor';
import { useRouter } from 'next/navigation';

// Size options by item category
const sizeOptions = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  accessories: ['One Size'],
  drinkware: ['11oz', '15oz', '20oz'],
  promotional: ['One Size'],
  bags: ['One Size'],
  tech: ['One Size']
};

interface Product {
  id: string;
  name: string;
  sku: string;
  currentPrice: string;
  brand?: string;
  category: string;
  availableSizes: string[];
  variants: ProductVariant[];
  sizePricing: SizePricing[];
  decorationMethods?: string[];
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

interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
}

interface Placement {
  id: string;
  location: string;
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

interface NewJobFormProps {
  customers: Customer[];
}

interface PricingResult {
  materialCost: number;
  appliqueCost: number;
  decorationBreakdown: {
    initialFee: number;
    additionalPlacementFees: number;
    transferCosts: number;
    total: number;
  };
  totalCostPerItem: number;
  totalCost: number;
  quantityBreak?: string;
}

export function NewJobForm({ customers }: NewJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [itemCounter, setItemCounter] = useState(0);
  const [placementCounter, setPlacementCounter] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [itemPricing, setItemPricing] = useState<Record<string, PricingResult>>({});
  const [calculatingPricing, setCalculatingPricing] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    customerId: '',
    dueDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 10);
      return date.toISOString().split('T')[0];
    })(),
    notes: '',
  });
  
  const [items, setItems] = useState<JobItem[]>([]);
  const [itemEditorOpen, setItemEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JobItem | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/jobs?action=form-data');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-calculate pricing when items change
  useEffect(() => {
    items.forEach(item => {
      if (item.productId && (
        Object.values(item.sizeBreakdown).reduce((sum, qty) => sum + qty, 0) > 0 || 
        item.quantity > 0
      )) {
        // Only calculate if we don't already have pricing for this item
        if (!itemPricing[item.id] && !calculatingPricing[item.id]) {
          calculateItemPricing(item);
        }
      }
    });
  }, [items, itemPricing, calculatingPricing]);

  // Helper function to get product by ID
  const getProductById = useCallback((productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  }, [products]);

  // Helper function to get variant by ID
  const getVariantById = (product: Product, variantId: string): ProductVariant | undefined => {
    return product.variants.find(v => v.id === variantId);
  };

  // Form validation function
  const isFormValid = (): boolean => {
    // Check if customer is selected
    if (!formData.customerId) return false;
    
    // Check if we have at least one item
    if (items.length === 0) return false;
    
    // Check each item for required fields
    return items.every(item => {
      // Must have product selected
      if (!item.productId) return false;
      
      // Must have quantities entered
      const selectedProduct = getProductById(item.productId);
      if (!selectedProduct) return false;
      
      const hasMultipleSizes = selectedProduct.availableSizes.length > 1;
      const totalQty = hasMultipleSizes 
        ? Object.values(item.sizeBreakdown).reduce((sum, qty) => sum + qty, 0)
        : item.quantity;
      
      if (totalQty <= 0) return false;
      
      return true;
    });
  };

  // ItemEditor helper functions
  const openItemEditor = (item?: JobItem) => {
    setEditingItem(item || null);
    setItemEditorOpen(true);
  };

  const closeItemEditor = () => {
    setItemEditorOpen(false);
    setEditingItem(null);
  };

  const handleItemSave = (item: JobItem) => {
    if (editingItem) {
      // Editing existing item
      setItems(prevItems =>
        prevItems.map(i => i.id === item.id ? item : i)
      );
    } else {
      // Adding new item
      setItems(prevItems => [...prevItems, item]);
    }
    
    // Clear any existing pricing for this item since it may have changed
    setItemPricing(prev => {
      const { [item.id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const createEmptyPlacement = (): Placement => {
    const newId = `placement-${placementCounter}`;
    setPlacementCounter(prev => prev + 1);
    return {
      id: newId,
      location: '',
      width: 0,
      height: 0,
      decorationMethod: '',
      transferCost: 0,
    };
  };

  const createEmptyItem = (): JobItem => {
    const newId = `item-${itemCounter}`;
    setItemCounter(prev => prev + 1);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    return {
      id: newId,
      itemType: '',
      productId: '',
      variantId: '',
      variant: '',
      sizeBreakdown: sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
      quantity: 0,
      markupPercentage: 0,
      placements: [],
      costPerItem: 0,
    };
  };

  const addItem = () => {
    setItems(prev => [...prev, createEmptyItem()]);
  };

  const updateItem = (itemId: string, field: keyof JobItem, value: any) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const updateItemSizeBreakdown = (itemId: string, size: string, value: string) => {
    const qty = parseInt(value) || 0;
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, sizeBreakdown: { ...item.sizeBreakdown, [size]: qty } }
        : item
    ));
  };

  const addPlacement = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, placements: [...item.placements, createEmptyPlacement()] }
        : item
    ));
  };

  const updatePlacement = (itemId: string, placementId: string, field: keyof Placement, value: any) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? {
            ...item, 
            placements: item.placements.map(p => 
              p.id === placementId ? { ...p, [field]: value } : p
            )
          }
        : item
    ));
  };

  const removePlacement = (itemId: string, placementId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, placements: item.placements.filter(p => p.id !== placementId) }
        : item
    ));
  };

  // Simple pricing calculation function
  const calculateItemPricing = async (item: JobItem) => {
    if (!item.productId) return;
    
    const selectedProduct = getProductById(item.productId);
    if (!selectedProduct) return;

    const hasMultipleSizes = selectedProduct.availableSizes.length > 1;
    const quantity = hasMultipleSizes 
      ? Object.values(item.sizeBreakdown).reduce((sum, qty) => sum + qty, 0)
      : item.quantity;

    if (quantity <= 0) return;

    // Skip if already calculating this item
    if (calculatingPricing[item.id]) return;
    
    setCalculatingPricing(prev => ({ ...prev, [item.id]: true }));

    try {
      const response = await fetch('/api/admin/pricing/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity,
          sizeBreakdown: hasMultipleSizes ? item.sizeBreakdown : undefined,
          markupPercentage: item.markupPercentage || 0,
          placements: item.placements.map(p => ({
            id: p.id,
            location: p.location,
            width: p.width,
            height: p.height,
            decorationMethod: p.decorationMethod,
            transferCost: p.transferCost || 0
          }))
        }),
      });

      if (response.ok) {
        const pricingResult: PricingResult = await response.json();
        setItemPricing(prev => ({ ...prev, [item.id]: pricingResult }));
        
        // Update the item with the calculated cost per item
        setItems(prevItems => 
          prevItems.map(i => 
            i.id === item.id 
              ? { ...i, costPerItem: pricingResult.totalCostPerItem }
              : i
          )
        );
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
    } finally {
      setCalculatingPricing(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill in all required fields');
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
          dueDate: formData.dueDate,
          notes: formData.notes,
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: Object.values(item.sizeBreakdown).reduce((sum, qty) => sum + qty, 0) || item.quantity,
            unitPrice: item.costPerItem || 0,
            notes: null,
            sizeBreakdown: item.sizeBreakdown,
            printSpec: {
              placements: item.placements
            }
          }))
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/jobs/${result.jobId}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Customer Selection - First */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Customer
          </Typography>
          
          <FormControl fullWidth required>
            <InputLabel>Customer *</InputLabel>
            <Select
              value={formData.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              label="Customer *"
            >
              <MenuItem value="">
                <em>Select a customer...</em>
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                  {customer.company && ` (${customer.company})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Items Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Order Items
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openItemEditor()}
              size="small"
            >
              Add Item
            </Button>
          </Box>

          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                No items added yet
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => openItemEditor()}>
                Add First Item
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item, index) => {
                const selectedProduct = getProductById(item.productId || '');
                const selectedVariant = item.variantId ? getVariantById(selectedProduct!, item.variantId) : null;
                const totalQty = Object.values(item.sizeBreakdown).reduce((sum, qty) => sum + qty, 0) || item.quantity;
                const pricing = itemPricing[item.id];
                
                return (
                  <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Item #{index + 1}
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="body2" color="textSecondary">Product:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {selectedProduct ? `${selectedProduct.name} (${selectedProduct.sku})` : 'Not selected'}
                            </Typography>
                          </Box>
                          
                          {selectedVariant && (
                            <Box>
                              <Typography variant="body2" color="textSecondary">Variant:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {selectedVariant.name}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box>
                            <Typography variant="body2" color="textSecondary">Quantity:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {totalQty} items
                            </Typography>
                          </Box>
                          
                          {item.markupPercentage > 0 && (
                            <Box>
                              <Typography variant="body2" color="textSecondary">Markup:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.markupPercentage}%
                              </Typography>
                            </Box>
                          )}
                          
                          <Box>
                            <Typography variant="body2" color="textSecondary">Placements:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {item.placements.length} locations
                            </Typography>
                          </Box>
                          
                          {pricing && (
                            <Box>
                              <Typography variant="body2" color="textSecondary">Total Cost:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                ${pricing.totalCost.toFixed(2)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        {/* Size breakdown summary for multi-size items */}
                        {selectedProduct && selectedProduct.availableSizes.length > 1 && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Size breakdown:
                            </Typography>
                            <Typography variant="body2">
                              {Object.entries(item.sizeBreakdown)
                                .filter(([_, qty]) => qty > 0)
                                .map(([size, qty]) => `${size}: ${qty}`)
                                .join(', ') || 'None selected'}
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Placements summary */}
                        {item.placements.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Placements:
                            </Typography>
                            <Typography variant="body2">
                              {item.placements.map(p => p.location).filter(Boolean).join(', ') || 'Locations not set'}
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Detailed Pricing Breakdown */}
                        {pricing && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
                              Complete Cost Breakdown
                            </Typography>
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 1, mb: 2, alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Item</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>Total</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>Per Item</Typography>
                              
                              <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />
                              
                              {/* Base Material Cost */}
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Base Material Cost (Wholesale)</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>${pricing.materialCost.toFixed(2)}</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>${(pricing.materialCost / totalQty).toFixed(2)}</Typography>
                              
                              {/* Final Product Cost */}
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Product Cost (with markup)</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'medium' }}>${pricing.appliqueCost.toFixed(2)}</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'medium' }}>${(pricing.appliqueCost / totalQty).toFixed(2)}</Typography>
                              
                              {/* Decoration Costs Breakdown */}
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                Decoration ({pricing.quantityBreak}):
                              </Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center' }}></Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center' }}></Typography>
                              
                              <Typography variant="body2" sx={{ pl: 2 }}>• Initial Fee</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center' }}>${(pricing.decorationBreakdown.initialFee * totalQty).toFixed(2)}</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center' }}>${pricing.decorationBreakdown.initialFee.toFixed(2)}</Typography>
                              
                              {pricing.decorationBreakdown.additionalPlacementFees > 0 && (
                                <>
                                  <Typography variant="body2" sx={{ pl: 2 }}>• Additional Placements</Typography>
                                  <Typography variant="body2" sx={{ textAlign: 'center' }}>${(pricing.decorationBreakdown.additionalPlacementFees * totalQty).toFixed(2)}</Typography>
                                  <Typography variant="body2" sx={{ textAlign: 'center' }}>${pricing.decorationBreakdown.additionalPlacementFees.toFixed(2)}</Typography>
                                </>
                              )}
                              
                              {pricing.decorationBreakdown.transferCosts > 0 && (
                                <>
                                  <Typography variant="body2" sx={{ pl: 2 }}>• Transfer/Patch Costs</Typography>
                                  <Typography variant="body2" sx={{ textAlign: 'center' }}>${(pricing.decorationBreakdown.transferCosts * totalQty).toFixed(2)}</Typography>
                                  <Typography variant="body2" sx={{ textAlign: 'center' }}>${pricing.decorationBreakdown.transferCosts.toFixed(2)}</Typography>
                                </>
                              )}
                              
                              <Typography variant="body2" sx={{ pl: 2, fontWeight: 'medium' }}>Decoration Subtotal</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'medium' }}>${pricing.decorationBreakdown.total.toFixed(2)}</Typography>
                              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'medium' }}>${(pricing.decorationBreakdown.total / totalQty).toFixed(2)}</Typography>
                            </Box>
                            
                            <Divider sx={{ my: 1.5 }} />
                            
                            {/* Total Summary */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 1, alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Total Cost:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                ${pricing.totalCost.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                ${pricing.totalCostPerItem.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => openItemEditor(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => removeItem(item.id)}
                        >
                          Delete
                        </Button>
                        {selectedProduct && totalQty > 0 && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => calculateItemPricing(item)}
                            disabled={calculatingPricing[item.id]}
                          >
                            {calculatingPricing[item.id] ? 'Calculating...' : 'Calculate Price'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
          
          {/* ItemEditor Dialog */}
          <ItemEditor
            open={itemEditorOpen}
            onClose={closeItemEditor}
            onSave={handleItemSave}
            item={editingItem}
            products={products}
            isEditing={!!editingItem}
          />
        </Box>

        {items.length > 0 && (
          <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderColor: 'info.200' }}>
            <Typography variant="h6" color="info.main" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
              <Typography variant="body2">
                <strong>Items:</strong> {items.length}
              </Typography>
              <Typography variant="body2">
                <strong>Total Quantity:</strong> {items.reduce((sum, item) => {
                  return sum + (Object.values(item.sizeBreakdown).reduce((s, q) => s + q, 0) || item.quantity || 0);
                }, 0)}
              </Typography>
              <Typography variant="body2">
                <strong>Total Cost:</strong> ${items.reduce((sum, item) => {
                  const pricing = itemPricing[item.id];
                  return sum + (pricing?.totalCost || 0);
                }, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Average Per Item:</strong> ${(() => {
                  const totalCost = items.reduce((sum, item) => {
                    const pricing = itemPricing[item.id];
                    return sum + (pricing?.totalCost || 0);
                  }, 0);
                  const totalQuantity = items.reduce((sum, item) => {
                    return sum + (Object.values(item.sizeBreakdown).reduce((s, q) => s + q, 0) || item.quantity || 0);
                  }, 0);
                  return totalQuantity > 0 ? (totalCost / totalQuantity).toFixed(2) : '0.00';
                })()}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      <Divider />

      {/* Job Details */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Job Details
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Special Instructions & Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            fullWidth
            placeholder="Include any special requirements, rush requests, color preferences, or other important details..."
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Submit Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Ready to create this job?
          </Typography>
          {!isFormValid() && (
            <Typography variant="caption" color="error">
              {!formData.customerId ? 'Please select a customer' :
               items.length === 0 ? 'Please add at least one item' :
               'Please complete all item details (product selection and quantities)'}
            </Typography>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting || items.length === 0 || !formData.customerId || !isFormValid()}
          sx={{ 
            minWidth: 200,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {isSubmitting ? 'Creating Job...' : 'Create Job'}
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Job created successfully! Redirecting to job details...
        </Alert>
      </Snackbar>
    </Paper>
  );
}