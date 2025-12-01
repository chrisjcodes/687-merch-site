'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/admin',
      });

      if (result?.error) {
        setError('Failed to send magic link. Please try again.');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              Admin Login
            </Typography>
          </Box>

          {isSubmitted ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Check your email! We&apos;ve sent you a magic link to sign in.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  mb: 3,
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#000',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: '#f2d633',
                  },
                }}
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>

              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}
              >
                We&apos;ll email you a magic link for a password-free sign in.
              </Typography>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
