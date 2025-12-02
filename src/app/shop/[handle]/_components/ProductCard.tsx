'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';
import AddToCartModal from './AddToCartModal';

interface ProductCardProps {
  product: ShopifyProduct;
  shopSlug: string;
}

export default function ProductCard({ product, shopSlug }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleOpenModal}
        sx={{
          cursor: 'pointer',
          '&:hover img': {
            opacity: 0.9,
          },
        }}
      >
        {/* Product Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%', // 1:1 aspect ratio
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 1.5,
          }}
        >
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transition: 'opacity 0.2s ease',
              }}
            />
          )}
        </Box>

        {/* Product Info */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            color: 'text.primary',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
          }}
        >
          ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
        </Typography>
      </Box>

      <AddToCartModal
        open={modalOpen}
        onClose={handleCloseModal}
        product={product}
        shopSlug={shopSlug}
      />
    </>
  );
}
