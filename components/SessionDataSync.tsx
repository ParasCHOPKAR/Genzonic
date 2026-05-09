
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export default function SessionDataSync() {
  const { data: session, status } = useSession();
  const { cart, setCart } = useCartStore();

  // LOAD CART: Swap the cart when the user logs in or out
  useEffect(() => {
    if (status === "loading") return;
    
    const userKey = session?.user?.email 
      ? `genzonic_cart_${session.user.email}` 
      : "genzonic_cart_guest";
    
    const savedCart = localStorage.getItem(userKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]); // Clear the cart if it's a new user or guest
    }
  }, [session?.user?.email, status, setCart]);

  // SAVE CART: Update the user's specific storage when they add/remove items
  useEffect(() => {
    if (status === "loading") return;
    
    const userKey = session?.user?.email 
      ? `genzonic_cart_${session.user.email}` 
      : "genzonic_cart_guest";
      
    localStorage.setItem(userKey, JSON.stringify(cart));
  }, [cart, session?.user?.email, status]);

  return null; // This component is invisible, it just runs the logic!
}