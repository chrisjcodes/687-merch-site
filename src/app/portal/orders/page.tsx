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
import { requireCustomerSession, getCustomerJobs } from '@/lib/auth-helpers';
import { JobStatus } from '@prisma/client';

const statusColors: Record<JobStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  QUEUED: 'default',
  APPROVED: 'info',
  IN_PROD: 'warning',
  READY: 'primary',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
};

const statusLabels: Record<JobStatus, string> = {
  QUEUED: 'Queued',
  APPROVED: 'Approved',
  IN_PROD: 'In Production',
  READY: 'Ready',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

export default async function CustomerOrdersPage() {
  const session = await requireCustomerSession();
  const jobs = await getCustomerJobs(session.user.customerId!);

  const formatJobItems = (items: any[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) {
      const item = items[0];
      return `${item.qty}x ${item.productSku}${item.variant ? ` (${item.variant})` : ''}`;
    }
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    return `${totalQty} items (${items.length} SKUs)`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Orders
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
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
                        disabled={job.status === 'QUEUED'}
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