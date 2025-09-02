'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import marketingTheme from './marketing-theme';
import "./globals.css";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={marketingTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
