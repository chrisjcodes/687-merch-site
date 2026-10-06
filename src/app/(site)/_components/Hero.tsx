'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useAnimation, type Variants } from 'framer-motion';
import { track } from '@vercel/analytics/react';
import { siteCopy } from '@/lib/data';
import { useTrackSection } from '@/hooks/useTrackSection';

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const vanVariant: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

export default function Hero() {
  const controls = useAnimation();
  const sectionRef = useTrackSection('Hero');

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

  const vanImage = (position: 'mobile' | 'desktop') => (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={vanVariant}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Image
        src="/images/van-illustration.svg"
        alt="687 Merch mobile production van"
        fill
        unoptimized
        style={{
          objectFit: 'contain',
          objectPosition: position === 'mobile' ? 'center bottom' : 'right bottom',
        }}
        priority={position === 'desktop'}
      />
    </motion.div>
  );

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '100svh' },
        minHeight: { xs: 0, md: '600px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Desktop van — absolutely positioned right side, hidden on mobile */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          bottom: 0,
          right: '-4%',
          width: '62%',
          height: '80%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {vanImage('desktop')}
      </Box>

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 50%, transparent 70%)',
            md: 'linear-gradient(to right, #0a0a0a 0%, #0a0a0a 38%, transparent 58%)',
          },
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Content + mobile van */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, px: { xs: 3, sm: 4 } }}>
        <motion.div initial="hidden" animate={controls} variants={contentVariants}>
          <Box sx={{ maxWidth: { xs: '100%', md: '52%' } }}>
            <motion.div variants={itemVariant}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '5.5rem' },
                  lineHeight: { xs: 1.05, sm: 1.0 },
                  textAlign: { xs: 'center', md: 'left' },
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
                  mb: 5,
                  opacity: 0.88,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {siteCopy.subhead}
              </Typography>
            </motion.div>

            <motion.div variants={itemVariant}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => { scrollTo('how-we-work'); track('cta_clicked', { button: 'See How It Works', location: 'Hero' }); }}
                  sx={{ px: 4, py: 1.5 }}
                >
                  See How It Works
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  onClick={() => { scrollTo('contact'); track('cta_clicked', { button: 'Get a Quote', location: 'Hero' }); }}
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

            {/* Mobile van — in-flow directly below buttons, hidden on desktop */}
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                mt: 4,
                mx: { xs: -3, sm: -4 },
                height: '50vw',
                position: 'relative',
              }}
            >
              {vanImage('mobile')}
            </Box>
          </Box>
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
