'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { siteCopy } from '@/lib/data';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundSize: 'inherit',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Overlay */}
      <Box className="hero-overlay" />
      
      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            mb: 3,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '5rem' },
            lineHeight: { xs: 1.1, sm: 1.0 },
          }}
        >
          {siteCopy.headline}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            lineHeight: 1.6,
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            opacity: 0.9,
          }}
        >
          {siteCopy.subhead}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{ px: 4, py: 1.5 }}
          >
            See How It Works
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={scrollToContact}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Get a Quote
          </Button>
        </Box>
      </Container>

      {/* Wave bottom edge */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#fff" />
        </svg>
      </Box>
    </Box>
  );
}