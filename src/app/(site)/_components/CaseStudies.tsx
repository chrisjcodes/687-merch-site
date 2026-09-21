'use client';

import React, { useCallback } from 'react';
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
import useEmblaCarousel from 'embla-carousel-react';
import { recentWork } from '@/lib/data';
import { ProductionModel } from '@/lib/types';

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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <Box
      id="work"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#1a1a1a',
        color: '#eaeaea',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
            Case Studies
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#999', maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}
          >
            Every project is different. Here&apos;s why each client chose the model they did.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={scrollPrev}
            aria-label="Previous"
            sx={{
              position: 'absolute',
              left: { xs: -20, sm: -40 },
              top: '45%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
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
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
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
                    sx={{ flex: '0 0 auto', width: { xs: '280px', sm: '320px', md: '340px' } }}
                  >
                    <Card
                      onClick={() => onItemClick?.(item)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: '#111',
                        border: '1px solid #2a2a2a',
                        borderRadius: 3,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color 0.25s ease',
                        '&:hover': { borderColor: '#444' },
                      }}
                    >
                      {/* Image with model badge overlay */}
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
                              top: 12,
                              left: 12,
                              backgroundColor: colors.bg,
                              color: colors.text,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                            }}
                          >
                            {label}
                          </Box>
                        )}
                      </Box>

                      <CardContent
                        sx={{
                          p: 3,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            color: '#eaeaea',
                            textTransform: 'uppercase',
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </Typography>

                        {item.context && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#888',
                              lineHeight: 1.6,
                              fontSize: '0.82rem',
                              flex: 1,
                            }}
                          >
                            {item.context}
                          </Typography>
                        )}

                        {item.year && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#555', display: 'block' }}
                          >
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

        {/* Legend */}
        <Box
          sx={{
            mt: 5,
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {(Object.entries(MODEL_LABELS) as [ProductionModel, string][]).map(([key, label]) => (
            <Box
              key={key}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: MODEL_COLORS[key].bg,
                  border: key === 'traditional' ? '1px solid #444' : 'none',
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
