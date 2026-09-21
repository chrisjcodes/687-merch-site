import { Box } from '@mui/material';
import { ShopifyProduct } from '@/lib/shopify';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ShopifyProduct[];
  shopSlug: string;
}

// Get optimized grid layout based on product count
function getGridLayout(count: number) {
  switch (count) {
    case 2:
      // 2 products: 2 columns centered
      return {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        },
        maxWidth: 700,
      };
    case 3:
      // 3 products: 3 columns
      return {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        maxWidth: 900,
      };
    case 4:
      // 4 products: 2x2 or 4 columns
      return {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        maxWidth: 1000,
      };
    case 5:
    case 6:
      // 5-6 products: 3 columns
      return {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        maxWidth: 1000,
      };
    default:
      // 7+ products: full 4 column grid
      return {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        maxWidth: undefined,
      };
  }
}

export default function ProductGrid({ products, shopSlug }: ProductGridProps) {
  const layout = getGridLayout(products.length);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: layout.gridTemplateColumns,
        gap: { xs: 2, sm: 3, md: 4 },
        maxWidth: layout.maxWidth,
        mx: 'auto',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} shopSlug={shopSlug} />
      ))}
    </Box>
  );
}
