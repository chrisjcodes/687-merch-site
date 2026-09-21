'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopRootLayout({ children }: ShopLayoutProps) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
