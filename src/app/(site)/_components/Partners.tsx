'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
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
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: 'primary.main',
              mb: 2,
            }}
          >
            Past Partners
          </Typography>
        </Box>

        <Box sx={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center'
        }}>
          {partners.map((partner) => (
            <Box
              key={partner.name}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: { xs: 'calc(50% - 16px)', sm: 'calc(33.333% - 16px)' },
                minWidth: '140px'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '140px', sm: '160px', md: '180px', lg: '200px' },
                  height: { xs: '140px', sm: '160px', md: '180px', lg: '200px' },
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: partner.url ? 'pointer' : 'default',
                  transition: 'border-color 0.3s ease',
                  border: '3px solid #333',
                  '&:hover': {
                    borderColor: '#14b8a6',
                  },
                }}
                onClick={() => {
                  if (partner.url) {
                    window.open(partner.url, '_blank');
                  }
                }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  style={{
                    objectFit: 'contain',
                    padding: '20px',
                  }}
                />
              </Box>
            </Box>
            ))}
        </Box>
      </Container>
    </Box>
  );
}