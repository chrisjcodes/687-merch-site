'use client';

import React, { useCallback } from 'react';
import { useTrackSection } from '@/hooks/useTrackSection';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { recentWork } from '@/lib/data';
import { ProductionModel } from '@/lib/types';
import WaveDivider from './WaveDivider';

const MODEL_LABELS: Record<ProductionModel, string> = {
  traditional: 'Traditional',
  flexible: 'Flexible Merch',
  mobile: 'Mobile Merch',
};

const MODEL_COLORS: Record<ProductionModel, { bg: string; text: string }> = {
  traditional: { bg: '#1a1a1a', text: '#eaeaea' },
  flexible: { bg: '#f2bf00', text: '#000' },
  mobile: { bg: '#000', text: '#f2bf00' },
};

interface CaseStudiesProps {
  onItemClick?: (item: typeof recentWork[0]) => void;
}

export default function CaseStudies({ onItemClick }: CaseStudiesProps) {
  const sectionRef = useTrackSection('CaseStudies');
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <>
      <WaveDivider fromColor="#0f0f0f" toColor="#1a1a1a" height={60} />

      <Box
        ref={sectionRef}
        id="work"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#1a1a1a',
          color: '#eaeaea',
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            sx={{ mb: 6, textAlign: 'center' }}
          >
            <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
              Case Studies
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#aaa', maxWidth: 520, mx: 'auto', lineHeight: 1.75 }}
            >
              Every project is different. Here&apos;s why each client chose the model they did.
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            sx={{ position: 'relative' }}
          >
            <IconButton
              onClick={scrollPrev}
              aria-label="Previous"
              sx={{
                position: 'absolute',
                left: { xs: -20, sm: -40 },
                top: '45%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <IconButton
              onClick={scrollNext}
              aria-label="Next"
              sx={{
                position: 'absolute',
                right: { xs: -20, sm: -40 },
                top: '45%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
              }}
            >
              <ArrowForwardIos />
            </IconButton>

            <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', gap: 3, pb: 2 }}>
                {recentWork.map((item) => {
                  const model = item.productionModel;
                  const colors = model ? MODEL_COLORS[model] : MODEL_COLORS.traditional;
                  const label = model ? MODEL_LABELS[model] : null;

                  return (
                    <Box
                      key={item.slug}
                      sx={{ flex: '0 0 auto', width: { xs: '272px', sm: '310px', md: '330px' } }}
                    >
                      <Card
                        component={motion.div}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        onClick={() => onItemClick?.(item)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: '#111',
                          border: '1px solid #242424',
                          borderRadius: 3,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'border-color 0.2s ease',
                          '&:hover': { borderColor: '#3a3a3a' },
                        }}
                      >
                        <Box sx={{ position: 'relative', aspectRatio: '1/1', flexShrink: 0 }}>
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {label && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                backgroundColor: colors.bg,
                                color: colors.text,
                                px: 1.25,
                                py: 0.4,
                                borderRadius: 0.75,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.55px',
                              }}
                            >
                              {label}
                            </Box>
                          )}
                        </Box>

                        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              color: '#eaeaea',
                              textTransform: 'uppercase',
                              fontSize: { xs: '0.82rem', sm: '0.9rem' },
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </Typography>

                          {item.context && (
                            <Typography
                              variant="body2"
                              sx={{ color: '#aaa', lineHeight: 1.65, fontSize: '0.82rem', flex: 1 }}
                            >
                              {item.context}
                            </Typography>
                          )}

                          {item.year && (
                            <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>
                              {item.year}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Model legend */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ mt: 5, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {(Object.entries(MODEL_LABELS) as [ProductionModel, string][]).map(([key, label]) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    backgroundColor: key === 'mobile' ? '#f2bf00' : MODEL_COLORS[key].bg,
                    border: key === 'traditional' ? '1px solid #666' : key === 'mobile' ? 'none' : 'none',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: '#aaa', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}
