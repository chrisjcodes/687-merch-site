'use client';

import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface WaveDividerProps {
  fromColor: string;
  toColor: string;
  flipY?: boolean;
  height?: number;
  sx?: SxProps<Theme>;
}

// Animated wave divider — three layers at different speeds, mirroring the van's wavy stripe motif
export default function WaveDivider({ fromColor, toColor, flipY = false, height = 80, sx }: WaveDividerProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height,
        backgroundColor: fromColor,
        overflow: 'hidden',
        flexShrink: 0,
        ...(flipY && { transform: 'scaleY(-1)' }),
        ...sx,

        '@keyframes waveSlide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: 'waveSlide 24s linear infinite',
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d="M0,40 C120,70 240,10 360,40 C480,70 600,10 720,40 C840,70 960,10 1080,40 C1200,70 1320,10 1440,40 L1440,80 L0,80 Z"
            fill={toColor}
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d="M0,40 C120,70 240,10 360,40 C480,70 600,10 720,40 C840,70 960,10 1080,40 C1200,70 1320,10 1440,40 L1440,80 L0,80 Z"
            fill={toColor}
          />
        </svg>
      </Box>
    </Box>
  );
}
