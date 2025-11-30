import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DropShopForm from '../_components/DropShopForm';

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
        Edit Drop Shop
      </Typography>
      <DropShopForm
        initialData={{
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          themeColor: shop.themeColor,
          shopifyCollectionId: shop.shopifyCollectionId,
          isLive: shop.isLive,
          logoUrl: shop.logoUrl || '',
        }}
        isEdit
      />
    </Box>
  );
}
