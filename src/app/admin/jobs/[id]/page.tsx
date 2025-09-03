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
  Divider,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';
import { StatusUpdateButtons } from './StatusUpdateButtons';

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
      items: {
        include: {
          product: true,
          variant: true,
          sizeBreakdown: true,
          placements: {
            include: {
              design: true
            }
          }
        }
      },
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
    if (!sizeBreakdown || !Array.isArray(sizeBreakdown)) return 'N/A';
    const sizes = sizeBreakdown
      .filter((breakdown: any) => breakdown.quantity > 0)
      .map((breakdown: any) => `${breakdown.size}: ${breakdown.quantity}`)
      .join(', ');
    return sizes || 'N/A';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Job {job.id.slice(-8).toUpperCase()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={statusLabels[job.status]}
              color={statusColors[job.status]}
              size="medium"
            />
            <StatusUpdateButtons jobId={job.id} currentStatus={job.status} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Customer Information - Full Width */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Customer Information
            </Typography>
            <Link href={`/admin/customers/${job.customer.id}/items`} passHref>
              <Button
                variant="outlined"
                size="small"
                startIcon={<BusinessIcon />}
              >
                View Customer Items
              </Button>
            </Link>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                  Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {job.customer.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', textDecoration: 'none' }} component="a" href={`mailto:${job.customer.email}`}>
                  {job.customer.email}
                </Typography>
              </Box>
            </Grid>
            {job.customer.phone && (
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'primary.main', textDecoration: 'none' }} component="a" href={`tel:${job.customer.phone}`}>
                    {job.customer.phone}
                  </Typography>
                </Box>
              </Grid>
            )}
            {job.customer.company && (
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                    Company
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {job.customer.company}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Job Information - Full Width */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Job Information
          </Typography>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                  Created
                </Typography>
                <Typography variant="body1">
                  {new Date(job.createdAt).toLocaleDateString('en-US', { 
                    month: 'numeric',
                    day: 'numeric', 
                    year: 'numeric'
                  })} at {new Date(job.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </Typography>
              </Box>
            </Grid>
            {job.dueDate && (
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                    Due Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(job.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric', 
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Grid>
            )}
            {job.notes && (
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontStyle: 'italic',
                    bgcolor: 'grey.50',
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    {job.notes}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Items
          </Typography>
          <TableContainer sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Product SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Variant</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Size Breakdown</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Print Spec</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {job.items.map((item, index) => (
                  <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.25' } }}>
                    <TableCell sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {item.product?.sku || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {item.variant?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.quantity} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem' }}>
                      {formatSizeBreakdown(item.sizeBreakdown)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: '300px' }}>
                      {item.placements && item.placements.length > 0 ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                            Placements:
                          </Typography>
                          {item.placements.map((placement: any, placementIndex: number) => (
                            <Paper key={placement.id || placementIndex} variant="outlined" sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body2">
                                  <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    Placement Type:
                                  </Typography>{' '}
                                  {placement.placementType || 'N/A'}
                                </Typography>
                                
                                <Typography variant="body2">
                                  <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Size:
                                  </Typography>{' '}
                                  {placement.width}"W × {placement.height}"H
                                </Typography>
                                
                                {(placement.positionX !== null || placement.positionY !== null) && (
                                  <Typography variant="body2">
                                    <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                      Position:
                                    </Typography>{' '}
                                    {placement.positionX || 0}"X, {placement.positionY || 0}"Y
                                  </Typography>
                                )}
                                
                                <Typography variant="body2">
                                  <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Method:
                                  </Typography>{' '}
                                  {placement.decorationMethod || 'N/A'}
                                </Typography>
                                
                                {placement.colors && placement.colors.length > 0 && (
                                  <Typography variant="body2">
                                    <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                      Colors:
                                    </Typography>{' '}
                                    {placement.colors.join(', ')}
                                  </Typography>
                                )}
                                
                                {placement.specialInstructions && (
                                  <Typography variant="body2">
                                    <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                      Special Instructions:
                                    </Typography>{' '}
                                    {placement.specialInstructions}
                                  </Typography>
                                )}
                                
                                {placement.design && (
                                  <Typography variant="body2">
                                    <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                      Design:
                                    </Typography>{' '}
                                    {placement.design.title || placement.design.id}
                                  </Typography>
                                )}
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No placements configured</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Event Timeline
          </Typography>
          <Box>
            {job.events.length > 0 ? job.events.map((event, index) => (
              <Box
                key={event.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 3,
                  pb: 3,
                  borderBottom: index < job.events.length - 1 ? '1px solid' : 'none',
                  borderColor: 'grey.200',
                  '&:last-child': {
                    mb: 0,
                    pb: 0
                  }
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 1,
                    flexShrink: 0
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={event.type.replace('.', ' ').replace('_', ' ')} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {new Date(event.createdAt).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} at {new Date(event.createdAt).toLocaleTimeString('en-US', { 
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </Typography>
                  </Box>
                  {event.payload && typeof event.payload === 'object' && (
                    <Box sx={{ 
                      bgcolor: 'grey.50',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </Box>
                  )}
                </Box>
              </Box>
            )) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No events recorded for this job yet.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}