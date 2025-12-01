'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';

interface ShopLayoutProps {
  children: ReactNode;
  theme: Theme;
}

export default function ShopLayout({ children, theme }: ShopLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  );
}
