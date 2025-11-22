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
  TablePagination,
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
import { ProductCategory } from '@prisma/client';
import { ProductFormDialog } from './ProductFormDialog';

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
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    isActive: boolean;
  }>;
  decorationCompatibilities: Array<{
    decorationMethod: {
      id: string;
      name: string;
      displayName: string;
    };
    isRecommended: boolean;
  }>;
  _count: {
    jobItems: number;
    placementAnchors: number;
  };
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, activeFilter, page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (activeFilter !== 'all') params.set('isActive', activeFilter);
      params.set('page', page.toString());
      params.set('pageSize', rowsPerPage.toString());

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalCount(data.pagination?.totalCount || 0);
      } else {
        setError('Failed to load appliques');
      }
    } catch (error) {
      console.error('Failed to fetch appliques:', error);
      setError('Failed to load appliques');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
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
        throw new Error(errorData.error || 'Failed to update product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search appliques..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => {
              setCategoryFilter(e.target.value as ProductCategory | '');
              setPage(0);
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={activeFilter}
            label="Status"
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(0);
            }}
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
          Add Applique
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
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Variants</TableCell>
                  <TableCell>Decoration Products</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography color="textSecondary" sx={{ py: 4 }}>
                        {search || categoryFilter || activeFilter !== 'all' 
                          ? 'No appliques found matching your filters.' 
                          : 'No appliques found. Create your first applique to get started.'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={categoryLabels[product.category]} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {product.brand || '—'}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatPrice(product.currentPrice)}
                          </Typography>
                          {product.basePrice !== product.currentPrice && (
                            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              {formatPrice(product.basePrice)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.variants.length} 
                          size="small" 
                          color={product.variants.length > 0 ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {product.decorationCompatibilities.slice(0, 3).map((comp) => (
                            <Chip
                              key={comp.decorationMethod.id}
                              label={comp.decorationMethod.displayName}
                              size="small"
                              variant={comp.isRecommended ? 'filled' : 'outlined'}
                              color="secondary"
                            />
                          ))}
                          {product.decorationCompatibilities.length > 3 && (
                            <Chip
                              label={`+${product.decorationCompatibilities.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={product.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {product._count.jobItems} jobs
                        </Typography>
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
                            disabled={product._count.jobItems > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}

      {/* Create Product Dialog */}
      <ProductFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={fetchProducts}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={editDialogOpen}
        product={editingProduct}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingProduct(null);
        }}
        onSave={fetchProducts}
      />
    </Box>
  );
}