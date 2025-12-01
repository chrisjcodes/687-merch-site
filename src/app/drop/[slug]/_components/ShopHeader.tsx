'use client';

import { AppBar, Toolbar, Typography, Container, Badge, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';

interface ShopHeaderProps {
  shop: {
    name: string;
    logoUrl: string | null;
    themeColor: string;
  };
}

export default function ShopHeader({ shop }: ShopHeaderProps) {
  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {shop.logoUrl && (
              <Image
                src={shop.logoUrl}
                alt={shop.name}
                width={48}
                height={48}
                style={{ borderRadius: 8 }}
              />
            )}
            <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
              {shop.name}
            </Typography>
          </Box>

          <IconButton color="inherit" size="large">
            <Badge badgeContent={0} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
