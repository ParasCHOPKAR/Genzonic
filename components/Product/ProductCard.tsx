"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useWishlist } from "@/app/context/WishlistContext";

interface ProductProps {
  product: {
    _id?: string;
    id?: string | number;
    name: string;
    price: number;
    image: string;
    slug?: string;
    stock: number; // ✅ Added property to fix type definition error
  };
}

export default function ProductCard({ product }: ProductProps) {
  // 1. Store Hooks
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // 2. Local State
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // 3. ID Normalization (Handles both MongoDB _id and standard id)
  const productId = product.id || product._id || "";
  const isLiked = isInWishlist(productId);

  // 4. Create a clean product object for the Wishlist
  const wishlistProduct = {
    id: productId,
    name: product.name,
    price: product.price,
    image: product.image,
    slug: product.slug,
  };

  // 5. Handlers (Fixed premature brackets and removed stray character)
  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: productId,
      size: "M", // Default size for quick add
      stock: product.stock 
    });
    
    setAdded(true);
    
    // Optional: Reset the button back to "Add to Cart" after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="border rounded-lg p-4 relative flex flex-col group transition duration-300 hover:shadow-lg dark:border-gray-700">
      
      {/* WISHLIST HEART BUTTON */}
      <button 
        type="button"
        onClick={() => toggleWishlist(wishlistProduct)}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      >
        {isLiked ? "❤️" : "🤍"}
      </button>

      {/* CLICK → GO TO DETAILS */}
      <Link href={`/product/${product.slug || productId}`}>
        <div className="relative h-64 w-full mb-4 overflow-hidden rounded-md">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <h3 className="font-bold text-lg uppercase truncate">{product.name}</h3>
        <p className="font-semibold mt-2">₹{product.price}</p>
      </Link>
      
      {/* ADD TO CART BUTTON */}
      <button 
        type="button"
        onClick={handleAddToCart}
        disabled={added}
        className={`w-full mt-4 py-3 font-bold uppercase transition-colors rounded-md ${
          added 
            ? "bg-gray-600 text-white cursor-not-allowed" 
            : "bg-black text-white hover:bg-[#f58220] dark:bg-white dark:text-black dark:hover:bg-[#f58220] dark:hover:text-white"
        }`}
      >
        {added ? "Added ✅" : "Add to Cart"}
      </button>
      
    </div>
  );
}