'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Paper,
  Chip,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'image/webp',
  'image/vnd.adobe.photoshop',
  'application/postscript',
  '.psd',
  '.ai',
];

const blackFridaySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  preferredContact: z.enum(['email', 'call', 'text']),
  email: z.string().optional(),
  phone: z.string().optional(),
  interestedInShirts: z.boolean(),
  interestedInHats: z.boolean(),
  shirtQuantity: z.number().optional(),
  hatQuantity: z.number().optional(),
  summary: z.string().min(10, 'Please provide at least 10 characters describing what you need'),
  honeypot: z.string().max(0, 'Bot detected'),
}).refine(
  (data) => data.interestedInShirts || data.interestedInHats,
  {
    message: 'Please select at least one product type (shirts or hats)',
    path: ['interestedInShirts'],
  }
).refine(
  (data) => {
    if (data.interestedInShirts && (!data.shirtQuantity || data.shirtQuantity < 50)) {
      return false;
    }
    return true;
  },
  {
    message: 'Shirt quantity must be at least 50',
    path: ['shirtQuantity'],
  }
).refine(
  (data) => {
    if (data.interestedInHats && (!data.hatQuantity || data.hatQuantity < 50)) {
      return false;
    }
    return true;
  },
  {
    message: 'Hat quantity must be at least 50',
    path: ['hatQuantity'],
  }
).refine(
  (data) => {
    if (data.preferredContact === 'email' && !data.email) {
      return false;
    }
    return true;
  },
  {
    message: 'Email is required for email contact',
    path: ['email'],
  }
).refine(
  (data) => {
    if (data.preferredContact === 'email' && data.email) {
      // Validate email format
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    }
    return true;
  },
  {
    message: 'Please enter a valid email address',
    path: ['email'],
  }
).refine(
  (data) => {
    if ((data.preferredContact === 'call' || data.preferredContact === 'text') && !data.phone) {
      return false;
    }
    return true;
  },
  {
    message: 'Phone number is required for call/text contact',
    path: ['phone'],
  }
);

type BlackFridayFormData = z.infer<typeof blackFridaySchema>;

