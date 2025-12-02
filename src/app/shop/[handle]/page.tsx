import { notFound, redirect } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';
import { getCollectionByHandle, parseCollectionMetafields } from '@/lib/shopify';
import { getShopStatus } from '@/lib/shopStatus';
import ProductGrid from './_components/ProductGrid';
import ShopClosed from './_components/ShopClosed';
import ShopUpcoming from './_components/ShopUpcoming';
import ShopLayout from './_components/ShopLayout';
import { ThemeMode } from '@/lib/createShopTheme';

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { handle } = await params;

  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const metafields = parseCollectionMetafields(collection);
  const status = getShopStatus(metafields);
  const themeMode: ThemeMode = metafields.themeMode || 'light';
  const themeColor = metafields.themeColor || '#f2bf00';

  const shop = {
    name: collection.title,
    logoUrl: collection.image?.url || null,
  };

  if (status === 'closed') {
    return (
      <ShopLayout themeColor={themeColor} themeMode={themeMode} showHeader={false}>
        <ShopClosed shopName={collection.title} closedAt={metafields.orderWindowEnd} />
      </ShopLayout>
    );
  }

  if (status === 'upcoming') {
    return (
      <ShopLayout themeColor={themeColor} themeMode={themeMode} showHeader={false}>
        <ShopUpcoming shopName={collection.title} opensAt={metafields.orderWindowStart!} />
      </ShopLayout>
    );
  }

  const products = collection.products.edges.map((edge) => edge.node);

  // If there's only 1 product, redirect directly to the product page
  if (products.length === 1) {
    const productId = Buffer.from(products[0].id).toString('base64');
    redirect(`/shop/${handle}/products/${productId}`);
  }

  return (
    <ShopLayout
      themeColor={themeColor}
      themeMode={themeMode}
      shop={shop}
      batchingMessage={metafields.batchingMessage}
    >
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              No products available at this time.
            </Typography>
          </Box>
        ) : (
          <ProductGrid products={products} shopSlug={handle} />
        )}
      </Container>
    </ShopLayout>
  );
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { handle } = await params;

  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: 'Shop Not Found',
    };
  }

  const title = `${collection.title} | Official Shop`;
  const description = collection.description || `Shop exclusive merchandise from ${collection.title}`;
  const url = `${process.env.NEXTAUTH_URL || 'https://687merch.com'}/shop/${handle}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: collection.title,
      type: 'website',
      ...(collection.image && {
        images: [
          {
            url: collection.image.url,
            width: collection.image.width,
            height: collection.image.height,
            alt: collection.title,
          },
        ],
      }),
    },
    twitter: {
      card: collection.image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(collection.image && { images: [collection.image.url] }),
    },
  };
}
