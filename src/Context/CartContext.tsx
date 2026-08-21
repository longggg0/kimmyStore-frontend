import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/Product';
import type { ProductVariant } from '@/types/ProductVariant';
import { useAuth } from './AuthContext';

export interface CartItem {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant | null) => void;
  removeFromCart: (productId: number, variantId?: number | null) => void;
  updateQty: (productId: number, quantity: number, variantId?: number | null) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function getCartKey(userId: string | number | undefined) {
  return userId ? `kimmy_cart_${userId}` : 'kimmy_cart_guest';
}

function sameLine(item: CartItem, productId: number, variantId?: number | null) {
  const itemVariantId = item.variant?.id ?? null;
  const targetVariantId = variantId ?? null;
  return item.product.id === productId && itemVariantId === targetVariantId;
}

function stockFor(item: CartItem): number {
  return item.variant ? item.variant.qty : item.product.qty;
}

function loadCart(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function mergeCarts(userItems: CartItem[], guestItems: CartItem[]): CartItem[] {
  const merged = [...userItems];

  guestItems.forEach((guestItem) => {
    const existing = merged.find((i) =>
      sameLine(i, guestItem.product.id, guestItem.variant?.id ?? null)
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  });

  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const cartKey = getCartKey(user?.id);

  const [items, setItems] = useState<CartItem[]>(() => loadCart(cartKey));

  useEffect(() => {
    if (user) {
      const guestKey = getCartKey(undefined);
      const guestItems = loadCart(guestKey);
      const userItems = loadCart(cartKey);

      if (guestItems.length > 0) {
        const merged = mergeCarts(userItems, guestItems);
        setItems(merged);
        localStorage.setItem(cartKey, JSON.stringify(merged));
        localStorage.removeItem(guestKey);
      } else {
        setItems(userItems);
      }
    } else {
      setItems(loadCart(cartKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, user]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addToCart = useCallback((product: Product, variant?: ProductVariant | null) => {
    const stock = variant ? variant.qty : product.qty;

    if (stock <= 0) {
      toast.error('This product is out of stock.');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, variant?.id ?? null));

      if (existing) {
        if (existing.quantity + 1 > stock) {
          toast.error(`Only ${stock} in stock. You already have ${existing.quantity} in your cart.`);
          return prev;
        }
        return prev.map((i) =>
          sameLine(i, product.id, variant?.id ?? null)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { product, variant: variant ?? null, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, variantId?: number | null) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, variantId ?? null)));
  }, []);

  const updateQty = useCallback((productId: number, quantity: number, variantId?: number | null) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !sameLine(i, productId, variantId ?? null)));
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (!sameLine(i, productId, variantId ?? null)) return i;

        const stock = stockFor(i);
        if (quantity > stock) {
          toast.error(`Only ${stock} in stock for ${i.product.name}.`);
          return { ...i, quantity: stock };
        }

        return { ...i, quantity };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = i.variant ? parseFloat(i.variant.price) : parseFloat(String(i.product.price));
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}