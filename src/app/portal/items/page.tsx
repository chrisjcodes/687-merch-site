'use client';

import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Checkbox,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Reorder as ReorderIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ItemTemplate {
  id: string;
  name: string;
  description?: string;
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
  lastOrderedAt?: string;
  timesOrdered: number;
  totalQuantityOrdered: number;
  lastJob?: {
    id: string;
    status: string;
    createdAt: string;
  };
  recentOrders: {
    jobId: string;
    status: string;
    quantity: number;
    orderedAt: string;
  }[];
}

export default function CustomerItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ItemTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'CUSTOMER') {
      router.push('/auth/signin');
      return;
    }

    fetchItems();
  }, [session, status, router, page, rowsPerPage, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/customer/items?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAllItems = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleCreateReorder = () => {
    const selectedItemIds = Array.from(selectedItems);
    if (selectedItemIds.length === 0) return;
    
    // Navigate to reorder flow with selected items
    const params = new URLSearchParams();
    selectedItemIds.forEach(id => params.append('items', id));
    router.push(`/portal/reorder?${params.toString()}`);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  const formatLastOrdered = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'success';
      case 'PENDING_DESIGN': return 'default';
      case 'PENDING_MATERIALS': return 'info';
      case 'PENDING_PRINT': return 'warning';
      case 'PENDING_FULFILLMENT': return 'primary';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchItems}
          >
            Refresh
          </Button>
          {selectedItems.size > 0 && (
            <Button
              variant="contained"
              startIcon={<ReorderIcon />}
              onClick={handleCreateReorder}
            >
              Create Reorder ({selectedItems.size} items)
            </Button>
          )}
        </Box>
      </Box>

      <Paper>
        <Toolbar sx={{ px: 2, py: 1 }}>
          <TextField
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.size > 0 && selectedItems.size < items.length}
                    checked={items.length > 0 && selectedItems.size === items.length}
                    onChange={handleSelectAllItems}
                  />
                </TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Times Ordered</TableCell>
                <TableCell>Total Qty</TableCell>
                <TableCell>Last Ordered</TableCell>
                <TableCell>Last Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      No items found. Items will appear here after you place your first order.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                        {item.description && (
                          <Typography variant="caption" color="textSecondary">
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {item.product.name}
                        </Typography>
                        {item.variant && (
                          <Typography variant="caption" color="textSecondary">
                            {item.variant.name}
                          </Typography>
                        )}
                      </Box>
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
                        {item.totalQuantityOrdered}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatLastOrdered(item.lastOrderedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.lastJob && (
                        <Chip
                          label={item.lastJob.status.replace('_', ' ')}
                          color={getStatusColor(item.lastJob.status) as any}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, item.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => {
            if (menuItemId) {
              setSelectedItems(new Set([menuItemId]));
              handleCreateReorder();
            }
            handleMenuClose();
          }}
        >
          <ReorderIcon fontSize="small" sx={{ mr: 2 }} />
          Reorder This Item
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HistoryIcon fontSize="small" sx={{ mr: 2 }} />
          View Order History
        </MenuItem>
      </Menu>
    </Container>
  );
}