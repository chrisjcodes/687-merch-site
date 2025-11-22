'use client';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { StrategyBasedDecorationDialog } from './StrategyBasedDecorationDialog';

interface DecorationProduct {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  defaultMinWidth?: number;
  defaultMaxWidth?: number;
  defaultMinHeight?: number;
  defaultMaxHeight?: number;
  colorOptions: string[];
  hasColorLimitations: boolean;
  maxColors?: number;
  baseSetupCost?: number;
  perColorCost?: number;
  perUnitCost?: number;
  estimatedTurnaround?: string;
  category: {
    id: string;
    name: string;
    displayName: string;
  };
  vendor: {
    id: string;
    name: string;
    displayName: string;
    paymentTerms?: string;
    minimumOrder?: number;
  };
  compatibilities: Array<{
    id: string;
    product: {
      id: string;
      sku: string;
      name: string;
      category: string;
    };
  }>;
  _count: {
    compatibilities: number;
  };
}

export function DecorationMethodsTab() {
  const [decorationProducts, setDecorationProducts] = useState<DecorationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DecorationProduct | null>(null);

  useEffect(() => {
    fetchDecorationProducts();
  }, [search, activeFilter]);

  const fetchDecorationProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeFilter !== 'all') params.set('isActive', activeFilter);

      const response = await fetch(`/api/admin/decoration-methods?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDecorationProducts(data.decorationProducts || []);
      } else {
        setError('Failed to load decoration products');
      }
    } catch (error) {
      console.error('Failed to fetch decoration products:', error);
      setError('Failed to load decoration products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: DecorationProduct) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = async (product: DecorationProduct) => {
    if (!confirm(`Are you sure you want to delete "${product.displayName}" from ${product.vendor.displayName}? This will also remove all product compatibility rules.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/decoration-methods/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete decoration product');
      }

      await fetchDecorationProducts();
    } catch (error) {
      console.error('Error deleting decoration product:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete decoration product');
    }
  };

  const handleToggleActive = async (product: DecorationProduct) => {
    try {
      const response = await fetch(`/api/admin/decoration-methods/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update decoration product');
      }

      await fetchDecorationProducts();
    } catch (error) {
      console.error('Error updating decoration product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update decoration product');
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search decoration products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={activeFilter}
            label="Status"
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Decoration Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Decoration Product</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Size Range</TableCell>
                <TableCell>Compatibilities</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decorationProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      {search || activeFilter !== 'all' 
                        ? 'No decoration products found matching your filters.' 
                        : 'No decoration products found. Create your first decoration product to get started.'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                decorationProducts.map((product) => {
                  // Calculate size range
                  let sizeRange = '—';
                  if (product.defaultMinWidth && product.defaultMinHeight) {
                    sizeRange = `${product.defaultMinWidth}"×${product.defaultMinHeight}"`;
                    if (product.defaultMaxWidth && product.defaultMaxHeight && 
                        (product.defaultMaxWidth !== product.defaultMinWidth || 
                         product.defaultMaxHeight !== product.defaultMinHeight)) {
                      sizeRange += ` to ${product.defaultMaxWidth}"×${product.defaultMaxHeight}"`;
                    }
                  }

                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {product.displayName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {product.name}
                          </Typography>
                          {product.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {product.description}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {product.vendor.displayName}
                          </Typography>
                          {product.vendor.paymentTerms && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {product.vendor.paymentTerms}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category.displayName}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {product.perUnitCost && (
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatPrice(product.perUnitCost)}/unit
                            </Typography>
                          )}
                          {product.baseSetupCost && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Setup: {formatPrice(product.baseSetupCost)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {sizeRange}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product._count.compatibilities} 
                          size="small" 
                          color={product._count.compatibilities > 0 ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={product.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleEdit(product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleActive(product)}
                            color={product.isActive ? 'default' : 'success'}
                          >
                            {product.isActive ? <VisibilityOffIcon /> : <ViewIcon />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Decoration Product Dialog */}
      <StrategyBasedDecorationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={fetchDecorationProducts}
      />

      {/* Edit Decoration Product Dialog */}
      <StrategyBasedDecorationDialog
        open={editDialogOpen}
        decorationProduct={editingProduct}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingProduct(null);
        }}
        onSave={fetchDecorationProducts}
      />
    </Box>
  );
}