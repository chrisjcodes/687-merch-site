'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Snackbar,
  Alert,
} from '@mui/material';
import { JobStatus } from '@prisma/client';

const statusOrder: JobStatus[] = [
  'PENDING_DESIGN',
  'PENDING_MATERIALS',
  'PENDING_PRINT',
  'PENDING_FULFILLMENT',
  'DONE'
];

const statusLabels: Record<JobStatus, string> = {
  PENDING_DESIGN: 'Approve Design',
  PENDING_MATERIALS: 'Materials Ready',
  PENDING_PRINT: 'Start Printing',
  PENDING_FULFILLMENT: 'Ready for Fulfillment',
  DONE: 'Complete',
  CANCELLED: 'Cancelled',
};

interface StatusUpdateButtonsProps {
  jobId: string;
  currentStatus: JobStatus;
}

export function StatusUpdateButtons({ jobId, currentStatus }: StatusUpdateButtonsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;

  const handleStatusUpdate = async (newStatus: JobStatus) => {
    setIsUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setSuccess(`Status updated to ${statusLabels[newStatus]}`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const canMoveBack = currentIndex > 0;
  const canMoveForward = nextStatus !== null;

  return (
    <Box>
      <ButtonGroup variant="outlined" size="small">
        {canMoveBack && (
          <Button
            onClick={() => handleStatusUpdate(statusOrder[currentIndex - 1])}
            disabled={isUpdating}
          >
            ← {statusLabels[statusOrder[currentIndex - 1]]}
          </Button>
        )}
        {canMoveForward && (
          <Button
            onClick={() => handleStatusUpdate(nextStatus!)}
            disabled={isUpdating}
            variant="contained"
          >
            {isUpdating ? 'Updating...' : statusLabels[nextStatus!]} →
          </Button>
        )}
      </ButtonGroup>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}