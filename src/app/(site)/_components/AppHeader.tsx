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

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    setScrolled(trigger);
  }, [trigger]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
            {/* White logo on transparent dark nav; black logo when scrolled (nav goes dark) */}
            <Image
              src="/images/687-logo-white.svg"
              alt="687 Merch"
              width={144}
              height={48}
              style={{ width: 'auto', height: '42px', maxWidth: '100%' }}
              priority
            />
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => scrollToSection('services')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Services
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('work')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Case Studies
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('contact')}
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Contact
            </Button>
          </Box>

          {/* Mobile Hamburger Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              sx={{
                width: 48,
                height: 48,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#0f0f0f',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List disablePadding>
            {[
              { label: 'Services',     id: 'services' },
              { label: 'Case Studies', id: 'work' },
              { label: 'Contact',      id: 'contact' },
            ].map(({ label, id }) => (
              <ListItem
                key={id}
                onClick={() => scrollToSection(id)}
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
              onClick={() => scrollToSection('contact')}
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