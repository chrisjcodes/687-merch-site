'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

interface ReorderFormProps {
  jobId: string;
  originalSizeBreakdown: Record<string, number>;
}

export function ReorderForm({ jobId, originalSizeBreakdown }: ReorderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Initialize size breakdown with original values
  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    sizes.forEach(size => {
      initial[size] = originalSizeBreakdown[size] || 0;
    });
    return initial;
  });
  
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const totalQuantity = Object.values(sizeBreakdown).reduce((sum, qty) => sum + qty, 0);

  const handleSizeChange = (size: string, value: string) => {
    const qty = parseInt(value) || 0;
    setSizeBreakdown(prev => ({
      ...prev,
      [size]: qty
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalQuantity === 0) {
      setError('Please specify at least one item to order');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalJobId: jobId,
          sizeBreakdown,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reorder');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/portal/orders');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Size Breakdown
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {sizes.map((size) => (
          <Grid item xs={6} sm={3} key={size}>
            <TextField
              label={size}
              type="number"
              size="small"
              fullWidth
              value={sizeBreakdown[size]}
              onChange={(e) => handleSizeChange(size, e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Total Quantity: {totalQuantity}
      </Typography>

      <TextField
        label="Requested Delivery Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Notes (Optional)"
        multiline
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting || totalQuantity === 0}
      >
        {isSubmitting ? 'Creating Reorder...' : 'Submit Reorder'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Reorder created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
}