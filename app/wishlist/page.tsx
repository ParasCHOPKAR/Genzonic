"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
import { Trash2, ShoppingCart, ArrowRight, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTheme } from "@/app/context/ThemeContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartStore();
  const { theme } = useTheme(); // Grabbing your actual theme state
  
  // A quick boolean we can use to force styles
  const isDark = theme === "dark";

  return (
    <div 
      // 🔥 Using explicit JS theme logic instead of buggy Tailwind dark: classes
      className={`min-h-screen pb-20 px-6 md:px-12 transition-colors duration-300 ${isDark ? "bg-[#050505] text-white" : "bg-white text-black"}`}
      style={{ paddingTop: "220px" }} 
    >
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className={`mb-12 border-b pb-6 relative z-10 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <span className={`text-xs font-black tracking-[0.3em] uppercase mb-2 block ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            GenZonic Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Saved Artifacts
          </h1>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 md:py-32 border rounded-xl transition-colors duration-300 ${isDark ? "bg-[#0a0a0a] border-gray-900" : "bg-gray-50 border-gray-200"}`}>
            <div className={`w-24 h-24 mb-6 rounded-full border-2 border-dashed flex items-center justify-center ${isDark ? "border-gray-700" : "border-gray-300"}`}>
              <Heart size={32} className={isDark ? "text-gray-600" : "text-gray-400"} />
            </div>
            <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">Your Vault is Empty</h2>
            <p className={`mb-8 max-w-md text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              You haven't secured any items yet. Explore the core collection and save your favorite silhouettes for later.
            </p>
            
            {/* 🔥 Bulletproof Button Styling based on isDark */}
            <Link 
              href="/shop/men" 
              className={`flex items-center gap-3 px-8 py-4 text-sm font-black tracking-widest uppercase hover:scale-105 transition-transform rounded-md ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
            >
              Explore Collection <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* POPULATED GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                
                {/* Image Container */}
                <div className={`relative aspect-[4/5] overflow-hidden rounded-md mb-4 border ${isDark ? "bg-[#111] border-gray-800" : "bg-gray-100 border-gray-200"}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Remove Button Overlay */}
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className={`absolute top-4 right-4 p-3 backdrop-blur-md rounded-full shadow-lg transition-colors z-10 ${isDark ? "bg-black/90 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-red-500 text-black hover:text-white"}`}
                  >
                    <Trash2 size={18} className="group-hover:text-white" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <span className={`text-md font-bold mb-4 ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                    ₹{item.price}
                  </span>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => addToCart({ ...item, quantity: 1, size: "M", color: "Black" } as any)}
                    className={`mt-auto flex items-center justify-center gap-2 w-full py-3 text-sm font-black uppercase tracking-widest transition-colors border-2 rounded-md ${isDark ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"}`}
                  >
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}