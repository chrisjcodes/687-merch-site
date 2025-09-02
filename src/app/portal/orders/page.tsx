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
  TablePagination,
  TableSortLabel,
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

type Order = 'asc' | 'desc';

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('status');
  const [order, setOrder] = useState<Order>('asc');

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

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort jobs with non-Done status first, then by selected criteria
  const sortJobs = (jobs: any[]) => {
    return [...jobs].sort((a, b) => {
      // First, sort by Done status (non-Done first)
      const aIsDone = a.status === 'DONE';
      const bIsDone = b.status === 'DONE';
      
      if (aIsDone && !bIsDone) return 1;
      if (!aIsDone && bIsDone) return -1;
      
      // Then sort by selected criteria
      let aValue, bValue;
      
      switch (orderBy) {
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          aValue = a[orderBy];
          bValue = b[orderBy];
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const formatJobItems = (items: any[]) => {
    if (items.length === 0) return '0 items • 0 qty';
    const totalQty = items.reduce((sum, item) => sum + (item.quantity || item.qty), 0);
    return `${items.length} items • ${totalQty} qty`;
  };

  const sortedJobs = sortJobs(jobs);
  const paginatedJobs = sortedJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  Job ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Items</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dueDate'}
                  direction={orderBy === 'dueDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('dueDate')}
                >
                  Target Dispatch Date
                </TableSortLabel>
              </TableCell>
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
              paginatedJobs.map((job) => (
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
                    {job.status === 'DONE' ? (
                      <Link href={`/portal/orders/${job.id}/reorder`} passHref>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReorderIcon />}
                        >
                          Reorder
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ReorderIcon />}
                        disabled
                        sx={{ opacity: 0.5 }}
                      >
                        Reorder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={jobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
}