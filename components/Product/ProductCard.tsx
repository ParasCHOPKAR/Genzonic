"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCartStore();

  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);

    // ✅ Show feedback
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card">

      {/* CLICK → GO TO DETAILS */}
      <Link href={`/product/${product.slug}`}>
        <div className="product-img">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
          />
        </div>
      </Link>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>

        {/* 🔥 ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          className="cart-btn"
          disabled={added}
        >
          {added ? "Added ✅" : "Add to Cart"}
        </button>
      </div>

      <style jsx>{`
        .product-card {
          display: block;
          transition: 0.4s;
        }

        .product-img {
          overflow: hidden;
          border-radius: 12px;
        }

        .product-img img {
          width: 100%;
          height: auto;
          transition: 0.5s;
        }

        .product-card:hover img {
          transform: scale(1.08);
        }

        .product-info {
          margin-top: 12px;
        }

        h3 {
          font-size: 16px;
          font-weight: 600;
        }

        p {
          margin-top: 4px;
          color: #555;
        }

        .cart-btn {
          margin-top: 10px;
          padding: 12px;
          width: 100%;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          font-weight: 600;
          transition: 0.3s;
        }

        .cart-btn:hover {
          background: #f58220;
        }

        .cart-btn:disabled {
          background: #444;
          cursor: not-allowed;
        }
      `}</style>

    </div>
  );
}