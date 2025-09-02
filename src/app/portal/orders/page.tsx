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
} from '@mui/material';
import { Refresh as RefreshIcon, Reorder as ReorderIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JobStatus } from '@prisma/client';

const statusColors: Record<JobStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING_DESIGN: 'default',
  PENDING_MATERIALS: 'info',
  PENDING_PRINT: 'warning',
  PENDING_FULFILLMENT: 'primary',
  DONE: 'success',
  CANCELLED: 'error',
};

const statusLabels: Record<JobStatus, string> = {
  PENDING_DESIGN: 'Pending Design',
  PENDING_MATERIALS: 'Pending Materials',
  PENDING_PRINT: 'Pending Print',
  PENDING_FULFILLMENT: 'Pending Fulfillment',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'CUSTOMER') {
      router.push('/auth/signin');
      return;
    }

    fetchJobs();
  }, [session, status, router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJobItems = (items: any[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) {
      const item = items[0];
      return `${item.quantity || item.qty}x ${item.product?.sku || item.productSku}${item.variant?.name || item.variant ? ` (${item.variant?.name || item.variant})` : ''}`;
    }
    const totalQty = items.reduce((sum, item) => sum + (item.quantity || item.qty), 0);
    return `${totalQty} items (${items.length} SKUs)`;
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
          My Orders
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchJobs}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No orders found. Contact us to place your first order.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {job.id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatJobItems(job.items)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[job.status]}
                      color={statusColors[job.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : 'TBD'}
                  </TableCell>
                  <TableCell align="right">
                    <Link href={`/portal/orders/${job.id}/reorder`} passHref>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ReorderIcon />}
                        disabled={job.status === 'PENDING_DESIGN'}
                      >
                        Reorder
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}