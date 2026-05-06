"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Define the shape of a Wishlist Item
export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

// 2. Define what functions the Context provides
interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 3. Load from local storage when the app starts
  useEffect(() => {
    setIsMounted(true);
    const savedWishlist = localStorage.getItem("genzonic_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist", error);
      }
    }
  }, []);

  // 4. Save to local storage whenever an item is added or removed
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("genzonic_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((w) => w.id === item.id)) return prev; // Prevent duplicates
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string | number) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// 5. Export the hook so other files can use it
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};