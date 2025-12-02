import { notFound } from 'next/navigation';
import { getCollectionByHandle, getProduct, parseCollectionMetafields } from '@/lib/shopify';
import ShopLayout from '../../_components/ShopLayout';
import ProductDetail from './_components/ProductDetail';
import { ThemeMode } from '@/lib/createShopTheme';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    handle: string;
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle, productId } = await params;

  // Fetch collection from Shopify
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const metafields = parseCollectionMetafields(collection);
  const themeMode: ThemeMode = metafields.themeMode || 'light';
  const themeColor = metafields.themeColor || '#f2bf00';

  const shop = {
    name: collection.title,
    logoUrl: collection.image?.url || null,
  };

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

  return (
    <ShopLayout
      themeColor={themeColor}
      themeMode={themeMode}
      shop={shop}
      batchingMessage={metafields.batchingMessage}
    >
      <ProductDetail product={product} shopSlug={handle} />
    </ShopLayout>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle, productId } = await params;

  try {
    const urlDecodedProductId = decodeURIComponent(productId);
    const decodedProductId = Buffer.from(urlDecodedProductId, 'base64').toString('utf-8');

    const [product, collection] = await Promise.all([
      getProduct(decodedProductId),
      getCollectionByHandle(handle),
    ]);

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    const shopName = collection?.title || handle;
    const title = `${product.title} | ${shopName} Official Shop`;
    const description = product.description || `Shop ${product.title} from ${shopName}`;
    const url = `${process.env.NEXTAUTH_URL || 'https://687merch.com'}/shop/${handle}/products/${productId}`;
    const productImage = product.images?.edges?.[0]?.node?.url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: shopName,
        type: 'website',
        ...(productImage && {
          images: [
            {
              url: productImage,
              width: 800,
              height: 800,
              alt: product.title,
            },
          ],
        }),
      },
      twitter: {
        card: productImage ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(productImage && { images: [productImage] }),
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}
