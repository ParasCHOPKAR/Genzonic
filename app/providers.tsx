"use client";

import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SessionProvider } from "next-auth/react"; // 1. Import SessionProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap everything inside the SessionProvider
    <SessionProvider>
      <ThemeProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}