export default function BlackFridayForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Failed to submit. Please try again.');
  const [files, setFiles] = useState<File[]>([]);
  const [interestedInShirts, setInterestedInShirts] = useState(false);
  const [interestedInHats, setInterestedInHats] = useState(false);
  const [preferredContact, setPreferredContact] = useState<'email' | 'call' | 'text' | ''>('call');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BlackFridayFormData>({
    resolver: zodResolver(blackFridaySchema),
    defaultValues: {
      interestedInShirts: false,
      interestedInHats: false,
      shirtQuantity: 50,
      hatQuantity: 50,
      preferredContact: 'call',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Validate file types and sizes
      const validFiles = newFiles.filter((file) => {
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          setErrorMessage(`File "${file.name}" is not a supported type`);
          setShowError(true);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage(`File "${file.name}" exceeds 10MB limit`);
          setShowError(true);
          return false;
        }
        return true;
      });

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BlackFridayFormData) => {
    setIsSubmitting(true);
    setErrorMessage('Failed to submit. Please try again.');

    try {
      // Create FormData to include files
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/black-friday', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowSuccess(true);
        reset();
        setFiles([]);
        setInterestedInShirts(false);
        setInterestedInHats(false);
        setPreferredContact('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to submit. Please try again.');
        setShowError(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const textFieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputBase-input': {
      color: '#fff',
    },
    '& .MuiFormHelperText-root': {
      color: 'rgba(255, 255, 255, 0.6)',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        position: 'relative',
        py: { xs: 6, md: 10 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/promo-form-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Image
            src="/687-logo.png"
            alt="687 Merch"
            width={288}
            height={96}
            style={{
              width: 'auto',
              height: '96px',
              maxWidth: '100%'
            }}
            priority
          />
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: '#000',
              fontFamily: 'var(--font-epilogue), "Epilogue", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              textTransform: 'uppercase',
              letterSpacing: '1px',
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: 3,
              display: 'inline-block',
            }}
          >
            Black Friday Deal
          </Box>
        </Box>

        {/* Success Message */}
        {isSubmitted ? (
          <Paper
            elevation={4}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: 3,
              backgroundColor: 'rgba(25, 25, 25, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'primary.main',
                fontFamily: 'var(--font-anton), "Anton", sans-serif',
                textTransform: 'uppercase',
                mb: 4,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                textAlign: 'center',
              }}
            >
              Deal Claimed!
            </Typography>

            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  mb: 3,
                  fontFamily: 'var(--font-epilogue), "Epilogue", sans-serif',
                }}
              >
                Next Steps
              </Typography>
              <Box component="ol" sx={{ color: '#fff', lineHeight: 2, fontSize: '1.1rem', pl: 3, mb: 4 }}>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem' }}>
                  First, we&apos;ll take a look at all the details you sent our way.
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem' }}>
                  Then we&apos;ll reach out to you as soon as we can—no ghosting here!
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem' }}>
                  Once everything&apos;s sorted, we&apos;ll whip up a mock-up of your project for you to check out.
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem' }}>
                  Give us the thumbs-up, and we&apos;ll get to work bringing your items to life!
                </Typography>
                <Typography component="li" sx={{ fontSize: '1.1rem' }}>
                  And when everything&apos;s ready to go… you&apos;ll pay us on delivery.
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  textAlign: 'center',
                }}
              >
                If you have any questions or concerns in the meantime reach out to us at{' '}
                <Box
                  component="a"
                  href="mailto:info@687merch.com"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  info@687merch.com
                </Box>
                {' '}or{' '}
                <Box
                  component="a"
                  href="tel:+14244603076"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  424 460 3076
                </Box>
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: 'rgba(25, 25, 25, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Product Selection */}
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                What are you interested in?
              </Typography>

              <FormGroup>
                <Controller
                  name="interestedInShirts"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            setInterestedInShirts(e.target.checked);
                          }}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>
                          T-Shirts!
                        </Typography>
                      }
                    />
                  )}
                />

                {interestedInShirts && (
                  <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                    <TextField
                      {...register('shirtQuantity', { valueAsNumber: true })}
                      label="Number of Shirts"
                      type="number"
                      inputProps={{ min: 50, step: 1 }}
                      fullWidth
                      error={!!errors.shirtQuantity}
                      helperText={errors.shirtQuantity?.message || 'Minimum 50 shirts'}
                      sx={textFieldSx}
                    />
                  </Box>
                )}

                <Controller
                  name="interestedInHats"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            setInterestedInHats(e.target.checked);
                          }}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>
                          Trucker Hats!
                        </Typography>
                      }
                    />
                  )}
                />

                {interestedInHats && (
                  <Box sx={{ ml: 4, mt: 1 }}>
                    <TextField
                      {...register('hatQuantity', { valueAsNumber: true })}
                      label="Number of Hats"
                      type="number"
                      inputProps={{ min: 50, step: 1 }}
                      fullWidth
                      error={!!errors.hatQuantity}
                      helperText={errors.hatQuantity?.message || 'Minimum 50 hats'}
                      sx={textFieldSx}
                    />
                  </Box>
                )}
              </FormGroup>

              {errors.interestedInShirts && !interestedInShirts && !interestedInHats && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.interestedInShirts.message}
                </Typography>
              )}
            </Box>

            {/* Project Summary */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Tell us in a few words about what we&apos;re making for you
              </Typography>

              <TextField
                {...register('summary')}
                multiline
                rows={4}
                fullWidth
                required
                placeholder="Just a few words here will do"
                error={!!errors.summary}
                helperText={errors.summary?.message}
                sx={textFieldSx}
              />
            </Box>

            {/* File Upload */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Do you have mockups, art or references? (Optional)
              </Typography>

              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(242, 191, 0, 0.1)',
                  },
                }}
              >
                Choose Files
                <input
                  type="file"
                  hidden
                  multiple
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                  onChange={handleFileChange}
                />
              </Button>

              {files.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {files.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index)}
                      sx={{
                        maxWidth: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: '#fff',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              )}

              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                Accepted formats: JPG, PNG, GIF, SVG, PDF, WebP, PSD, AI (max 10MB each)
              </Typography>
            </Box>

            {/* Contact Information */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                How do we get in touch?
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  {...register('firstName')}
                  label="First Name"
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={textFieldSx}
                />

                <TextField
                  {...register('lastName')}
                  label="Last Name"
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={textFieldSx}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <FormControl component="fieldset" error={!!errors.preferredContact}>
                  <FormLabel component="legend" sx={{ color: '#fff', mb: 1, '&.Mui-focused': { color: 'primary.main' } }}>
                    Preferred Contact Method *
                  </FormLabel>
                  <Controller
                    name="preferredContact"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        onChange={(e) => {
                          field.onChange(e);
                          setPreferredContact(e.target.value as 'email' | 'call' | 'text');
                        }}
                      >
                        <FormControlLabel
                          value="call"
                          control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: 'primary.main' } }} />}
                          label={<Typography sx={{ color: '#fff' }}>Call</Typography>}
                        />
                        <FormControlLabel
                          value="email"
                          control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: 'primary.main' } }} />}
                          label={<Typography sx={{ color: '#fff' }}>Email</Typography>}
                        />
                        <FormControlLabel
                          value="text"
                          control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: 'primary.main' } }} />}
                          label={<Typography sx={{ color: '#fff' }}>Text</Typography>}
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.preferredContact && (
                    <Typography variant="caption" sx={{ color: '#f44336', mt: 0.5 }}>
                      {errors.preferredContact.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {preferredContact === 'email' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    {...register('email')}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={textFieldSx}
                  />
                </Box>
              )}

              {(preferredContact === 'call' || preferredContact === 'text') && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    {...register('phone')}
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={textFieldSx}
                  />
                </Box>
              )}
            </Box>

            {/* Honeypot field - hidden from users */}
            <input
              {...register('honeypot')}
              type="text"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                backgroundColor: 'primary.main',
                color: '#000',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderRadius: 2,
                mt: 2,
                '&:hover': {
                  backgroundColor: '#f2d633',
                },
                '&:disabled': {
                  backgroundColor: '#666',
                  color: '#999',
                },
              }}
              startIcon={
                isSubmitting ? <CircularProgress size={20} sx={{ color: '#000' }} /> : null
              }
            >
              {isSubmitting ? 'Submitting...' : 'Claim Deal'}
            </Button>
          </Box>
        </Paper>
        )}
      </Container>

      {/* Success/Error Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={8000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thanks for your interest! We&apos;ll get back to you soon with a quote.
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
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
