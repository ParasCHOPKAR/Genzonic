"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  slug?: string;
}

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("genzonic_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist from local storage", error);
      }
    }
  }, []);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isAlreadyLiked = prev.some((item) => item.id === product.id);
      
      let updatedWishlist;
      if (isAlreadyLiked) {
        updatedWishlist = prev.filter((item) => item.id !== product.id);
      } else {
        updatedWishlist = [...prev, product];
      }

      localStorage.setItem("genzonic_wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const isInWishlist = (id: string | number) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};