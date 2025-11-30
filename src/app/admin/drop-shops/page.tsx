import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function DropShopsListPage() {
  const shops = await prisma.dropShop.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Drop Shops
        </Typography>
        <Button
          component={Link}
          href="/admin/drop-shops/new"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'primary.main',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              bgcolor: '#f2d633',
            },
          }}
        >
          New Shop
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Slug</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Collection ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Created</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'rgba(255, 255, 255, 0.6)', py: 8 }}>
                  No drop shops yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              shops.map((shop) => (
                <TableRow key={shop.id} hover>
                  <TableCell sx={{ color: '#fff' }}>{shop.name}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    /drop/{shop.slug}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={shop.isLive ? 'Live' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: shop.isLive ? '#4caf50' : '#757575',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {shop.shopifyCollectionId.substring(0, 20)}...
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      href={`/admin/drop-shops/${shop.id}`}
                      size="small"
                      sx={{ color: 'primary.main', mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#f44336' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
