'use client';

import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
}

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
  timesOrdered: number;
  totalQuantityOrdered: number;
  lastOrderedAt?: string;
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

interface CustomerItemsData {
  customer: Customer;
  items: ItemTemplate[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  summary: {
    totalItems: number;
    totalOrdersCount: number;
    totalQuantityOrdered: number;
    popularItems: {
      id: string;
      name: string;
      timesOrdered: number;
      lastOrderedAt?: string;
      product: { name: string };
    }[];
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminCustomerItemsPage({ params }: Props) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string>('');
  const [data, setData] = useState<CustomerItemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(resolvedParams => {
      setCustomerId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerItems();
    }
  }, [customerId, page, rowsPerPage, searchTerm]);

  const fetchCustomerItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/customers/${customerId}/items?${queryParams}`);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load customer items');
      }
    } catch (error) {
      console.error('Failed to fetch customer items:', error);
      setError('Failed to load customer items');
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
    setPage(0);
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

  const formatLastOrdered = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning">No data available</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              size="small"
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              Items for {data.customer.name}
            </Typography>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {data.customer.email} {data.customer.company && `• ${data.customer.company}`}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {data.summary.totalItems}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssessmentIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {data.summary.totalOrdersCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {data.summary.totalQuantityOrdered}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Quantity
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Most Popular Items
              </Typography>
              {data.summary.popularItems.slice(0, 3).map((item, index) => (
                <Box key={item.id} sx={{ mb: 1 }}>
                  <Typography variant="body2" noWrap>
                    {index + 1}. {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.timesOrdered} orders
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Items Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
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
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">Times Ordered</TableCell>
                <TableCell align="center">Total Qty</TableCell>
                <TableCell>Last Ordered</TableCell>
                <TableCell>Last Status</TableCell>
                <TableCell>Recent Orders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      No items found. Items will appear here after the customer places orders.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((item) => (
                  <TableRow key={item.id} hover>
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
                    <TableCell align="center">
                      <Chip 
                        label={item.timesOrdered} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
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
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {item.recentOrders.slice(0, 3).map((order, index) => (
                          <Box key={order.jobId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={order.status.replace('_', ' ')}
                              color={getStatusColor(order.status) as any}
                              size="small"
                              sx={{ minWidth: 80 }}
                            />
                            <Typography variant="caption">
                              {order.quantity} items
                            </Typography>
                          </Box>
                        ))}
                        {item.recentOrders.length > 3 && (
                          <Typography variant="caption" color="textSecondary">
                            +{item.recentOrders.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.pagination.totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
    </Container>
  );
}