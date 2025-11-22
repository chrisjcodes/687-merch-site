import Image from 'next/image';
import { Box, SxProps, Theme } from '@mui/material';

interface LogoProps {
  /** Width of the logo in pixels */
  width?: number;
  /** Height of the logo in pixels - if not provided, calculated from aspect ratio */
  height?: number;
  /** Whether to invert the logo to black */
  inverted?: boolean;
  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
  /** Alt text for the logo */
  alt?: string;
  /** Priority loading for above-the-fold logos */
  priority?: boolean;
}

export function Logo({
  width = 120,
  height,
  inverted = false,
  sx = {},
  alt = '687 Merch',
  priority = false,
}: LogoProps) {
  // Original logo dimensions: 1500 × 382
  // Aspect ratio: 3.927 (width/height)
  const aspectRatio = 1500 / 382;
  
  // Calculate dimensions based on what's provided
  let finalWidth: number;
  let finalHeight: number;
  
  if (height && !width) {
    // Height provided, calculate width
    finalHeight = height;
    finalWidth = Math.round(height * aspectRatio);
  } else if (width && !height) {
    // Width provided, calculate height
    finalWidth = width;
    finalHeight = Math.round(width / aspectRatio);
  } else if (width && height) {
    // Both provided, use as-is
    finalWidth = width;
    finalHeight = height;
  } else {
    // Neither provided, use defaults
    finalWidth = width;
    finalHeight = Math.round(width / aspectRatio);
  }
  return (
    <Box
      sx={{
        display: 'inline-block',
        ...sx,
      }}
    >
      <Image
        src="/images/687-logo.png"
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        style={{
          filter: inverted ? 'invert(1) brightness(0)' : 'none',
          transition: 'filter 0.2s ease-in-out',
          width: height ? 'auto' : finalWidth,
          height: height ? finalHeight : 'auto',
          maxWidth: '100%',
          maxHeight: height ? finalHeight : 'none',
        }}
      />
    </Box>
  );
}

export default Logo;