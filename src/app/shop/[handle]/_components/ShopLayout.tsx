'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import Image from 'next/image';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';
import ShopHeader from './ShopHeader';
import { createShopTheme, ThemeMode } from '@/lib/createShopTheme';

interface ShopLayoutProps {
  children: ReactNode;
  themeColor: string;
  themeMode?: ThemeMode;
  shop?: {
    name: string;
    logoUrl: string | null;
  };
  showHeader?: boolean;
  batchingMessage?: string | null;
}

export default function ShopLayout({
  children,
  themeColor,
  themeMode = 'light',
  shop,
  showHeader = true,
  batchingMessage,
}: ShopLayoutProps) {
  const theme = useMemo(() => createShopTheme(themeColor, themeMode), [themeColor, themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
          }}
        >
          {showHeader && shop && <ShopHeader shop={shop} />}
          <Box sx={{ flex: 1 }}>{children}</Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            {batchingMessage && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  px: 2,
                  maxWidth: 600,
                  mx: 'auto',
                  whiteSpace: 'pre-line',
                }}
              >
                {batchingMessage}
              </Typography>
            )}
            <Box
              component="a"
              href="https://687merch.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Powered by
              </Typography>
              <Image
                src="/687-logo.png"
                alt="687 Merch"
                width={80}
                height={24}
                style={{
                  height: 'auto',
                  width: 'auto',
                  maxHeight: 24,
                  filter: themeMode === 'light' ? 'invert(1)' : 'none',
                }}
              />
            </Box>
          </Box>
        </Box>
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  );
}
