'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Cart,
  CartItem,
  getCart,
  addToCart as addToCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  removeFromCart as removeFromCartUtil,
  clearCart as clearCartUtil,
  getCartTotal,
  getCartItemCount,
} from '@/lib/cart';

interface CartContextType {
  cart: Cart;
  cartItemCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart());
    setMounted(true);
  }, []);

  const cartItemCount = getCartItemCount(cart);
  const cartTotal = getCartTotal(cart);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const updatedCart = addToCartUtil(item, quantity);
    setCart(updatedCart);
    openCart(); // Automatically open cart when item is added
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantityUtil(variantId, quantity);
    setCart(updatedCart);
  };

  const removeItem = (variantId: string) => {
    const updatedCart = removeFromCartUtil(variantId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    clearCartUtil();
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemCount: mounted ? cartItemCount : 0,
        cartTotal: mounted ? cartTotal : 0,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
