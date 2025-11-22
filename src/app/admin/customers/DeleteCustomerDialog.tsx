'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  totalOrders: number;
  totalItems: number;
}

interface DeleteCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (customerId: string) => Promise<boolean>;
  customer: Customer | null;
}

export function DeleteCustomerDialog({
  open,
  onClose,
  onConfirm,
  customer,
}: DeleteCustomerDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!customer) return;
    
    setDeleting(true);
    setError('');
    
    try {
      const success = await onConfirm(customer.id);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (!deleting) {
      setError('');
      onClose();
    }
  };

  if (!customer) return null;

  const hasOrders = customer.totalOrders > 0;
  const hasItems = customer.totalItems > 0;
  const canDelete = !hasOrders;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="error" />
        Delete Customer
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this customer?
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.email}
            </Typography>
            {customer.company && (
              <Typography variant="body2" color="text.secondary">
                {customer.company}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Customer has:
            </Typography>
            <Typography variant="body2">
              • {customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2">
              • {customer.totalItems} item template{customer.totalItems !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {!canDelete && (
            <Alert severity="error" sx={{ mb: 2 }}>
              This customer cannot be deleted because they have existing orders. 
              If you need to remove this customer, please contact support.
            </Alert>
          )}

          {canDelete && hasItems && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Deleting this customer will also remove their {customer.totalItems} item template{customer.totalItems !== 1 ? 's' : ''}. 
              This action cannot be undone.
            </Alert>
          )}

          {canDelete && !hasItems && !hasOrders && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This customer has no orders or item templates. They can be safely deleted.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {canDelete && (
            <Typography variant="body2" color="error" fontWeight="medium">
              This action cannot be undone.
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={deleting}
        >
          Cancel
        </Button>
        
        {canDelete && (
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete Customer'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}