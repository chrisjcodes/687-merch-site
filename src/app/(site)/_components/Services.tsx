'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { services } from '@/lib/data';
import WaveDivider from './WaveDivider';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SERVICE_IMAGES: Record<string, string | null> = {
  traditional: '/images/service-traditional.jpg',
  flexible: '/images/service-flexible.jpg',
  mobile: '/images/van.png',
};

export default function Services() {
  return (
    <>
      <WaveDivider fromColor="#0f0f0f" toColor="#fff" height={80} />

      <Box id="services" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#fff', color: '#000' }}>
        <Container maxWidth="lg">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
              <Typography variant="h2" component="h2" sx={{ color: '#000', mb: 2 }}>
                How We Work
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#555', maxWidth: 600, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.75 }}
              >
                Every merch project is different. We offer three production models so you get the one
                that actually fits your needs—not the one that&apos;s easiest for us.
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {services.map((service) => {
                const imageSrc = SERVICE_IMAGES[service.id] ?? null;
                const hasImage = imageSrc !== null;

                return (
                  <motion.div
                    key={service.id}
                    variants={cardVariant}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: service.featured ? '2px solid #000' : '2px solid #e0e0e0',
                        backgroundColor: service.featured ? '#0f0f0f' : '#fafafa',
                      }}
                    >
                      {/* Image */}
                      {hasImage && (
                        <Box sx={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden' }}>
                          <Image
                            src={imageSrc as string}
                            alt={service.title}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </Box>
                      )}

                      {/* No-image placeholder showing the icon large */}
                      {!hasImage && (
                        <Box
                          sx={{
                            height: 140,
                            flexShrink: 0,
                            backgroundColor: service.featured ? '#1a1a1a' : '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-anton), "Anton", sans-serif',
                              fontSize: '5rem',
                              lineHeight: 1,
                              color: service.featured ? '#2a2a2a' : '#ddd',
                            }}
                          >
                            {service.icon}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ p: { xs: 3, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-anton), "Anton", sans-serif',
                            fontSize: '2rem',
                            lineHeight: 1,
                            color: service.featured ? '#f2bf00' : '#e0e0e0',
                            mb: 1.5,
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
                            fontSize: { xs: '1rem', md: '1.1rem' },
                          }}
                        >
                          {service.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: service.featured ? '#f2bf00' : '#666',
                            fontWeight: 600,
                            fontSize: '0.8rem',
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
                            color: service.featured ? '#bbb' : '#444',
                            lineHeight: 1.75,
                            flex: 1,
                            fontSize: '0.92rem',
                          }}
                        >
                          {service.body}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#888', fontSize: '0.92rem' }}>
                We also offer{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#000' }}>
                  design services
                </Box>{' '}
                with any approach—including designing for other printers on items we don&apos;t provide.
              </Typography>
            </Box>
          </motion.div>

        </Container>
      </Box>

      <WaveDivider fromColor="#fff" toColor="#0f0f0f" height={80} />
    </>
  );
}
