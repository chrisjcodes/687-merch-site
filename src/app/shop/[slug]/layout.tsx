'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

interface DropShopLayoutProps {
  children: ReactNode;
}

export default function DropShopLayout({ children }: DropShopLayoutProps) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
