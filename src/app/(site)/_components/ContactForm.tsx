'use client';

import React, { useState } from 'react';
import { track } from '@vercel/analytics/react';
import { useTrackSection } from '@/hooks/useTrackSection';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ─── Schema ─────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Please enter a valid email address'),
  phone:     z.string().optional(),
  quantity:  z.string().optional(),
  message:   z.string().optional(),
  honeypot:  z.string().max(0),
  model:     z.string().optional(),
  occasion:  z.string().optional(),
  timeline:  z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Chip selector ──────────────────────────────────────────────────────────

type ChipOption = { label: string; value: string };

function ChipGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: ChipOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 1.25,
          color: 'rgba(0,0,0,0.6)',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <Box
              key={opt.value}
              component="button"
              type="button"
              onClick={() => onChange(selected ? '' : opt.value)}
              sx={{
                px: 2,
                py: 0,
                minHeight: 44,
                border: '1.5px solid',
                borderColor: selected ? '#000' : 'rgba(0,0,0,0.3)',
                borderRadius: '999px',
                backgroundColor: selected ? '#000' : 'transparent',
                color: selected ? '#f2bf00' : '#000',
                fontSize: '0.82rem',
                fontWeight: selected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                lineHeight: 1.4,
                fontFamily: 'inherit',
                '&:hover': {
                  borderColor: '#000',
                  backgroundColor: selected ? '#111' : 'rgba(0,0,0,0.06)',
                },
                '&:focus-visible': {
                  outline: '2px solid #000',
                  outlineOffset: '2px',
                },
              }}
            >
              {opt.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Field style (on yellow bg) ─────────────────────────────────────────────

const fieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.6)',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#000' },
  },
  '& .MuiInputBase-input': {
    color: '#000',
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px rgba(255,255,255,0.6) inset',
      WebkitTextFillColor: '#000',
    },
  },
  // Error state: dark text on yellow — red is unreadable here
  '& .MuiFormHelperText-root.Mui-error': {
    color: '#000',
    fontWeight: 700,
    fontSize: '0.8rem',
    backgroundColor: 'rgba(0,0,0,0.08)',
    px: 1,
    py: 0.25,
    borderRadius: 0.5,
    mt: 0.5,
  },
  '& .MuiOutlinedInput-root.Mui-error fieldset': {
    borderColor: '#000',
    borderWidth: 2,
  },
};

// ─── Options ────────────────────────────────────────────────────────────────

const MODEL_OPTIONS: ChipOption[] = [
  { label: 'Traditional Production',    value: 'traditional' },
  { label: 'Flexible Merch',            value: 'flexible'    },
  { label: 'Mobile Merch',              value: 'mobile'      },
  { label: "Not sure — help me decide", value: 'unsure'      },
];

const OCCASION_OPTIONS: ChipOption[] = [
  { label: 'Live Event / Concert',  value: 'event'     },
  { label: 'Business / Corporate',  value: 'corporate' },
  { label: 'Brand / Streetwear',    value: 'brand'     },
  { label: 'School / Organization', value: 'school'    },
  { label: 'Other',                 value: 'other'     },
];

const TIMELINE_OPTIONS: ChipOption[] = [
  { label: 'ASAP',            value: 'asap' },
  { label: 'Within a month',  value: '1mo'  },
  { label: '1–3 months',      value: '3mo'  },
  { label: 'No set date yet', value: 'tbd'  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function ContactForm() {
  const sectionRef = useTrackSection('ContactForm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [showError, setShowError]       = useState(false);
  const [model, setModel]               = useState('');
  const [occasion, setOccasion]         = useState('');
  const [timeline, setTimeline]         = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  // P0-2: scroll to first error field on failed validation
  const onError = () => {
    const firstErrorName = ['firstName', 'lastName', 'email'].find(
      (f) => errors[f as keyof typeof errors]
    );
    if (firstErrorName) {
      const el = document.querySelector<HTMLElement>(`[name="${firstErrorName}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, model, occasion, timeline }),
      });
      if (response.ok) {
        track('contact_form_submitted', { model, occasion, timeline });
        setShowSuccess(true);
        reset();
        setModel('');
        setOccasion('');
        setTimeline('');
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box ref={sectionRef} id="contact" sx={{ py: { xs: 10, md: 14 }, backgroundColor: 'primary.main' }}>
      <Container maxWidth="md">

        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography variant="h2" component="h2" sx={{ color: '#000', mb: 2 }}>
            Let&apos;s Talk Merch
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', maxWidth: 520, lineHeight: 1.75 }}>
            Tell us about what you&apos;re working on and we&apos;ll reach back out—or just say hi if you&apos;re still figuring it out. We usually reply within one business day.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          {/* Name row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              {...register('firstName')}
              label="First name"
              fullWidth
              required
              autoComplete="given-name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              inputProps={{ 'aria-required': 'true' }}
              sx={fieldSx}
            />
            <TextField
              {...register('lastName')}
              label="Last name"
              fullWidth
              required
              autoComplete="family-name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              inputProps={{ 'aria-required': 'true' }}
              sx={fieldSx}
            />
          </Box>

          {/* Email */}
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            required
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            inputProps={{ 'aria-required': 'true' }}
            sx={fieldSx}
          />

          {/* Phone (optional) */}
          <TextField
            {...register('phone')}
            label="Phone (optional)"
            type="tel"
            fullWidth
            autoComplete="tel"
            inputProps={{ inputMode: 'tel' }}
            sx={fieldSx}
          />

          {/* Model interest */}
          <ChipGroup
            label="Which model interests you?"
            options={MODEL_OPTIONS}
            value={model}
            onChange={setModel}
          />

          {/* Occasion */}
          <ChipGroup
            label="What's the occasion?"
            options={OCCASION_OPTIONS}
            value={occasion}
            onChange={setOccasion}
          />

          {/* Timeline */}
          <ChipGroup
            label="When do you need it?"
            options={TIMELINE_OPTIONS}
            value={timeline}
            onChange={setTimeline}
          />

          {/* Quantity */}
          <TextField
            {...register('quantity')}
            label="Estimated quantity (optional)"
            fullWidth
            placeholder="e.g. 100 shirts"
            inputProps={{ inputMode: 'numeric' }}
            sx={fieldSx}
          />

          {/* Message */}
          <TextField
            {...register('message')}
            label="Anything else we should know?"
            multiline
            rows={3}
            fullWidth
            sx={fieldSx}
          />

          {/* Honeypot */}
          <input {...register('honeypot')} type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: '#999' }} /> : null}
            sx={{
              backgroundColor: '#000',
              color: 'primary.main',
              py: 2,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: 2,
              '&:hover': { backgroundColor: '#222' },
              '&:disabled': { backgroundColor: '#555', color: '#999' },
            }}
          >
            {isSubmitting ? 'Sending…' : 'Send'}
          </Button>
        </Box>
      </Container>

      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Got it! We&apos;ll be in touch within one business day.
        </Alert>
      </Snackbar>
      <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          Something went wrong. Try again or email us directly.
        </Alert>
      </Snackbar>
    </Box>
  );
}
