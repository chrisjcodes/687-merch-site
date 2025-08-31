'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
} from '@mui/material';
import Image from 'next/image';
import { partners } from '@/lib/data';

export default function Partners() {
  return (
    <Box
      id="partners"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#1a1a1a',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: 'primary.main',
              mb: 2,
            }}
          >
            Past Partners
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={{ xs: 4, md: 6 }}
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
          }}
        >
          {partners.map((partner, index) => (
            <Grid 
              item 
              xs={6} 
              sm={3} 
              key={partner.name}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100px', sm: '120px', md: '140px' },
                  height: { xs: '100px', sm: '120px', md: '140px' },
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: partner.url ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  border: '2px solid #333',
                  filter: 'grayscale(100%)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'grayscale(0%)',
                    borderColor: '#f2bf00',
                  },
                }}
                onClick={() => {
                  if (partner.url) {
                    window.open(partner.url, '_blank');
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '60%',
                    height: '60%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {partner.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
          
          {/* Add more placeholder circles to fill out the grid */}
          {[...Array(4)].map((_, index) => (
            <Grid 
              item 
              xs={6} 
              sm={3} 
              key={`placeholder-${index}`}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100px', sm: '120px', md: '140px' },
                  height: { xs: '100px', sm: '120px', md: '140px' },
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '2px solid #333',
                  filter: 'grayscale(100%)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    borderColor: '#444',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '60%',
                    height: '60%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#555',
                      textAlign: 'center',
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Partner Logo
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}