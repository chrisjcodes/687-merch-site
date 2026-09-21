'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, type Variants } from 'framer-motion';
import { siteCopy } from '@/lib/data';

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box className="hero-overlay" />

      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: { xs: 3, sm: 4 } }}
      >
        <motion.div initial="hidden" animate="visible" variants={contentVariants}>
          <motion.div variants={itemVariant}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '5.5rem' },
                lineHeight: { xs: 1.05, sm: 1.0 },
              }}
            >
              {siteCopy.headline}
            </Typography>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                lineHeight: 1.7,
                maxWidth: '680px',
                mx: 'auto',
                mb: 5,
                opacity: 0.88,
              }}
            >
              {siteCopy.subhead}
            </Typography>
          </motion.div>

          <motion.div variants={itemVariant}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => scrollTo('services')}
                sx={{ px: 4, py: 1.5 }}
              >
                See How It Works
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="inherit"
                onClick={() => scrollTo('contact')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(255,255,255,0.45)',
                  '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Get a Quote
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Animated wave bottom edge */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          lineHeight: 0,
          '@keyframes heroWave': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        }}
      >
        <Box sx={{ display: 'flex', width: '200%', animation: 'heroWave 10s linear infinite' }}>
          {[0, 1].map((i) => (
            <svg
              key={i}
              viewBox="0 0 1440 48"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: 'block', width: '50%', height: 48, flexShrink: 0 }}
            >
              <path
                d="M0,24 C180,48 360,0 540,24 C720,48 900,0 1080,24 C1260,48 1380,12 1440,24 L1440,48 L0,48 Z"
                fill="#0f0f0f"
              />
            </svg>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
