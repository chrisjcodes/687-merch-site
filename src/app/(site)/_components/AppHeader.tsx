'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  useScrollTrigger,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Work',    href: '/#work' },
  { label: 'FAQ',     href: '/faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    setScrolled(trigger);
  }, [trigger]);

  const isHome = pathname === '/';

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (isHome && href.startsWith('/#')) {
      const id = href.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled
          ? 'rgba(15, 15, 15, 0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'block', lineHeight: 0 }}>
              <Image
                src="/images/687-logo-white.svg"
                alt="687 Merch"
                width={144}
                height={48}
                style={{ width: 'auto', height: 'clamp(24px, 4vw, 42px)', maxWidth: '100%' }}
                priority
              />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {NAV_ITEMS.map(({ label, href }) => (
              <Button
                key={label}
                color="inherit"
                component={Link}
                href={href}
                onClick={() => handleNavClick(href)}
                sx={{
                  fontWeight: pathname === href || (href === '/faq' && pathname === '/faq') ? 700 : 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: href === '/faq' && pathname === '/faq' ? 'primary.main' : 'inherit',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Mobile Hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              sx={{ width: 48, height: 48, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 250, backgroundColor: '#0f0f0f', color: 'white' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <IconButton color="inherit" onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List disablePadding>
            {NAV_ITEMS.map(({ label, href }) => (
              <ListItem
                key={label}
                component={Link}
                href={href}
                onClick={() => handleNavClick(href)}
                sx={{ cursor: 'pointer', minHeight: 52, '&:hover': { backgroundColor: 'rgba(255,255,255,0.07)' } }}
              >
                <ListItemText
                  primary={label.toUpperCase()}
                  sx={{ '& .MuiTypography-root': { fontWeight: 600, letterSpacing: '0.05em', fontSize: '0.9rem' } }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: '#1e1e1e', my: 2 }} />

          <Box sx={{ px: 1 }}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href="/#contact"
              onClick={() => handleNavClick('/#contact')}
              sx={{
                backgroundColor: '#f2bf00',
                color: '#000',
                fontWeight: 700,
                py: 1.5,
                '&:hover': { backgroundColor: '#e0b000' },
              }}
            >
              Get a Quote
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
