import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { getCollections } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const collections = await getCollections();

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
                <Typography variant="h6">Collections</Typography>
              </Box>
              <Typography variant="h3">{collections.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Shop configuration is now managed through Shopify collection metafields.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
          To configure a shop, edit the collection metafields in your Shopify admin.
        </Typography>
      </Box>
    </Box>
  );
}
