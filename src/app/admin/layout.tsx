import { PortalNavigation } from '../components/PortalNavigation';
import { Box } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <PortalNavigation />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
}