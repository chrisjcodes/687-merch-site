'use client';

import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { MockupUpload } from '../../components/MockupUpload';

interface JobItem {
  id: string;
  quantity: number;
  product?: {
    sku: string;
  };
  variant?: {
    name: string;
  };
  sizeBreakdown: Array<{
    size: string;
    quantity: number;
  }>;
  placements: Array<{
    id: string;
    placementType?: string;
    width: number;
    height: number;
    positionX?: number;
    positionY?: number;
    decorationMethod?: string;
    colors?: string[];
    specialInstructions?: string;
    design?: {
      id: string;
      title?: string;
    };
  }>;
}

interface JobItemsWithMockupsProps {
  items: JobItem[];
}

export function JobItemsWithMockups({ items }: JobItemsWithMockupsProps) {
  const formatSizeBreakdown = (sizeBreakdown: JobItem['sizeBreakdown']) => {
    if (!sizeBreakdown || !Array.isArray(sizeBreakdown)) return 'N/A';
    const sizes = sizeBreakdown
      .filter((breakdown) => breakdown.quantity > 0)
      .map((breakdown) => `${breakdown.size}: ${breakdown.quantity}`)
      .join(', ');
    return sizes || 'N/A';
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
        Items & Mockups
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((item, index) => (
          <Paper key={item.id} variant="outlined" sx={{ p: 3, bgcolor: 'grey.25' }}>
            {/* Item Details Header */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                      Product SKU
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {item.product?.sku || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="overline" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                      Variant
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {item.variant?.name || 'N/A'}
                    </Typography>
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
                <Grid item xs={12} md={6}>
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
            </Box>

            {/* Print Specifications */}
            {item.placements && item.placements.length > 0 && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Print Specifications ({item.placements.length} placements)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {item.placements.map((placement, placementIndex) => (
                      <Paper key={placement.id || placementIndex} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
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
                </AccordionDetails>
              </Accordion>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Mockup Upload Section */}
            <MockupUpload jobItemId={item.id} />
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}