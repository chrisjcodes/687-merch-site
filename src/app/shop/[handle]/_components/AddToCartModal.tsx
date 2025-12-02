'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';

interface AddToCartModalProps {
  open: boolean;
  onClose: () => void;
  product: ShopifyProduct;
  shopSlug: string;
}

// Common size order for sorting
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'XXL', 'XXXL'];

function sortSizes(values: string[]): string[] {
  return [...values].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.toUpperCase());
    const bIndex = SIZE_ORDER.indexOf(b.toUpperCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
}

export default function AddToCartModal({ open, onClose, product, shopSlug }: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Reset selected options when modal opens with new product
  useEffect(() => {
    if (open && product.options) {
      const initial: Record<string, string> = {};
      product.options.forEach((option) => {
        if (option.values.length > 0) {
          // For size options, default to M if available, otherwise first
          if (option.name.toLowerCase() === 'size') {
            const sortedValues = sortSizes(option.values);
            const defaultSize = sortedValues.find(v => v.toUpperCase() === 'M') || sortedValues[0];
            initial[option.name] = defaultSize;
          } else {
            initial[option.name] = option.values[0];
          }
        }
      });
      setSelectedOptions(initial);
    }
  }, [open, product]);

  const images = product.images.edges.map((edge) => edge.node);
  const primaryImage = images[0];

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    if (!product.options || product.options.length === 0) {
      // No options, return first variant
      return product.variants.edges[0]?.node;
    }
    return product.variants.edges.find((edge) => {
      return edge.node.selectedOptions.every((option) => {
        return selectedOptions[option.name] === option.value;
      });
    })?.node;
  }, [product.variants.edges, product.options, selectedOptions]);

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const handleOptionChange = (optionName: string, value: string | null) => {
    if (value) {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionName]: value,
      }));
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price.amount,
      image: primaryImage?.url || null,
    });

    onClose();
  };

  // Encode product ID for detail page link
  const encodedProductId = typeof window !== 'undefined'
    ? btoa(product.id)
    : Buffer.from(product.id).toString('base64');

  // Determine if an option should use toggle buttons (good for sizes) or dropdown
  const shouldUseToggle = (option: { name: string; values: string[] }) => {
    const name = option.name.toLowerCase();
    // Use toggle buttons for size when there are 8 or fewer options
    return name === 'size' && option.values.length <= 8;
  };

  // Check if a specific option value is available (has at least one variant in stock)
  const isOptionValueAvailable = (optionName: string, value: string) => {
    return product.variants.edges.some((edge) => {
      const variant = edge.node;
      const hasOption = variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === value
      );
      // Check if this value is available with current other selections
      const matchesOtherSelections = variant.selectedOptions.every((opt) => {
        if (opt.name === optionName) return true;
        return selectedOptions[opt.name] === opt.value || !selectedOptions[opt.name];
      });
      return hasOption && matchesOtherSelections && variant.availableForSale;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Product Info Header */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {/* Product Image */}
          {primaryImage && (
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: '#000',
              }}
            >
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.title}
                fill
                sizes="80px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}

          {/* Product Title & Link */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
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
            <Link
              href={`/shop/${shopSlug}/products/${encodedProductId}`}
              sx={{
                color: 'primary.main',
                fontSize: '0.875rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              See all item details
            </Link>
          </Box>
        </Box>

        {/* Variant Selectors */}
        {product.options?.map((option) => {
          const isSize = option.name.toLowerCase() === 'size';
          const sortedValues = isSize ? sortSizes(option.values) : option.values;

          if (shouldUseToggle(option)) {
            // Toggle button group for sizes
            return (
              <Box key={option.id} sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  {option.name}
                </Typography>
                <ToggleButtonGroup
                  value={selectedOptions[option.name] || ''}
                  exclusive
                  onChange={(_, value) => handleOptionChange(option.name, value)}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    '& .MuiToggleButton-root': {
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: '8px !important',
                      px: 2,
                      py: 0.75,
                      minWidth: 48,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      },
                      '&.Mui-disabled': {
                        opacity: 0.4,
                        textDecoration: 'line-through',
                      },
                    },
                  }}
                >
                  {sortedValues.map((value) => (
                    <ToggleButton
                      key={value}
                      value={value}
                      disabled={!isOptionValueAvailable(option.name, value)}
                    >
                      {value}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            );
          }

          // Dropdown for color and other options
          return (
            <FormControl key={option.id} fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>{option.name}</InputLabel>
              <Select
                value={selectedOptions[option.name] || ''}
                label={option.name}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
              >
                {sortedValues.map((value) => (
                  <MenuItem
                    key={value}
                    value={value}
                    disabled={!isOptionValueAvailable(option.name, value)}
                  >
                    {value}
                    {!isOptionValueAvailable(option.name, value) && ' (Out of Stock)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}

        {/* Price */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ${currentPrice.toFixed(2)}
          </Typography>
        </Box>

        {/* Availability */}
        {selectedVariant && !selectedVariant.availableForSale && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'error.main',
              fontWeight: 600,
            }}
          >
            Out of Stock
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          sx={{ flex: 1, fontWeight: 600 }}
        >
          Add to cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
