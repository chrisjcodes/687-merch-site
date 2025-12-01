import { notFound, redirect } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import { prisma } from '@/lib/prisma';
import { getCollectionProducts } from '@/lib/shopify';
import ProductGrid from './_components/ProductGrid';
import ShopClosed from './_components/ShopClosed';
import ShopLayout from './_components/ShopLayout';
import { ThemeMode } from '@/lib/createShopTheme';

export const dynamic = 'force-dynamic';

interface DropShopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DropShopPage({ params }: DropShopPageProps) {
  const { slug } = await params;

  const shop = await prisma.dropShop.findUnique({
    where: { slug },
  });

  if (!shop) {
    notFound();
  }

  const themeMode = (shop.themeMode as ThemeMode) || 'light';

  if (!shop.isLive) {
    return (
      <ShopLayout themeColor={shop.themeColor} themeMode={themeMode} showHeader={false}>
        <ShopClosed shopName={shop.name} />
      </ShopLayout>
    );
  }

  const products = await getCollectionProducts(shop.shopifyCollectionId);

  // If there's only 1 product, redirect directly to the product page
  if (products.length === 1) {
    const productId = Buffer.from(products[0].id).toString('base64');
    redirect(`/shop/${slug}/products/${productId}`);
  }

  return (
    <ShopLayout themeColor={shop.themeColor} themeMode={themeMode} shop={shop}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              No products available at this time.
            </Typography>
          </Box>
        ) : (
          <ProductGrid products={products} shopSlug={slug} />
        )}
      </Container>
    </ShopLayout>
  );
}

export async function generateMetadata({ params }: DropShopPageProps) {
  const { slug } = await params;

  const shop = await prisma.dropShop.findUnique({
    where: { slug },
  });

  if (!shop) {
    return {
      title: 'Shop Not Found',
    };
  }

  return {
    title: `${shop.name} | 687 Merch`,
    description: `Shop ${shop.name} - Custom merchandise and branded products`,
  };
}
