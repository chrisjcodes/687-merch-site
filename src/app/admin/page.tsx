import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { prisma } from '@/lib/prisma';
import UnassignedCollections from './_components/UnassignedCollections';

export default async function AdminDashboard() {
  const shops = await prisma.dropShop.findMany({
    select: { shopifyCollectionId: true, isLive: true },
  });

  const shopCount = shops.length;
  const liveShopCount = shops.filter(s => s.isLive).length;
  const assignedCollectionIds = shops.map(s => s.shopifyCollectionId);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Shops</Typography>
              </Box>
              <Typography variant="h3">{shopCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorefrontIcon sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6">Live Shops</Typography>
              </Box>
              <Typography variant="h3">{liveShopCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorefrontIcon sx={{ mr: 1, color: '#f44336' }} />
                <Typography variant="h6">Inactive Shops</Typography>
              </Box>
              <Typography variant="h3">{shopCount - liveShopCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <UnassignedCollections assignedCollectionIds={assignedCollectionIds} />
        </Grid>
      </Grid>
    </Box>
  );
}
