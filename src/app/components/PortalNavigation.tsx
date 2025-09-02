'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { LogoutOutlined, AccountCircle, AdminPanelSettings, Business } from '@mui/icons-material';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function PortalNavigation() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    signOut({ callbackUrl: '/' });
  };

  const isAdmin = session?.user?.role === 'ADMIN';
  const isCustomer = session?.user?.role === 'CUSTOMER';

  return (
    <AppBar position="static" elevation={0} sx={{ 
      bgcolor: isAdmin ? '#732d6a' : '#000000', // plum for admin, black for customer
      borderRadius: 0,
      '& .MuiAppBar-root': {
        borderRadius: 0
      }
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href={isAdmin ? '/admin/jobs' : '/portal/orders'} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Image 
                src="/687-logo.png"
                alt="687 Merch"
                width={120}
                height={40}
                style={{ objectFit: 'contain' }}
              />
              <Box>
                <Typography variant="body1" sx={{ color: 'white', lineHeight: 1, ml: 1, fontWeight: 700 }}>
                  {isAdmin ? 'Admin Portal' : 'Customer Portal'}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Box>

        {/* User Menu */}
        {session && (
          <Box>
            <Button
              onClick={handleClick}
              variant="outlined"
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                {session.user.email}
              </Typography>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {session.user.email}
                </Typography>
              </Box>
              <Divider />
              {isAdmin && (
                <MenuItem component={Link} href="/admin/jobs">
                  <AdminPanelSettings fontSize="small" sx={{ mr: 2 }} />
                  Admin Dashboard
                </MenuItem>
              )}
              {isCustomer && (
                <MenuItem component={Link} href="/portal/orders">
                  <Business fontSize="small" sx={{ mr: 2 }} />
                  My Orders
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutOutlined fontSize="small" sx={{ mr: 2 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}