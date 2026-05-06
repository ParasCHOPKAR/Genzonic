"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
// 🔥 Added the missing Heart icon import
import { Trash2, ShoppingCart, ArrowRight, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
// 🔥 Imported your Theme Context
import { useTheme } from "@/app/context/ThemeContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartStore();
  const { theme } = useTheme(); // Now the page listens to your theme state

  return (
    // 🔥 Added bg-white dark:bg-[#050505] text-black dark:text-white and smooth transitions
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-6">
          <span className="text-xs font-black tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase mb-2 block">
            GenZonic Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Saved Artifacts
          </h1>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-900 rounded-xl transition-colors duration-300">
            <div className="w-24 h-24 mb-6 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <Heart size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">Your Vault is Empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
              You haven't secured any items yet. Explore the core collection and save your favorite silhouettes for later.
            </p>
            <Link 
              href="/shop/men" 
              className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-sm font-black tracking-widest uppercase hover:scale-105 transition-transform"
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
                <div className="relative aspect-[4/5] bg-gray-100 dark:bg-[#111] overflow-hidden rounded-md mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Remove Button Overlay */}
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-lg hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition-colors z-10"
                  >
                    <Trash2 size={18} className="text-black dark:text-white group-hover:text-white" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-1 text-black dark:text-white">
                    {item.name}
                  </h3>
                  <span className="text-md font-bold mb-4 text-gray-800 dark:text-gray-300">
                    ₹{item.price}
                  </span>
                  
                  <button 
      onClick={() => addToCart({ ...item, quantity: 1, size: "M", color: "Black" } as any)}
                    className="mt-auto flex items-center justify-center gap-2 w-full border-2 border-black dark:border-white py-3 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
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