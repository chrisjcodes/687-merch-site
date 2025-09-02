'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('🎯 Dashboard redirect - Status:', status, 'Session:', session?.user);
    
    if (status === 'loading') {
      console.log('⏳ Still loading session...');
      return; // Still loading
    }
    
    if (!session) {
      console.log('❌ No session found, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    console.log('👤 User role:', session.user.role);

    // Redirect based on user role
    if (session.user.role === 'ADMIN') {
      console.log('🔐 Redirecting admin to /admin/jobs');
      router.push('/admin/jobs');
    } else if (session.user.role === 'CUSTOMER') {
      console.log('👤 Redirecting customer to /portal/orders');
      router.push('/portal/orders');
    } else {
      console.log('❓ Unknown role, redirecting to home');
      router.push('/');
    }
  }, [session, status, router]);

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
      <Typography>Redirecting to your dashboard...</Typography>
      <Typography variant="caption" color="text.secondary">
        Status: {status} | Role: {session?.user?.role || 'Unknown'}
      </Typography>
    </Box>
  );
}