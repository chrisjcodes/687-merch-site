import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';
import { StatusUpdateButtons } from './StatusUpdateButtons';

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

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  await requireAdminSession();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      events: {
        orderBy: { createdAt: 'desc' }
      },
      proofs: {
        orderBy: { version: 'desc' }
      }
    }
  });

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Job not found.
        </Alert>
      </Container>
    );
  }

  const formatSizeBreakdown = (sizeBreakdown: any) => {
    if (!sizeBreakdown) return 'N/A';
    const sizes = Object.entries(sizeBreakdown)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([size, qty]) => `${size}: ${qty}`)
      .join(', ');
    return sizes || 'N/A';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Link href="/admin/jobs" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to Jobs
          </Button>
        </Link>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Job {job.id.slice(-8).toUpperCase()}
          </Typography>
          <Chip
            label={statusLabels[job.status]}
            color={statusColors[job.status]}
            size="medium"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Customer Information
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">{job.customer.name}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{job.customer.email}</Typography>
            </Box>
            {job.customer.phone && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body1">{job.customer.phone}</Typography>
              </Box>
            )}
            {job.customer.company && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Company
                </Typography>
                <Typography variant="body1">{job.customer.company}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Job Information
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Created
              </Typography>
              <Typography variant="body1">
                {new Date(job.createdAt).toLocaleDateString()} at{' '}
                {new Date(job.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
            {job.dueDate && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {new Date(job.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            {job.notes && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">{job.notes}</Typography>
              </Box>
            )}
            <Box sx={{ mt: 3 }}>
              <StatusUpdateButtons jobId={job.id} currentStatus={job.status} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product SKU</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Size Breakdown</TableCell>
                    <TableCell>Print Spec</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productSku}</TableCell>
                      <TableCell>{item.variant || 'N/A'}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{formatSizeBreakdown(item.sizeBreakdown)}</TableCell>
                      <TableCell>
                        {item.printSpec && typeof item.printSpec === 'object' ? (
                          <Box>
                            {Object.entries(item.printSpec as Record<string, any>)
                              .filter(([_, value]) => value)
                              .map(([key, value]) => (
                                <Typography key={key} variant="body2">
                                  <strong>{key}:</strong> {value as string}
                                </Typography>
                              ))
                            }
                          </Box>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Event Timeline
            </Typography>
            <Box>
              {job.events.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip label={event.type} size="small" />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.createdAt).toLocaleDateString()} at{' '}
                      {new Date(event.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {event.payload && typeof event.payload === 'object' && (
                    <Typography variant="body2" color="textSecondary">
                      {JSON.stringify(event.payload, null, 2)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}