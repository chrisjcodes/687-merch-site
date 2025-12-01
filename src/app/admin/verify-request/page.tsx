'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Image from 'next/image';
import Link from 'next/link';

export default function VerifyRequestPage() {
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

          <EmailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Check your email
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            A sign-in link has been sent to your email address. Click the link in the email to
            sign in.
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.5)' }}>
            If you don&apos;t see the email, check your spam folder.
          </Typography>

          <Button
            component={Link}
            href="/admin/login"
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(242, 191, 0, 0.1)',
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
