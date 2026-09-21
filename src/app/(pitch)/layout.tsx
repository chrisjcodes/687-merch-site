'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import theme from '../(site)/theme';
import '../(site)/globals.css';

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Minimal sticky header */}
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid #1a1a1a',
            backgroundColor: 'rgba(15,15,15,0.96)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.75 }}>
              <Link href="/" style={{ display: 'block', lineHeight: 0 }}>
                <Image
                  src="/images/687-logo-white.svg"
                  alt="687 Merch"
                  width={120}
                  height={40}
                  style={{ width: 'auto', height: '26px' }}
                  priority
                />
              </Link>
              <Typography
                component="a"
                href="/#contact"
                sx={{
                  color: '#f2bf00',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  '&:hover': { opacity: 0.75 },
                  transition: 'opacity 0.15s ease',
                }}
              >
                Get in touch →
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1 }}>{children}</Box>

        {/* Minimal footer */}
        <Box component="footer" sx={{ borderTop: '1px solid #161616', py: { xs: 4, md: 5 } }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
              <Image
                src="/images/687-logo-white.svg"
                alt="687 Merch"
                width={100}
                height={34}
                style={{ width: 'auto', height: '20px', opacity: 0.25 }}
              />
              <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 }, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography
                  component="a"
                  href="/faq"
                  variant="caption"
                  sx={{ color: '#888', textDecoration: 'none', '&:hover': { color: '#f2bf00' }, transition: 'color 0.15s' }}
                >
                  FAQ
                </Typography>
                <Typography
                  component="a"
                  href="tel:+14242603076"
                  variant="caption"
                  sx={{ color: '#888', textDecoration: 'none', '&:hover': { color: '#f2bf00' }, transition: 'color 0.15s' }}
                >
                  (424) 260-3076
                </Typography>
                <Typography
                  component="a"
                  href="mailto:info@687merch.com"
                  variant="caption"
                  sx={{ color: '#888', textDecoration: 'none', '&:hover': { color: '#f2bf00' }, transition: 'color 0.15s' }}
                >
                  info@687merch.com
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
