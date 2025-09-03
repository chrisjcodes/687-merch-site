'use client';

import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { allForYear as getFederalHolidays } from '@18f/us-federal-holidays';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ItemTemplate {
  id: string;
  name: string;
  description?: string;
  timesOrdered?: number;
  lastOrderedAt?: string;
  product: {
    id: string;
    name: string;
    sku: string;
    availableSizes: string[];
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    colorHex?: string;
  };
  standardSizes?: any;
}

interface ItemOrder {
  itemTemplateId: string;
  itemTemplate: ItemTemplate;
  sizeBreakdown: Record<string, number>;
  notes: string;
}

// Helper function to check if a date is a federal holiday
const isHoliday = (date: Date, holidays: any[]): boolean => {
  return holidays.some(holiday => {
    const holidayDate = new Date(holiday.date);
    return date.toDateString() === holidayDate.toDateString();
  });
};

// Helper function to calculate the minimum allowed dispatch date
const getMinimumAllowedDate = (): Date => {
  const today = new Date();
  let minDate = new Date(today);
  minDate.setDate(today.getDate() + 10);

  // Get current year federal holidays
  const currentYear = minDate.getFullYear();
  const holidays = getFederalHolidays(currentYear);

  // If the minimum date is a weekend or holiday, move to next valid day
  while (minDate.getDay() === 0 || minDate.getDay() === 6 || isHoliday(minDate, holidays)) {
    minDate.setDate(minDate.getDate() + 1);
  }

  return minDate;
};

// Helper function to generate disabled dates for the date picker
const getDisabledDates = (): string[] => {
  const today = new Date();
  const minDate = getMinimumAllowedDate();
  const disabledDates: string[] = [];
  
  // Get federal holidays for current and next year (to cover date range)
  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;
  const holidays = [
    ...getFederalHolidays(currentYear),
    ...getFederalHolidays(nextYear)
  ];

  // Disable all dates before minimum date
  const dateIterator = new Date(today);
  while (dateIterator < minDate) {
    disabledDates.push(dateIterator.toISOString().split('T')[0]);
    dateIterator.setDate(dateIterator.getDate() + 1);
  }

  // Disable federal holidays for the next 2 years
  holidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date);
    // Only include holidays that are in the future
    if (holidayDate >= today) {
      disabledDates.push(holidayDate.toISOString().split('T')[0]);
    }
  });

  return disabledDates;
};

// Validate if a date meets our requirements
const validateTargetDate = (dateString: string): string | null => {
  if (!dateString) return null; // Optional field

  const selectedDate = new Date(dateString);
  const minDate = getMinimumAllowedDate();

  if (selectedDate < minDate) {
    const formattedMinDate = minDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `Target dispatch date must be at least ${formattedMinDate} (10 business days from today, excluding federal holidays).`;
  }

  // Check if selected date is a federal holiday
  const currentYear = selectedDate.getFullYear();
  const holidays = getFederalHolidays(currentYear);

  if (isHoliday(selectedDate, holidays)) {
    return 'Target dispatch date cannot be a federal holiday. Please choose a different date.';
  }

  return null;
};

