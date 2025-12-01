import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ShopsTable from './_components/ShopsTable';

export const dynamic = 'force-dynamic';

export default async function ShopsListPage() {
  const shops = await prisma.dropShop.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Shops
        </Typography>
        <Button
          component={Link}
          href="/admin/shops/new"
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

      <ShopsTable shops={shops} />
    </Box>
  );
}
