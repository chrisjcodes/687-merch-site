import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import { prisma } from '@/lib/prisma';
import { getCollectionProducts } from '@/lib/shopify';
import ProductGrid from './_components/ProductGrid';
import ShopHeader from './_components/ShopHeader';
import ShopClosed from './_components/ShopClosed';
import ShopLayout from './_components/ShopLayout';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createShopTheme } from '@/lib/createShopTheme';

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

  const theme = createShopTheme(shop.themeColor);

  if (!shop.isLive) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ShopClosed shopName={shop.name} />
      </ThemeProvider>
    );
  }

  const products = await getCollectionProducts(shop.shopifyCollectionId);

  return (
    <ShopLayout theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <ShopHeader shop={shop} />
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
      </Box>
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
