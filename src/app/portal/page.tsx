'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function PortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect customers to their orders page
    console.log('🔄 Portal redirect: redirecting to /portal/orders');
    router.replace('/portal/orders');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography>Redirecting to your orders...</Typography>
    </Box>
  );
}