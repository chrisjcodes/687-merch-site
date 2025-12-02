'use client';

import { Box, IconButton, Badge, Container } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface ShopHeaderProps {
  shop: {
    name: string;
    logoUrl: string | null;
  };
}

export default function ShopHeader({ shop }: ShopHeaderProps) {
  const { cartItemCount, toggleCart } = useCart();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        {/* Logo / Shop Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt={shop.name}
              width={200}
              height={60}
              style={{
                height: 'auto',
                maxHeight: 60,
                width: 'auto',
                maxWidth: 240,
                objectFit: 'contain',
              }}
              priority
            />
          ) : (
            <Box
              component="span"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                textTransform: 'uppercase',
              }}
            >
              {shop.name}
            </Box>
          )}
        </Box>

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={toggleCart}
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Badge
              badgeContent={cartItemCount}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
