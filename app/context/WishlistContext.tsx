"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 🔥 Imported NextAuth to track the user

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
  const { data: session, status } = useSession(); // 🔥 Get current login status

  // 🔥 Dynamically create a storage key based on the user's email
  const userKey = status === "authenticated" && session?.user?.email 
    ? `genzonic_wishlist_${session.user.email}` 
    : "genzonic_wishlist_guest";

  // LOAD DATA: When the user logs in or out, fetch THEIR specific wishlist
  useEffect(() => {
    if (status === "loading") return; // Wait for authentication to finish

    const saved = localStorage.getItem(userKey);
    if (saved) {
      setWishlist(JSON.parse(saved));
    } else {
      setWishlist([]); // Start fresh if this user has no history
    }
  }, [userKey, status]);

  // SAVE DATA: Whenever they like an item, save it to THEIR specific key
  useEffect(() => {
    if (status !== "loading") {
      localStorage.setItem(userKey, JSON.stringify(wishlist));
    }
  }, [wishlist, userKey, status]);

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