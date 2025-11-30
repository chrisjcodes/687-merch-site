import { Box, Typography } from '@mui/material';
import DropShopForm from '../_components/DropShopForm';

export default function NewDropShopPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Create New Drop Shop
      </Typography>
      <DropShopForm />
    </Box>
  );
}
