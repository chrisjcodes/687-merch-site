'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
} from '@mui/material';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #333',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.1em',
                fontSize: '1.2rem',
                mb: 1,
              }}
            >
              687 MERCH
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
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
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                justifyContent: { md: 'flex-end' },
              }}
            >
              <Link
                href="/#work"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Work
              </Link>
              
              <Link
                href="/#partners"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Partners
              </Link>
              
              <Link
                href="/#contact"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}