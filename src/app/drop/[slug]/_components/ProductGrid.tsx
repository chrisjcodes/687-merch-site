import { Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { ShopifyProduct } from '@/lib/shopify';
import Image from 'next/image';

interface ProductGridProps {
  products: ShopifyProduct[];
  shopSlug: string;
}

export default function ProductGrid({ products, shopSlug }: ProductGridProps) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const image = product.images.edges[0]?.node;
        const price = product.priceRange.minVariantPrice;

        return (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {image && (
                <CardMedia
                  sx={{
                    position: 'relative',
                    paddingTop: '100%', // 1:1 aspect ratio
                    bgcolor: '#000',
                  }}
                >
                  <Box
                    component={Image}
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </CardMedia>
              )}

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    mb: 1,
                    fontSize: '1rem',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.title}
                </Typography>

                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
                  ${parseFloat(price.amount).toFixed(2)}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  href={`/drop/${shopSlug}/products/${btoa(product.id)}`}
                  sx={{
                    mt: 'auto',
                    bgcolor: 'primary.main',
                    color: product.id.includes('dark') ? '#fff' : '#000',
                    fontWeight: 700,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  View Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
