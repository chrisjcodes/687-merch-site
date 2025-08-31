'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';
import Image from 'next/image';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #333',
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 1 }}>
            <Image
              src="/687-logo.png"
              alt="687 Merch"
              width={96}
              height={32}
              style={{ width: 'auto', height: '32px', maxWidth: '100%' }}
              priority
            />
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Think Big. Start Small.
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            © {currentYear} 687 Merch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}