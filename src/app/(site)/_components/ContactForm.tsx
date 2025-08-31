'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'), // Hidden field for spam prevention
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowSuccess(true);
        reset();
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'primary.main',
        color: '#000',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: '#000',
                mb: { xs: 4, md: 0 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.1,
              }}
            >
              Need Merch?<br />
              Let&apos;s Talk
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ minWidth: '48%' }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  {...register('firstName')}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#000' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#000' },
                    },
                    '& .MuiInputBase-input': { 
                      color: '#000',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                        WebkitTextFillColor: '#000',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                      '&:-webkit-autofill:hover': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                      '&:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                    },
                  }}
                />
                
                <TextField
                  {...register('lastName')}
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#000' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#000' },
                    },
                    '& .MuiInputBase-input': { 
                      color: '#000',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                        WebkitTextFillColor: '#000',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                      '&:-webkit-autofill:hover': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                      '&:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                    },
                  }}
                />
                
                <TextField
                  {...register('email')}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#000' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#000' },
                    },
                    '& .MuiInputBase-input': { 
                      color: '#000',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                        WebkitTextFillColor: '#000',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                      '&:-webkit-autofill:hover': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                      '&:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                    },
                  }}
                />
                
                <TextField
                  {...register('message')}
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#000' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#000' },
                    },
                    '& .MuiInputBase-input': { 
                      color: '#000',
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                        WebkitTextFillColor: '#000',
                        transition: 'background-color 5000s ease-in-out 0s',
                      },
                      '&:-webkit-autofill:hover': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                      '&:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.8) inset',
                      },
                    },
                  }}
                />

                {/* Honeypot field - hidden from users */}
                <input
                  {...register('honeypot')}
                  type="text"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#000',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: 2,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    '&:disabled': {
                      backgroundColor: '#666',
                      color: '#999',
                    },
                  }}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Success/Error Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Message sent successfully! We&apos;ll get back to you soon.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          Failed to send message. Please try again or contact us directly.
        </Alert>
      </Snackbar>
    </Box>
  );
}