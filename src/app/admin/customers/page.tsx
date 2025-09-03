'use client';

import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
  totalOrders: number;
  totalItems: number;
  lastOrderAt?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      } else {
        setError('Failed to load customers');
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search customers..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Total Orders</TableCell>
                <TableCell>Total Items</TableCell>
                <TableCell>Last Order</TableCell>
                <TableCell>Member Since</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      {search ? 'No customers found matching your search.' : 'No customers found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {customer.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {customer.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer.company || (
                        <Typography variant="body2" color="textSecondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.totalOrders} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.totalItems} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {customer.lastOrderAt ? (
                        <Typography variant="body2">
                          {new Date(customer.lastOrderAt).toLocaleDateString()}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Never
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        href={`/admin/customers/${customer.id}/items`}
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                      >
                        View Items
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}