export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  quantity: number;
  image: string | null;
}

export interface Cart {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'shop-cart';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [] };
  }

  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartJson) {
      return { items: [] };
    }
    return JSON.parse(cartJson);
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return { items: [] };
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
  const cart = getCart();

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.variantId === item.variantId
  );

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      ...item,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartItemQuantity(variantId: string, quantity: number): Cart {
  const cart = getCart();

  const itemIndex = cart.items.findIndex((item) => item.variantId === variantId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(variantId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.variantId !== variantId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  const emptyCart: Cart = { items: [] };
  saveCart(emptyCart);
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}
