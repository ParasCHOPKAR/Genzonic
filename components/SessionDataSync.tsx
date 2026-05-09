"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export default function SessionDataSync() {
  const { data: session, status } = useSession();
  const { cart, setCart } = useCartStore();
  const [loadedKey, setLoadedKey] = useState<string | null>(null); // 🔥 Safety lock for Cart

  const userKey = session?.user?.email 
    ? `genzonic_cart_${session.user.email}` 
    : "genzonic_cart_guest";

  // 1. LOAD CART
  useEffect(() => {
    if (status === "loading") return;
    
    const savedCart = localStorage.getItem(userKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]); 
    }
    setLoadedKey(userKey); // 🔥 Data loaded, safe to save now
  }, [userKey, status, setCart]);

  // 2. SAVE CART
  useEffect(() => {
    // 🔥 Prevent empty screen from wiping the database
    if (loadedKey === userKey) {
      localStorage.setItem(userKey, JSON.stringify(cart));
    }
  }, [cart, loadedKey, userKey]);

  return null; 
}