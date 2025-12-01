'use client';

import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Image from 'next/image';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0f0f0f',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            bgcolor: '#1a1a1a',
            color: '#fff',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Image
              src="/687-logo.png"
              alt="687 Merch"
              width={192}
              height={64}
              style={{
                width: 'auto',
                height: '64px',
                maxWidth: '100%',
              }}
              priority
            />
          </Box>

          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Authentication Error
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {getErrorMessage(error)}
          </Alert>

          {error && (
            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.5)' }}>
              Error code: {error}
            </Typography>
          )}

          <Button
            component={Link}
            href="/admin/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              color: '#000',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#f2d633',
              },
            }}
          >
            Back to Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
