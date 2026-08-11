import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/Product';
import { useAuth } from './AuthContext'; // 👈 adjust path to wherever your AuthContext lives

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function getCartKey(userId: string | number | undefined) {
  return userId ? `kimmy_cart_${userId}` : 'kimmy_cart_guest';
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
    const existing = merged.find((i) => i.product.id === guestItem.product.id);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  });

  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // 👈 cart knows who's logged in
  const cartKey = getCartKey(user?.id);

  const [items, setItems] = useState<CartItem[]>(() => loadCart(cartKey));

  // Whenever the logged-in user changes (login/logout/switch account),
  // load the correct cart AND merge in any leftover guest cart on login.
  useEffect(() => {
    if (user) {
      // Logged in: check for a leftover guest cart and merge it in
      const guestKey = getCartKey(undefined);
      const guestItems = loadCart(guestKey);
      const userItems = loadCart(cartKey);

      if (guestItems.length > 0) {
        const merged = mergeCarts(userItems, guestItems);
        setItems(merged);
        localStorage.setItem(cartKey, JSON.stringify(merged));
        localStorage.removeItem(guestKey); // clear guest cart once merged in
      } else {
        setItems(userItems);
      }
    } else {
      // Logged out / guest: just load the guest cart
      setItems(loadCart(cartKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, user]);

  // Persist to localStorage under the current cart's key only
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addToCart = useCallback((product: Product) => {
    if (product.qty <= 0) {
      toast.error('This product is out of stock.');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.qty) {
          toast.error(`Only ${product.qty} in stock. You already have ${existing.quantity} in your cart.`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;

        if (quantity > i.product.qty) {
          toast.error(`Only ${i.product.qty} in stock for ${i.product.name}.`);
          return { ...i, quantity: i.product.qty }; // clamp to max available
        }

        return { ...i, quantity };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(String(i.product.price)) * i.quantity,
    0
  );

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