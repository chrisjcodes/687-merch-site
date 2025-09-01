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
  IconButton,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
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

export default async function AdminJobsPage() {
  await requireAdminSession();
  
  const jobs = await prisma.job.findMany({
    include: {
      customer: true,
      items: true,
      _count: {
        select: { items: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50 // Pagination would go here
  });

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Job Management
        </Typography>
        <Link href="/admin/jobs/new" passHref>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Job
          </Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Customer</TableCell>
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
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No jobs found. Create your first job to get started.
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
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{job.customer.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {job.customer.email}
                      </Typography>
                    </Box>
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
                    <Link href={`/admin/jobs/${job.id}`} passHref>
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
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