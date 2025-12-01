import { notFound, redirect } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import { prisma } from '@/lib/prisma';
import { getCollectionProducts } from '@/lib/shopify';
import ProductGrid from './_components/ProductGrid';
import ShopClosed from './_components/ShopClosed';
import ShopLayout from './_components/ShopLayout';
import { ThemeMode } from '@/lib/createShopTheme';

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
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
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
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

export async function generateMetadata({ params }: ShopPageProps) {
  const { slug } = await params;

  const shop = await prisma.dropShop.findUnique({
    where: { slug },
  });

  if (!shop) {
    return {
      title: 'Shop Not Found',
    };
  }

  const title = `${shop.name} | Official Shop`;
  const description = `Shop exclusive merchandise from ${shop.name}`;
  const url = `${process.env.NEXTAUTH_URL || 'https://687merch.com'}/shop/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: shop.name,
      type: 'website',
      ...(shop.logoUrl && {
        images: [
          {
            url: shop.logoUrl,
            width: 800,
            height: 600,
            alt: shop.name,
          },
        ],
      }),
    },
    twitter: {
      card: shop.logoUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(shop.logoUrl && { images: [shop.logoUrl] }),
    },
  };
}
