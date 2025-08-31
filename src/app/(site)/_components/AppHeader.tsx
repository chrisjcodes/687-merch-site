'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
} from '@mui/material';
import Image from 'next/image';

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    setScrolled(trigger);
  }, [trigger]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled 
          ? 'rgba(15, 15, 15, 0.95)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Image
              src="/687-logo.webp"
              alt="687 Merch Logo"
              width={40}
              height={40}
              style={{ marginRight: '12px' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.1em',
                fontSize: '1.2rem',
              }}
            >
              687 MERCH
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => scrollToSection('work')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(242, 191, 0, 0.1)',
                },
              }}
            >
              Work
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('partners')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(242, 191, 0, 0.1)',
                },
              }}
            >
              Partners
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('contact')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(242, 191, 0, 0.1)',
                },
              }}
            >
              Contact
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}