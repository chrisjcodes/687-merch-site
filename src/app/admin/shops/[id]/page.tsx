import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ShopForm from '../_components/ShopForm';

export const dynamic = 'force-dynamic';

interface EditShopPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShopPage({ params }: EditShopPageProps) {
  const { id } = await params;

  const shop = await prisma.dropShop.findUnique({
    where: { id },
  });

  if (!shop) {
    notFound();
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Edit Shop
      </Typography>
      <ShopForm
        initialData={{
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          themeColor: shop.themeColor,
          themeMode: (shop.themeMode as 'light' | 'dark') || 'light',
          shopifyCollectionId: shop.shopifyCollectionId,
          isLive: shop.isLive,
          activationMode: (shop.activationMode as 'manual' | 'scheduled') || 'manual',
          activeUntil: shop.activeUntil ? shop.activeUntil.toISOString().split('T')[0] : null,
          logoUrl: shop.logoUrl || '',
        }}
        isEdit
      />
    </Box>
  );
}
