'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  TextField,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout');
      }

      const { checkoutUrl } = await response.json();

      // Show redirecting state, then clear cart and redirect
      setIsRedirecting(true);
      clearCart();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(variantId);
    } else {
      updateQuantity(variantId, newQuantity);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Redirecting Overlay */}
        {isRedirecting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Redirecting to checkout...
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please wait while we take you to complete your order.
            </Typography>
          </Box>
        )}

        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <IconButton onClick={closeCart} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        {cart.items.length === 0 ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              textAlign: 'center',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Add some items to get started!
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {cart.items.map((item) => (
                <ListItem
                  key={item.variantId}
                  sx={{
                    p: 0,
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      p: 2,
                      bgcolor: 'background.default',
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    {/* Product Image */}
                    {item.image && (
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
                          src={item.image}
                          alt={item.productTitle}
                          fill
                          sizes="80px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    )}

                    {/* Product Info */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.productTitle}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {item.variantTitle}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.variantId, parseInt(e.target.value) || 1)
                          }
                          size="small"
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center' },
                          }}
                          sx={{
                            width: 70,
                            '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                              {
                                opacity: 1,
                              },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.variantId)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </ListItem>
              ))}
            </List>

            {/* Footer */}
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              {/* Subtotal */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Subtotal
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>

              {/* Checkout Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </Button>

              {/* Clear Cart Button */}
              <Button
                variant="text"
                fullWidth
                size="small"
                onClick={clearCart}
                sx={{ color: 'text.secondary' }}
              >
                Clear Cart
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
