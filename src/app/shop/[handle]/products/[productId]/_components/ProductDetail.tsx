'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ProductDetailProps {
  product: ShopifyProduct;
  shopSlug: string;
}

export default function ProductDetail({ product, shopSlug }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with first available option for each
    const initial: Record<string, string> = {};
    product.options?.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.name] = option.values[0];
      }
    });
    return initial;
  });

  const images = product.images.edges.map((edge) => edge.node);

  // Find the variant that matches selected options
  const selectedVariant = product.variants.edges.find((edge) => {
    return edge.node.selectedOptions.every((option) => {
      return selectedOptions[option.name] === option.value;
    });
  })?.node;

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select all options');
      return;
    }

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price.amount,
      image: images[0]?.url || null,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          <Link
            href={`/shop/${shopSlug}`}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            Shop
          </Link>
          <Typography color="text.primary">{product.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {images.length > 0 && (
                <>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '100%', // 1:1 aspect ratio
                    }}
                  >
                    <Image
                      src={images[selectedImageIndex].url}
                      alt={images[selectedImageIndex].altText || product.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </Box>

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImage}
                        sx={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      <IconButton
                        onClick={nextImage}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>

                      {/* Image Indicators */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        {images.map((_, index) => (
                          <Box
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: index === selectedImageIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                bgcolor: index === selectedImageIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </>
              )}
            </Paper>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: 2,
                      borderColor: index === selectedImageIndex ? 'primary.main' : 'transparent',
                      transition: 'border-color 0.2s',
                      '&:hover': {
                        borderColor: index === selectedImageIndex ? 'primary.main' : 'text.secondary',
                      },
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `Product image ${index + 1}`}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {product.title}
              </Typography>

              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, mb: 3 }}>
                ${currentPrice.toFixed(2)}
              </Typography>

              {/* Description - prefer plain text, fallback to HTML */}
              {product.description && !product.descriptionHtml && (
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                  {product.description}
                </Typography>
              )}
              {product.descriptionHtml && (
                <Box
                  sx={{
                    mb: 4,
                    color: 'text.secondary',
                    '& p': {
                      mb: 2,
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}

              {/* Variant Selectors */}
              <Box sx={{ mb: 4 }}>
                {product.options?.map((option) => (
                  <FormControl key={option.id} fullWidth sx={{ mb: 2 }}>
                    <InputLabel>{option.name}</InputLabel>
                    <Select
                      value={selectedOptions[option.name] || ''}
                      label={option.name}
                      onChange={(e) => handleOptionChange(option.name, e.target.value)}
                    >
                      {option.values.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </Box>

              {/* Availability */}
              {selectedVariant && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: selectedVariant.availableForSale ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
                </Typography>
              )}

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
