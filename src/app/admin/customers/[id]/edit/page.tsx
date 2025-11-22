'use client';

import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerForm } from '../../components/CustomerForm';

interface ShippingAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditCustomerPage({ params }: Props) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    params.then(resolvedParams => {
      setCustomerId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${customerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load customer');
      }

      const data = await response.json();
      setCustomer(data.customer);
      setError('');
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (customerData: CustomerFormData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer');
      }

      setSuccess(`Customer "${customerData.firstName} ${customerData.lastName}" updated successfully!`);
      
      // Redirect to customer list after a short delay
      setTimeout(() => {
        router.push('/admin/customers');
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to update customer');
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !customer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          href="/admin/customers"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Customers
        </Button>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Customer not found
        </Alert>
        <Button
          component={Link}
          href="/admin/customers"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/admin/customers"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1">
          Edit Customer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Update {customer.firstName} {customer.lastName}'s contact and shipping information.
        </Typography>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <CustomerForm
          customer={customer}
          onSave={handleSave}
          onCancel={handleCancel}
          submitButtonText="Update Customer"
        />
      </Paper>
    </Container>
  );
}