export default function ReorderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<ItemTemplate[]>([]);
  const [itemOrders, setItemOrders] = useState<ItemOrder[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [generalNotes, setGeneralNotes] = useState('');
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [disabledDates, setDisabledDates] = useState<string[]>([]);
  
  // Add items modal state
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [allCustomerItems, setAllCustomerItems] = useState<ItemTemplate[]>([]);
  const [loadingAllItems, setLoadingAllItems] = useState(false);

  // Calculate disabled dates on component mount
  useEffect(() => {
    const disabled = getDisabledDates();
    setDisabledDates(disabled);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'CUSTOMER') {
      router.push('/auth/signin');
      return;
    }

    const itemIds = searchParams?.getAll('items') || [];
    if (itemIds.length === 0) {
      router.push('/portal/items');
      return;
    }

    fetchSelectedItems(itemIds);
  }, [session, status, router, searchParams]);

  const fetchSelectedItems = async (itemIds: string[]) => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer/items');
      if (response.ok) {
        const data = await response.json();
        const selectedItems = data.items.filter((item: ItemTemplate) => 
          itemIds.includes(item.id)
        );
        
        setItems(selectedItems);
        
        // Initialize item orders with standard sizes if available
        const initialOrders = selectedItems.map((item: ItemTemplate) => ({
          itemTemplateId: item.id,
          itemTemplate: item,
          sizeBreakdown: item.standardSizes || {},
          notes: '',
        }));
        
        setItemOrders(initialOrders);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to load items for reorder');
    } finally {
      setLoading(false);
    }
  };

  const updateItemOrder = (itemTemplateId: string, field: keyof ItemOrder, value: any) => {
    setItemOrders(prev => 
      prev.map(order => 
        order.itemTemplateId === itemTemplateId 
          ? { ...order, [field]: value }
          : order
      )
    );
  };

  const updateSizeBreakdown = (itemTemplateId: string, size: string, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    
    setItemOrders(prev => 
      prev.map(order => 
        order.itemTemplateId === itemTemplateId 
          ? { 
              ...order, 
              sizeBreakdown: {
                ...order.sizeBreakdown,
                [size]: qty
              }
            }
          : order
      )
    );
  };

  const getTotalQuantity = (sizeBreakdown: Record<string, number>) => {
    return Object.values(sizeBreakdown).reduce((sum, qty) => sum + (qty || 0), 0);
  };

  const removeItem = (itemTemplateId: string) => {
    setItemOrders(prev => prev.filter(order => order.itemTemplateId !== itemTemplateId));
  };

  const fetchAllCustomerItems = async () => {
    try {
      setLoadingAllItems(true);
      const response = await fetch('/api/customer/items?pageSize=50'); // Get more items for selection
      if (response.ok) {
        const data = await response.json();
        setAllCustomerItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch all customer items:', error);
    } finally {
      setLoadingAllItems(false);
    }
  };

  const handleAddItemsClick = () => {
    setShowAddItemsModal(true);
    fetchAllCustomerItems();
  };

  const addSelectedItems = (selectedItemIds: string[]) => {
    const newItems = allCustomerItems.filter(item => 
      selectedItemIds.includes(item.id) && 
      !itemOrders.some(order => order.itemTemplateId === item.id)
    );

    const newOrders = newItems.map(item => ({
      itemTemplateId: item.id,
      itemTemplate: item,
      sizeBreakdown: item.standardSizes || {},
      notes: '',
    }));

    setItemOrders(prev => [...prev, ...newOrders]);
    setShowAddItemsModal(false);
  };

  const handleDateChange = (newDate: Date | null) => {
    setDueDate(newDate);
    if (newDate) {
      const dateString = newDate.toISOString().split('T')[0];
      const validationError = validateTargetDate(dateString);
      setDateError(validationError || '');
    } else {
      setDateError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that we have items and at least one item has quantities
    if (itemOrders.length === 0) {
      setError('Please add at least one item to your reorder');
      return;
    }
    
    const hasValidItems = itemOrders.some(order => 
      getTotalQuantity(order.sizeBreakdown) > 0
    );
    
    if (!hasValidItems) {
      setError('Please specify quantities for at least one item');
      return;
    }

    // Validate target date
    if (dueDate) {
      const dateString = dueDate.toISOString().split('T')[0];
      const dateValidationError = validateTargetDate(dateString);
      if (dateValidationError) {
        setDateError(dateValidationError);
        setError('Please correct the target dispatch date before submitting.');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch('/api/customer/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemOrders: itemOrders.filter(order => 
            getTotalQuantity(order.sizeBreakdown) > 0
          ),
          dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
          generalNotes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/portal/orders`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create reorder');
      }
    } catch (error) {
      console.error('Failed to submit reorder:', error);
      setError('Failed to submit reorder. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const AddItemsModal = () => {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    
    const handleItemSelect = (itemId: string) => {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
      const availableItems = allCustomerItems.filter(item => 
        !itemOrders.some(order => order.itemTemplateId === item.id)
      );
      
      if (selectedItems.size === availableItems.length) {
        setSelectedItems(new Set());
      } else {
        setSelectedItems(new Set(availableItems.map(item => item.id)));
      }
    };

    const availableItems = allCustomerItems.filter(item => 
      !itemOrders.some(order => order.itemTemplateId === item.id)
    );

    return (
      <Dialog open={showAddItemsModal} onClose={() => setShowAddItemsModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Items to Reorder
          <IconButton
            onClick={() => setShowAddItemsModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingAllItems ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {availableItems.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  All available items are already in your reorder. Create new items by placing orders first.
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedItems.size > 0 && selectedItems.size < availableItems.length}
                            checked={availableItems.length > 0 && selectedItems.size === availableItems.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Times Ordered</TableCell>
                        <TableCell>Last Ordered</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableItems.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleItemSelect(item.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                            {item.description && (
                              <Typography variant="caption" color="textSecondary">
                                {item.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.product.name}
                            </Typography>
                            {item.variant && (
                              <Typography variant="caption" color="textSecondary">
                                {item.variant.name}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.timesOrdered} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.lastOrderedAt ? new Date(item.lastOrderedAt).toLocaleDateString() : 'Never'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddItemsModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => addSelectedItems(Array.from(selectedItems))}
            disabled={selectedItems.size === 0}
          >
            Add {selectedItems.size} Items
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Create Reorder
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Items Configuration */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Items & Quantities ({itemOrders.length} items)
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItemsClick}
              >
                Add Items
              </Button>
            </Box>
            
            {itemOrders.length === 0 ? (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No items selected for reorder. Click "Add Items" to choose items from your library.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              itemOrders.map((order, index) => (
                <Card key={order.itemTemplateId} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {order.itemTemplate.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {order.itemTemplate.product.name}
                          {order.itemTemplate.variant && ` - ${order.itemTemplate.variant.name}`}
                        </Typography>
                      </Box>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => removeItem(order.itemTemplateId)}
                        sx={{ mt: -1 }}
                      >
                        Remove Item
                      </Button>
                    </Box>
                  
                  {/* Size Breakdown */}
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Size Quantities
                  </Typography>
                  <Grid container spacing={2}>
                    {order.itemTemplate.product.availableSizes.map(size => (
                      <Grid item xs={6} sm={4} md={3} key={size}>
                        <TextField
                          label={size}
                          type="number"
                          size="small"
                          value={order.sizeBreakdown[size] || ''}
                          onChange={(e) => updateSizeBreakdown(order.itemTemplateId, size, e.target.value)}
                          inputProps={{ min: 0 }}
                          fullWidth
                        />
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                    Total Quantity: {getTotalQuantity(order.sizeBreakdown)}
                  </Typography>
                  
                  <TextField
                    label="Item Notes"
                    multiline
                    rows={2}
                    value={order.notes}
                    onChange={(e) => updateItemOrder(order.itemTemplateId, 'notes', e.target.value)}
                    placeholder="Special instructions for this item..."
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
              ))
            )}
          </Grid>

          {/* Order Details */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Details
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Target Dispatch Date"
                  value={dueDate}
                  onChange={handleDateChange}
                  minDate={getMinimumAllowedDate()}
                  shouldDisableDate={(date) => {
                    // Disable weekends
                    if (date.getDay() === 0 || date.getDay() === 6) {
                      return true;
                    }
                    // Disable federal holidays
                    const dateString = date.toISOString().split('T')[0];
                    return disabledDates.includes(dateString);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!dateError,
                      helperText: dateError || 'Optional - minimum 10 business days from today, excluding federal holidays and weekends',
                      sx: { mb: 2 }
                    }
                  }}
                />
              </LocalizationProvider>
              
              <TextField
                label="General Notes"
                multiline
                rows={4}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Any general notes or special requirements..."
                fullWidth
                sx={{ mb: 3 }}
              />
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 1 }}>
                Order Summary
              </Typography>
              {itemOrders.map(order => {
                const totalQty = getTotalQuantity(order.sizeBreakdown);
                if (totalQty === 0) return null;
                
                return (
                  <Box key={order.itemTemplateId} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {order.itemTemplate.name}: {totalQty} items
                    </Typography>
                  </Box>
                );
              })}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? 'Creating Order...' : 'Create Reorder'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>

      {/* Add Items Modal */}
      <AddItemsModal />
    </Container>
  );
}