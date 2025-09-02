'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
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
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
} from '@mui/material';
import { 
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Link from 'next/link';
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

type JobWithRelations = {
  id: string;
  customerId: string;
  status: JobStatus;
  dueDate: Date | null;
  createdAt: Date;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    quantity: number;
    product: {
      sku: string;
      name: string;
    };
    variant: {
      name: string;
    } | null;
  }>;
};

type SortDirection = 'asc' | 'desc';
type SortableColumns = 'id' | 'customer' | 'status' | 'createdAt' | 'dueDate' | 'itemCount' | 'priority';

interface JobsTableProps {
  initialJobs: JobWithRelations[];
}

export function JobsTable({ initialJobs }: JobsTableProps) {
  const [jobs] = useState<JobWithRelations[]>(initialJobs);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState<SortableColumns>('priority');
  const [order, setOrder] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('');

  const handleRequestSort = (property: SortableColumns) => {
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

  const formatJobItems = (items: any[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) {
      const item = items[0];
      return `${item.quantity}x ${item.product.name}${item.variant?.name ? ` (${item.variant.name})` : ''}`;
    }
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    return `${totalQty} items (${items.length} products)`;
  };

  const getStatusPriority = (status: JobStatus): number => {
    // Higher numbers = higher priority (more urgent)
    switch (status) {
      case 'PENDING_DESIGN': return 100;       // Needs immediate attention
      case 'PENDING_MATERIALS': return 90;     // Waiting for materials
      case 'PENDING_PRINT': return 80;         // Ready to print
      case 'PENDING_FULFILLMENT': return 70;   // Ready for fulfillment
      case 'DONE': return 10;                  // Complete
      case 'CANCELLED': return 5;              // Cancelled
      default: return 0;
    }
  };

  const getPriorityIndicator = (job: JobWithRelations) => {
    const priority = getComparableValue(job, 'priority') as number;
    const now = new Date().getTime();
    const isOverdue = job.dueDate && new Date(job.dueDate).getTime() < now;
    
    if (job.status === 'DONE') {
      return { color: 'success', label: 'Complete' };
    }
    
    if (job.status === 'CANCELLED') {
      return { color: 'error', label: 'Cancelled' };
    }
    
    if (isOverdue) {
      return { color: 'error', label: 'Overdue' };
    }
    
    if (priority >= 95000) {
      return { color: 'error', label: 'Urgent' };
    }
    
    if (priority >= 85000) {
      return { color: 'warning', label: 'High' };
    }
    
    if (priority >= 75000) {
      return { color: 'info', label: 'Normal' };
    }
    
    return { color: 'default', label: 'Low' };
  };

  const getComparableValue = (job: JobWithRelations, column: SortableColumns) => {
    switch (column) {
      case 'id':
        return job.id;
      case 'customer':
        return job.customer.name.toLowerCase();
      case 'status':
        return job.status;
      case 'createdAt':
        return new Date(job.createdAt).getTime();
      case 'dueDate':
        return job.dueDate ? new Date(job.dueDate).getTime() : 0;
      case 'itemCount':
        return job.items.reduce((sum, item) => sum + item.quantity, 0);
      case 'priority':
        // Priority combines status urgency + due date urgency
        const statusPriority = getStatusPriority(job.status);
        const now = new Date().getTime();
        
        // If job is complete or cancelled, lower priority significantly
        if (job.status === 'DONE' || job.status === 'CANCELLED') {
          return 0;
        }
        
        // Base priority from status
        let priority = statusPriority * 1000;
        
        // Add urgency based on due date
        if (job.dueDate) {
          const dueTime = new Date(job.dueDate).getTime();
          const daysUntilDue = (dueTime - now) / (1000 * 60 * 60 * 24);
          
          if (daysUntilDue < 0) {
            // Overdue - very high priority
            priority += 10000;
          } else if (daysUntilDue <= 1) {
            // Due today/tomorrow
            priority += 5000;
          } else if (daysUntilDue <= 3) {
            // Due in next 3 days
            priority += 3000;
          } else if (daysUntilDue <= 7) {
            // Due in next week
            priority += 1000;
          }
          
          // Add slight preference for sooner dates
          priority += Math.max(0, (30 - daysUntilDue) * 10);
        }
        
        return priority;
      default:
        return '';
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.items.some(item => 
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.variant && item.variant.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    const matchesStatus = statusFilter === '' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aValue = getComparableValue(a, orderBy);
    const bValue = getComparableValue(b, orderBy);
    
    // Special handling for priority - we want high priority first when "asc"
    if (orderBy === 'priority') {
      if (aValue < bValue) {
        return order === 'asc' ? 1 : -1; // Reversed for priority
      }
      if (aValue > bValue) {
        return order === 'asc' ? -1 : 1; // Reversed for priority
      }
      return 0;
    }
    
    // Standard sorting for other columns
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Paginate jobs
  const paginatedJobs = sortedJobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper>
      {/* Search and Filter Toolbar */}
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, py: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
          <TextField
            size="small"
            placeholder="Search jobs, customers, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {Object.entries(statusLabels).map(([status, label]) => (
                <MenuItem key={status} value={status}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />
          
          <Typography variant="body2" color="textSecondary">
            {filteredJobs.length} jobs {searchTerm || statusFilter ? `(filtered from ${jobs.length})` : ''}
          </Typography>
        </Box>
      </Toolbar>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  Job ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customer'}
                  direction={orderBy === 'customer' ? order : 'asc'}
                  onClick={() => handleRequestSort('customer')}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'itemCount'}
                  direction={orderBy === 'itemCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('itemCount')}
                >
                  Items
                </TableSortLabel>
              </TableCell>
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
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    {searchTerm || statusFilter 
                      ? 'No jobs match your search criteria.' 
                      : 'No jobs found. Create your first job to get started.'
                    }
                  </Typography>
                  {(searchTerm || statusFilter) && (
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}
                      sx={{ mt: 1 }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedJobs.map((job) => {
                const priorityIndicator = getPriorityIndicator(job);
                return (
                <TableRow key={job.id} hover>
                  <TableCell>
                    <Chip
                      label={priorityIndicator.label}
                      color={priorityIndicator.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {job.id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {job.customer.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {job.customer.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatJobItems(job.items)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[job.status]}
                      color={statusColors[job.status]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(job.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {job.dueDate ? (
                        <>
                          {new Date(job.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          TBD
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Link href={`/admin/jobs/${job.id}`} passHref>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredJobs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
      />
    </Paper>
  );
}