'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  TablePagination,
  InputAdornment,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Link from 'next/link';
import DeleteShopButton from './DeleteShopButton';

interface Shop {
  id: string;
  name: string;
  slug: string;
  isLive: boolean;
  activationMode: string;
  activeUntil: Date | null;
  shopifyCollectionId: string;
  createdAt: Date;
}

interface ShopsTableProps {
  shops: Shop[];
}

type StatusFilter = 'all' | 'active' | 'inactive';
type SortField = 'name' | 'createdAt' | 'activeUntil';
type SortDirection = 'asc' | 'desc';

export default function ShopsTable({ shops }: ShopsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredShops = useMemo(() => {
    const filtered = shops.filter((shop) => {
      const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.slug.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && shop.isLive) ||
        (statusFilter === 'inactive' && !shop.isLive);

      return matchesSearch && matchesStatus;
    });

    // Sort
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'activeUntil') {
        // Shops without activeUntil go to the end
        const aDate = a.activeUntil ? new Date(a.activeUntil).getTime() : Infinity;
        const bDate = b.activeUntil ? new Date(b.activeUntil).getTime() : Infinity;
        comparison = aDate - bDate;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [shops, search, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const paginatedShops = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredShops.slice(start, start + rowsPerPage);
  }, [filteredShops, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, newStatus: StatusFilter | null) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      setPage(0);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
          }}
        />

        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleStatusChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              px: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: '#000',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="inactive">Inactive</ToggleButton>
        </ToggleButtonGroup>

        {filteredShops.length !== shops.length && (
          <Chip
            label={`${filteredShops.length} of ${shops.length} shops`}
            size="small"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' }}
          />
        )}
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ color: '#fff', fontWeight: 700 }}
                sortDirection={sortField === 'name' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{
                    color: '#fff !important',
                    '&.Mui-active': { color: '#fff !important' },
                    '& .MuiTableSortLabel-icon': { color: 'rgba(255, 255, 255, 0.7) !important' },
                  }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Slug</TableCell>
              <TableCell
                sx={{ color: '#fff', fontWeight: 700 }}
                sortDirection={sortField === 'activeUntil' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'activeUntil'}
                  direction={sortField === 'activeUntil' ? sortDirection : 'asc'}
                  onClick={() => handleSort('activeUntil')}
                  sx={{
                    color: '#fff !important',
                    '&.Mui-active': { color: '#fff !important' },
                    '& .MuiTableSortLabel-icon': { color: 'rgba(255, 255, 255, 0.7) !important' },
                  }}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ color: '#fff', fontWeight: 700 }}
                sortDirection={sortField === 'createdAt' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('createdAt')}
                  sx={{
                    color: '#fff !important',
                    '&.Mui-active': { color: '#fff !important' },
                    '& .MuiTableSortLabel-icon': { color: 'rgba(255, 255, 255, 0.7) !important' },
                  }}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedShops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'rgba(255, 255, 255, 0.6)', py: 8 }}>
                  {shops.length === 0 ? 'No shops yet. Create your first one!' : 'No shops match your filters.'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedShops.map((shop) => (
                <TableRow key={shop.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <TableCell sx={{ color: '#fff' }}>{shop.name}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    /shop/{shop.slug}
                  </TableCell>
                  <TableCell>
                    {shop.isLive && shop.activationMode === 'scheduled' && shop.activeUntil ? (
                      <Tooltip title={`Ends ${new Date(shop.activeUntil).toLocaleDateString()}`}>
                        <Chip
                          icon={<ScheduleIcon sx={{ fontSize: 16, color: '#000 !important' }} />}
                          label={`Until ${new Date(shop.activeUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          size="small"
                          sx={{
                            bgcolor: '#ff9800',
                            color: '#000',
                            fontWeight: 600,
                            '& .MuiChip-icon': { color: '#000' },
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Chip
                        label={shop.isLive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: shop.isLive ? '#4caf50' : '#757575',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component="a"
                      href={`/shop/${shop.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ color: '#4caf50', mr: 1 }}
                      title="View shop"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      href={`/admin/shops/${shop.id}`}
                      size="small"
                      sx={{ color: 'primary.main', mr: 1 }}
                      title="Edit shop"
                    >
                      <EditIcon />
                    </IconButton>
                    <DeleteShopButton shopId={shop.id} shopName={shop.name} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filteredShops.length > 0 && (
          <TablePagination
            component="div"
            count={filteredShops.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              color: '#fff',
              '& .MuiTablePagination-selectIcon': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiTablePagination-select': { color: '#fff' },
              '& .MuiTablePagination-selectLabel': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiTablePagination-displayedRows': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiIconButton-root.Mui-disabled': { color: 'rgba(255, 255, 255, 0.3)' },
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
}
