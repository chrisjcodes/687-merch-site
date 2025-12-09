'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import StorefrontIcon from '@mui/icons-material/Storefront';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ShopStatus {
  handle: string;
  title: string;
  status: 'live' | 'upcoming' | 'closed' | 'ongoing';
  orderWindowStart: string | null;
  orderWindowEnd: string | null;
  batchIntervalDays: number | null;
  lastBatchDate: string | null;
  nextBatchDate: string | null;
}

interface ShopsResponse {
  shops: ShopStatus[];
  summary: {
    live: number;
    upcoming: number;
    closed: number;
    ongoing: number;
  };
}

const statusColors: Record<ShopStatus['status'], 'success' | 'warning' | 'error' | 'info'> = {
  live: 'success',
  upcoming: 'warning',
  closed: 'error',
  ongoing: 'info',
};

const statusLabels: Record<ShopStatus['status'], string> = {
  live: 'Live',
  upcoming: 'Upcoming',
  closed: 'Closed',
  ongoing: 'Ongoing',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `in ${diffDays} days`;
  }
}

export default function ShopsPage() {
  const [data, setData] = useState<ShopsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await fetch('/api/admin/shops');
        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#f2bf00' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="info">No data available</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
          Drop Shops
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          View and manage all drop shop collections
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper
          sx={{
            p: 2,
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700 }}>
            {data.summary.live}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Live
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            bgcolor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ color: '#ffc107', fontWeight: 700 }}>
            {data.summary.upcoming}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Upcoming
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            bgcolor: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ color: '#2196f3', fontWeight: 700 }}>
            {data.summary.ongoing}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Ongoing
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 700 }}>
            {data.summary.closed}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Closed
          </Typography>
        </Paper>
      </Box>

      {/* Shops Table */}
      {data.shops.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#1a1a1a', textAlign: 'center' }}>
          <StorefrontIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            No drop shops configured
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
            Add order_window_end or batch_interval_days metafields to collections in Shopify
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Shop
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Order Window
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Batching
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Last Batch
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Next Batch
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.shops.map((shop) => (
                <TableRow key={shop.handle} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                        {shop.title}
                      </Typography>
                      <MuiLink
                        component={Link}
                        href={`/shop/${shop.handle}`}
                        target="_blank"
                        sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'flex' }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </MuiLink>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {shop.handle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[shop.status]}
                      color={statusColors[shop.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {shop.orderWindowEnd ? (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {shop.orderWindowStart
                            ? `${formatDate(shop.orderWindowStart)} - ${formatDate(shop.orderWindowEnd)}`
                            : `Closes ${formatDate(shop.orderWindowEnd)}`}
                        </Typography>
                        {shop.status === 'live' && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {formatRelativeTime(shop.orderWindowEnd)}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        No end date
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {shop.batchIntervalDays ? (
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        Every {shop.batchIntervalDays} days
                      </Typography>
                    ) : shop.orderWindowEnd ? (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        On close
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {shop.lastBatchDate ? formatDate(shop.lastBatchDate) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {shop.nextBatchDate ? (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {formatDate(shop.nextBatchDate)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {formatRelativeTime(shop.nextBatchDate)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
