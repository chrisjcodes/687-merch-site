'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useAnimation, type Variants } from 'framer-motion';
import { siteCopy } from '@/lib/data';

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function Hero() {
  const controls = useAnimation();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = () => {
      if (prefersReduced) {
        controls.set('visible');
      } else {
        controls.start('visible');
      }
    };

    if (document.visibilityState === 'visible') {
      start();
    } else {
      // Tab opened in background — wait until it's foregrounded
      const handler = () => {
        if (document.visibilityState === 'visible') {
          start();
          document.removeEventListener('visibilitychange', handler);
        }
      };
      document.addEventListener('visibilitychange', handler);
      return () => document.removeEventListener('visibilitychange', handler);
    }
  }, [controls]);

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
        <motion.div initial="hidden" animate={controls} variants={contentVariants}>
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

      {/* Solid dark strip at the very bottom so WaveDivider below butts up seamlessly */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: '#0f0f0f',
          zIndex: 3,
        }}
      />
    </Box>
  );
}
