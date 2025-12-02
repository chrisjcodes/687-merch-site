import { Box, Container, Typography, Paper } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { formatOrderWindowDate } from '@/lib/shopStatus';

interface ShopClosedProps {
  shopName: string;
  closedAt?: Date | null;
}

export default function ShopClosed({ shopName, closedAt }: ShopClosedProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Shop is Currently Closed
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
            {shopName}
          </Typography>
          {closedAt && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              This shop closed on {formatOrderWindowDate(closedAt)}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This shop is not currently accepting orders. Please check back later.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
