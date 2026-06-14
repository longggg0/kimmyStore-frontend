import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '@/types/Product';

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = 'kimmy_wishlist';

function loadWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist, totalItems }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}