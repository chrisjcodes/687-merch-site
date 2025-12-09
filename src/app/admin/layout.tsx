'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const drawerWidth = 240;

const navItems = [
  { text: 'Overview', icon: <DashboardIcon />, href: '/admin' },
  { text: 'Shops', icon: <StorefrontIcon />, href: '/admin/shops' },
  { text: 'Reports', icon: <AssessmentIcon />, href: '/admin/reports' },
  { text: 'Batches', icon: <InventoryIcon />, href: '/admin/batches' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Don't show sidebar/navbar on auth pages
  const isAuthPage =
    pathname?.startsWith('/admin/login') ||
    pathname?.startsWith('/admin/error') ||
    pathname?.startsWith('/admin/verify-request');

  if (isAuthPage) {
    return <Box sx={{ minHeight: '100vh', bgcolor: '#0f0f0f' }}>{children}</Box>;
  }

  const drawer = (
    <Box>
      <Box sx={{ px: 2, py: 2.5, textAlign: 'center' }}>
        <Image
          src="/687-logo.png"
          alt="687 Merch"
          width={140}
          height={40}
          style={{ height: 'auto', width: 'auto', maxHeight: 40 }}
        />
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mt: 0.5, fontWeight: 600 }}>
          Shop Admin
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(242, 191, 0, 0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(242, 191, 0, 0.25)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.href ? '#f2bf00' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: pathname === item.href ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => signOut({ callbackUrl: '/' })}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f0f0f' }}>
      {/* Mobile AppBar - only shows hamburger on mobile */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: '#1a1a1a',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Box>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#1a1a1a',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#1a1a1a',
              color: '#fff',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 0 },
          borderTop: 'none',
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
