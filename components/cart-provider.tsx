'use client';

import * as React from 'react';
import type { Product } from '@/lib/products';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderInput {
  items: CartItem[];
  total: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  shipping: {
    name: string;
    phone: string;
    pincode: string;
    address: string;
    city: string;
    state: string;
  };
}

interface CartContextValue {
  items: CartItem[];
  wishlist: Product[];
  isOpen: boolean;
  add: (product: Product, size: string, color: string) => void;
  remove: (id: string, size: string, color: string) => void;
  updateQty: (id: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  saveOrder: (order: OrderInput) => Promise<string>;
  count: number;
  subtotal: number;
  totalSavings: number;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [wishlist, setWishlist] = React.useState<Product[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [cloudReady, setCloudReady] = React.useState(false);

  // Hydrate guest data first so the storefront remains usable before sign-in.
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aura_cart_guest') || localStorage.getItem('aura_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) setItems(parsedCart);
      }

      const savedWishlist = localStorage.getItem('aura_wishlist_guest') || localStorage.getItem('aura_wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist);
      }
    } catch (e) {
      console.warn('Failed to parse local storage data', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Load each authenticated user's private cart and wishlist from Firestore.
  React.useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;
    setCloudReady(false);

    if (!user || !db) {
      setCloudReady(true);
      return () => {
        cancelled = true;
      };
    }

    getDoc(doc(db, 'users', user.id))
      .then((snapshot) => {
        if (cancelled) return;
        const store = snapshot.data()?.store;
        if (Array.isArray(store?.cart)) setItems(store.cart);
        if (Array.isArray(store?.wishlist)) setWishlist(store.wishlist);
        setCloudReady(true);
      })
      .catch((error) => {
        console.warn('Failed to load Firebase shopping data:', error);
        if (!cancelled) setCloudReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user, isHydrated]);

  // Persist guest data locally and authenticated data under the user's UID.
  React.useEffect(() => {
    if (!isHydrated || !cloudReady) return;

    try {
      localStorage.setItem(user ? `aura_cart_${user.id}` : 'aura_cart_guest', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }

    try {
      localStorage.setItem(user ? `aura_wishlist_${user.id}` : 'aura_wishlist_guest', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }

    if (user && db) {
      setDoc(
        doc(db, 'users', user.id),
        { store: { cart: items, wishlist }, updatedAt: serverTimestamp() },
        { merge: true },
      ).catch((error) => {
        console.warn('Failed to save Firebase shopping data:', error);
      });
    }
  }, [items, wishlist, user, isHydrated, cloudReady]);

  const add = React.useCallback(
    (product: Product, size: string, color: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color
        );
        if (existing) {
          return prev.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { product, size, color, quantity: 1 }];
      });
      setOpen(true);
    },
    []
  );

  const remove = React.useCallback(
    (id: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.product.id === id && i.size === size && i.color === color)
        )
      );
    },
    []
  );

  const updateQty = React.useCallback(
    (id: string, size: string, color: string, qty: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.product.id === id && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(0, qty) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clear = React.useCallback(() => setItems([]), []);

  const toggleWishlist = React.useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = React.useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const saveOrder = React.useCallback(async (order: OrderInput) => {
    if (!user || !db) {
      throw new Error('You must be signed in with Firebase before placing an order.');
    }

    const orderRef = await addDoc(collection(db, 'users', user.id, 'orders'), {
      ...JSON.parse(JSON.stringify(order)),
      createdAt: serverTimestamp(),
      status: 'confirmed',
    });

    return orderRef.id;
  }, [user]);

  const count = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const subtotal = items.reduce((sum, i) => {
    const priceNum = typeof i.product.price === 'number' ? i.product.price : 0;
    return sum + priceNum * (i.quantity || 1);
  }, 0);

  const totalSavings = items.reduce((sum, i) => {
    const price = typeof i.product.price === 'number' ? i.product.price : 0;
    const origPrice =
      typeof i.product.originalPrice === 'number'
        ? i.product.originalPrice
        : price;
    return sum + (origPrice - price) * (i.quantity || 1);
  }, 0);

  const value: CartContextValue = {
    items,
    wishlist,
    isOpen,
    add,
    remove,
    updateQty,
    clear,
    setOpen,
    toggleWishlist,
    isInWishlist,
    saveOrder,
    count,
    subtotal,
    totalSavings,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}