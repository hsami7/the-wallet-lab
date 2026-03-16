"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: string | number) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch {}
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => prev.some((i) => i.id === item.id) ? prev : [...prev, item]);
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const isWishlisted = (id: string | number) => wishlist.some((i) => i.id === id);

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      itemCount: wishlist.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
