"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null); // 🔥 NEW: The safety lock
  const { data: session, status } = useSession();

  const userKey = status === "authenticated" && session?.user?.email 
    ? `genzonic_wishlist_${session.user.email}` 
    : "genzonic_wishlist_guest";

  // 1. LOAD DATA
  useEffect(() => {
    if (status === "loading") return;

    const saved = localStorage.getItem(userKey);
    if (saved) {
      setWishlist(JSON.parse(saved));
    } else {
      setWishlist([]); 
    }
    setLoadedKey(userKey); // 🔥 Unlocks saving ONLY after data is safely on screen
  }, [userKey, status]);

  // 2. SAVE DATA
  useEffect(() => {
    // 🔥 Only save if the data on the screen actually belongs to the current user!
    if (loadedKey === userKey) {
      localStorage.setItem(userKey, JSON.stringify(wishlist));
    }
  }, [wishlist, loadedKey, userKey]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string | number) => wishlist.some((i) => i.id === id);

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};