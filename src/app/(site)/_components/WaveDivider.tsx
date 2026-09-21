'use client';

import React from 'react';
import { Box } from '@mui/material';

interface WaveDividerProps {
  fromColor: string;
  toColor: string;
  flipY?: boolean;
  height?: number;
}

// Animated wave divider — three layers at different speeds, mirroring the van's wavy stripe motif
export default function WaveDivider({ fromColor, toColor, flipY = false, height = 80 }: WaveDividerProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height,
        backgroundColor: fromColor,
        overflow: 'hidden',
        flexShrink: 0,
        ...(flipY && { transform: 'scaleY(-1)' }),

        '@keyframes waveSlowL': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        '@keyframes waveMedL': {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(-60%)' },
        },
        '@keyframes waveFastR': {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(30%)' },
        },
      }}
    >
      {/* Layer 1 — slowest, most prominent */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: 'waveSlowL 9s linear infinite',
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d={`M0,40 C120,70 240,10 360,40 C480,70 600,10 720,40 C840,70 960,10 1080,40 C1200,70 1320,10 1440,40 L1440,80 L0,80 Z`}
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
            d={`M0,40 C120,70 240,10 360,40 C480,70 600,10 720,40 C840,70 960,10 1080,40 C1200,70 1320,10 1440,40 L1440,80 L0,80 Z`}
            fill={toColor}
          />
        </svg>
      </Box>

      {/* Layer 2 — medium speed, slightly offset, partial opacity */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '70%',
          animation: 'waveMedL 6s linear infinite',
          opacity: 0.45,
        }}
      >
        <svg
          viewBox="0 0 1440 56"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d={`M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z`}
            fill={toColor}
          />
        </svg>
        <svg
          viewBox="0 0 1440 56"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d={`M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z`}
            fill={toColor}
          />
        </svg>
      </Box>

      {/* Layer 3 — fastest, thinnest, counters direction slightly */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '-30%',
          width: '200%',
          height: '45%',
          animation: 'waveFastR 4s linear infinite',
          opacity: 0.2,
        }}
      >
        <svg
          viewBox="0 0 1440 36"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d={`M0,18 C90,36 180,0 360,18 C540,36 720,0 900,18 C1080,36 1260,0 1440,18 L1440,36 L0,36 Z`}
            fill={toColor}
          />
        </svg>
        <svg
          viewBox="0 0 1440 36"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '50%', height: '100%', float: 'left' }}
        >
          <path
            d={`M0,18 C90,36 180,0 360,18 C540,36 720,0 900,18 C1080,36 1260,0 1440,18 L1440,36 L0,36 Z`}
            fill={toColor}
          />
        </svg>
      </Box>
    </Box>
  );
}
