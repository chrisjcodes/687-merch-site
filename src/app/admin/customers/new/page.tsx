'use client';

import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerForm } from '../components/CustomerForm';

interface ShippingAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  defaultShip?: ShippingAddress;
}

export default function NewCustomerPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (customerData: CustomerFormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const result = await response.json();
      setSuccess(`Customer "${customerData.firstName} ${customerData.lastName}" created successfully!`);
      
      // Redirect to customer list after a short delay
      setTimeout(() => {
        router.push('/admin/customers');
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to create customer');
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/admin/customers');
  };

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
          Add New Customer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Create a new customer account with contact and shipping information.
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
          onSave={handleSave}
          onCancel={handleCancel}
          submitButtonText="Create Customer"
        />
      </Paper>
    </Container>
  );
}