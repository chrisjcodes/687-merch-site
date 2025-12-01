import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getProduct } from '@/lib/shopify';
import { createShopTheme } from '@/lib/createShopTheme';
import ShopLayout from '../../_components/ShopLayout';
import ShopHeader from '../../_components/ShopHeader';
import ProductDetail from './_components/ProductDetail';

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

  // Decode base64 product ID
  let decodedProductId: string;
  try {
    decodedProductId = atob(productId);
  } catch {
    notFound();
  }

  // Fetch product from Shopify
  let product;
  try {
    product = await getProduct(decodedProductId);
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const theme = createShopTheme(shop.themeColor);

  return (
    <ShopLayout theme={theme}>
      <ShopHeader shop={shop} />
      <ProductDetail product={product} shopSlug={slug} />
    </ShopLayout>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug, productId } = await params;

  try {
    const decodedProductId = atob(productId);
    const product = await getProduct(decodedProductId);

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
