'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #1e1e1e',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 4, sm: 0 },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {/* Brand */}
          <Box>
            <Box sx={{ mb: 1.5 }}>
              <Image
                src="/images/687-logo-white.svg"
                alt="687 Merch"
                width={192}
                height={64}
                style={{ width: 'auto', height: '44px', maxWidth: '100%' }}
                priority
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
              Your Merch Partner.
            </Typography>
          </Box>

          {/* Contact info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography variant="body2" sx={{ color: '#777', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
              Get in touch
            </Typography>
            <Typography
              component="a"
              href="tel:+14242603076"
              variant="body2"
              sx={{ color: '#999', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#f2bf00' } }}
            >
              (424) 260-3076
            </Typography>
            <Typography
              component="a"
              href="mailto:info@687merch.com"
              variant="body2"
              sx={{ color: '#999', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#f2bf00' } }}
            >
              info@687merch.com
            </Typography>
            <Typography
              component="a"
              href="https://instagram.com/687merch"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{ color: '#999', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#f2bf00' } }}
            >
              @687merch
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', fontSize: '0.78rem' }}>
              Based in Los Angeles, CA
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 6 }, pt: 3, borderTop: '1px solid #1a1a1a' }}>
          <Typography variant="body2" sx={{ color: '#444', fontSize: '0.75rem' }}>
            © {currentYear} 687 Merch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}