import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getProduct } from '@/lib/shopify';
import ShopLayout from '../../_components/ShopLayout';
import ProductDetail from './_components/ProductDetail';
import { ThemeMode } from '@/lib/createShopTheme';

interface ProductPageProps {
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, productId } = await params;

  // Fetch shop from database
  const shop = await prisma.dropShop.findUnique({
    where: { slug },
  });

  if (!shop) {
    notFound();
  }

  // Decode base64 product ID (URL-decode first, then base64 decode)
  let decodedProductId: string;
  try {
    const urlDecodedProductId = decodeURIComponent(productId);
    decodedProductId = Buffer.from(urlDecodedProductId, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding product ID:', error);
    notFound();
  }

  // Fetch product from Shopify
  const product = await getProduct(decodedProductId);

  if (!product) {
    notFound();
  }

  const themeMode = (shop.themeMode as ThemeMode) || 'light';

  return (
    <ShopLayout themeColor={shop.themeColor} themeMode={themeMode} shop={shop}>
      <ProductDetail product={product} shopSlug={slug} />
    </ShopLayout>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug, productId } = await params;

  try {
    const urlDecodedProductId = decodeURIComponent(productId);
    const decodedProductId = Buffer.from(urlDecodedProductId, 'base64').toString('utf-8');
    const product = await getProduct(decodedProductId);

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: `${product.title} - ${slug}`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}
