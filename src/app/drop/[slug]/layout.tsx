'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

interface DropShopLayoutProps {
  children: ReactNode;
  params: { shopTheme?: any };
}

export default function DropShopLayout({ children }: DropShopLayoutProps) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
