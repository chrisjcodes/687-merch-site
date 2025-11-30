import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const shopCount = await prisma.dropShop.count();
  const liveShopCount = await prisma.dropShop.count({
    where: { isLive: true },
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
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
      </Grid>
    </Box>
  );
}
