import { Box, Typography } from '@mui/material';
import ShopForm from '../_components/ShopForm';

export default function NewShopPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Create New Shop
      </Typography>
      <ShopForm />
    </Box>
  );
}
