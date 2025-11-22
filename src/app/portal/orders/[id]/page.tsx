'use client';

import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JobStatus } from '@prisma/client';
import { MockupViewer } from '@/app/components/MockupViewer';

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
  params: { id: string };
}

export default function CustomerJobDetailPage({ params }: JobDetailPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchJob();
    }
  }, [status, params.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customer/jobs/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found');
        } else {
          setError('Failed to load order details');
        }
        return;
      }

      const data = await response.json();
      setJob(data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatSizeBreakdown = (sizeBreakdown: any) => {
    if (!sizeBreakdown || !Array.isArray(sizeBreakdown)) return 'N/A';
    const sizes = sizeBreakdown
      .filter((breakdown: any) => breakdown.quantity > 0)
      .map((breakdown: any) => `${breakdown.size}: ${breakdown.quantity}`)
      .join(', ');
    return sizes || 'N/A';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          href="/portal/orders"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/portal/orders"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Order #{job.jobNumber}
          </Typography>
          <Chip
            label={statusLabels[job.status] || job.status}
            color={statusColors[job.status] || 'default'}
            size="large"
            sx={{ fontWeight: 600, fontSize: '0.875rem' }}
          />
        </Box>
      </Box>

      {/* Order Overview */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Order Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                Order Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(job.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                Status
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <Chip
                  label={statusLabels[job.status] || job.status}
                  color={statusColors[job.status] || 'default'}
                  size="small"
                  variant="outlined"
                />
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
          
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                Total Items
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {job.items.reduce((total: number, item: any) => total + item.quantity, 0)} pieces
              </Typography>
            </Box>
          </Grid>
          
          {job.notes && (
            <Grid item xs={12}>
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

      {/* Items and Mockups */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
          Order Items
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {job.items.map((item: any, index: number) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 3, bgcolor: 'grey.25' }}>
              {/* Item Details */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                      Product
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {item.product?.sku || 'N/A'}
                    </Typography>
                    {item.variant?.name && (
                      <Typography variant="body2" color="text.secondary">
                        {item.variant.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                      Quantity
                    </Typography>
                    <Chip 
                      label={item.quantity} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={7}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                      Size Breakdown
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {formatSizeBreakdown(item.sizeBreakdown)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Print Specifications */}
              {item.placements && item.placements.length > 0 && (
                <>
                  <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Print Specifications ({item.placements.length} placements)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {item.placements.map((placement: any, placementIndex: number) => (
                          <Paper key={placement.id || placementIndex} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Typography variant="body2">
                                <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                  Placement:
                                </Typography>{' '}
                                {placement.placementType || 'N/A'}
                              </Typography>
                              
                              <Typography variant="body2">
                                <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                  Size:
                                </Typography>{' '}
                                {placement.width}"W × {placement.height}"H
                              </Typography>

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
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Mockups Section */}
              <MockupViewer jobItemId={item.id} title="Product Mockups" showTitle={true} />
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}