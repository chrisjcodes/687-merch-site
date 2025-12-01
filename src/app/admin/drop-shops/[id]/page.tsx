import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DropShopForm from '../_components/DropShopForm';

export const dynamic = 'force-dynamic';

interface EditDropShopPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDropShopPage({ params }: EditDropShopPageProps) {
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
      <DropShopForm
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
