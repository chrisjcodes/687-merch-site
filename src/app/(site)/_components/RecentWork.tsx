'use client';

import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { recentWork } from '@/lib/data';

interface RecentWorkProps {
  onItemClick?: (item: typeof recentWork[0]) => void;
}

export default function RecentWork({ onItemClick }: RecentWorkProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleItemClick = (item: typeof recentWork[0]) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      // Navigate to work detail page
      window.location.href = `/work/${item.slug}`;
    }
  };

  return (
    <Box
      id="work"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
        color: '#000',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: '#000',
              mb: 2,
            }}
          >
            Our Recent Work
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Navigation Buttons */}
          <IconButton
            onClick={scrollPrev}
            sx={{
              position: 'absolute',
              left: { xs: -20, sm: -40 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              },
            }}
          >
            <ArrowBackIos />
          </IconButton>
          
          <IconButton
            onClick={scrollNext}
            sx={{
              position: 'absolute',
              right: { xs: -20, sm: -40 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Carousel */}
          <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                pb: 2,
              }}
            >
              {recentWork.map((item) => (
                <Box
                  key={item.slug}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '280px', sm: '320px', md: '360px' },
                  }}
                >
                  <Card
                    onClick={() => handleItemClick(item)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'border-color 0.3s ease',
                      '&:hover': {
                        borderColor: '#14b8a6',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', aspectRatio: '1/1' }}>
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#000',
                          mb: 1,
                          textTransform: 'uppercase',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      {item.tags && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                          {item.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      {item.year && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1,
                            color: '#999',
                          }}
                        >
                          {item.year}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}