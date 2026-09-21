'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { services } from '@/lib/data';

export default function Services() {
  return (
    <Box
      id="services"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#fff',
        color: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Wave top divider */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          lineHeight: 0,
        }}
      >
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 48 }}>
          <path d="M0,24 C180,48 360,0 540,24 C720,48 900,0 1080,24 C1260,48 1380,12 1440,24 L1440,0 L0,0 Z" fill="#0f0f0f" />
        </svg>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ color: '#000', mb: 2 }}
          >
            How We Work
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#444', maxWidth: 640, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            The goal is the same across all three: give you the production model that makes the most sense
            for your needs instead of forcing every merch project into a traditional bulk order.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {services.map((service) => (
            <Box
              key={service.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                border: service.featured ? '2px solid #000' : '2px solid #e0e0e0',
                backgroundColor: service.featured ? '#0f0f0f' : '#fafafa',
                transition: 'box-shadow 0.25s ease',
                '&:hover': {
                  boxShadow: service.featured
                    ? '0 8px 40px rgba(0,0,0,0.25)'
                    : '0 8px 40px rgba(0,0,0,0.1)',
                },
              }}
            >
              {/* Van image banner for Mobile Merch */}
              {service.featured && (
                <Box sx={{ position: 'relative', height: 200, flexShrink: 0 }}>
                  <Image
                    src="/images/van.png"
                    alt="687 Merch Mobile Van"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </Box>
              )}

              <Box sx={{ p: { xs: 3, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-anton), "Anton", sans-serif',
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: service.featured ? '#f2bf00' : '#e0e0e0',
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Typography>

                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    color: service.featured ? '#fff' : '#000',
                    mb: 1,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  {service.title}
                </Typography>

                <Typography
                  sx={{
                    color: service.featured ? '#f2bf00' : '#555',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 2,
                  }}
                >
                  {service.tagline}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: service.featured ? '#ccc' : '#444',
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  {service.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Design services note */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{ color: '#666', fontSize: '0.95rem' }}
          >
            We also offer{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#000' }}>
              design services
            </Box>{' '}
            as part of any approach—including designing for other printers on items we don&apos;t provide.
          </Typography>
        </Box>
      </Container>

      {/* Wave bottom divider */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          lineHeight: 0,
        }}
      >
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 48 }}>
          <path d="M0,24 C180,0 360,48 540,24 C720,0 900,48 1080,24 C1260,0 1380,36 1440,24 L1440,48 L0,48 Z" fill="#1a1a1a" />
        </svg>
      </Box>
    </Box>
  );
}
