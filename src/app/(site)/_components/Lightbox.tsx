'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Image from 'next/image';

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  open,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
          break;
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentIndex, images.length, onClose, onNavigate]);

  const handlePrevious = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          margin: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)',
        },
      }}
      aria-labelledby="lightbox-dialog"
      aria-describedby="image-gallery-lightbox"
    >
      <DialogContent
        sx={{
          position: 'relative',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? '100vh' : '500px',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          aria-label="Close lightbox"
        >
          <Close />
        </IconButton>

        {/* Previous Button */}
        {images.length > 1 && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            aria-label="Previous image"
          >
            <ArrowBackIos />
          </IconButton>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            aria-label="Next image"
          >
            <ArrowForwardIos />
          </IconButton>
        )}

        {/* Image */}
        {images[currentIndex] && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1} of ${images.length}`}
              fill
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              priority
            />
          </Box>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
              zIndex: 3,
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && images.length <= 10 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 3,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => onNavigate(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor:
                    index === currentIndex
                      ? 'primary.main'
                      : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      index === currentIndex
                        ? 'primary.main'
                        : 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}