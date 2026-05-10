"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// 🔥 1. Added useRouter and usePathname here
import { useParams, useRouter, usePathname } from "next/navigation"; 
// 🔥 2. Added useSession for auth checking
import { useSession } from "next-auth/react"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Loader2, Heart } from "lucide-react";

// 🔥 Import the global wishlist context so the button actually saves data!
import { useWishlist } from "@/app/context/WishlistContext";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================
   INDIVIDUAL CATEGORY CARD
========================= */
const CategoryCard = ({ product }: { product: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Connect to global memory instead of local fake state
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 🔥 3. Initialize Auth and Routing hooks
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Grabs current URL (e.g. /shop/men)

  // Safely map MongoDB data
  const frontImage = product.images?.[0] || "/fallback.png";
  const backImage = product.images?.[1] || frontImage; 
  const productId = product._id || product.id;
  
  // Check if this specific item is in the global vault
  const isWishlisted = isInWishlist(productId);
  
  const originalPrice = product.originalPrice || Math.round(product.price * 1.3);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // URL for the Product Details Page
  const productUrl = `/product/${product.slug || productId}`;

  // 🔥 4. The Secure Interceptor Function
  const handleSecureBuy = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop default navigation
    
    if (status === "unauthenticated") {
      // Send to login, and tell it to return to this EXACT category page after success
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      // If logged in, proceed to the product
      router.push(productUrl);
    }
  };

  return (
    <div className="cat-card">
      
      {/* IMAGE CONTAINER WITH HEART ICON */}
      <div 
        className="image-box"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={productUrl} className="img-link">
          <Image 
            src={frontImage} 
            alt={`${product.name} Front`}
            fill
            style={{ objectFit: 'cover', opacity: isHovered ? 0 : 1, transition: 'opacity 0.4s ease' }}
          />
          <Image 
            src={backImage} 
            alt={`${product.name} Back`}
            fill
            style={{ objectFit: 'cover', opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />
        </Link>

        {/* REAL Wishlist Button connected to Context */}
        <button 
          className="wishlist-btn"
          onClick={(e) => {
            e.preventDefault(); 
            toggleWishlist({
              id: productId,
              name: product.name,
              price: product.price,
              image: frontImage
            });
          }}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? "#ff3e00" : "none"} 
            color={isWishlisted ? "#ff3e00" : "#000"} 
            strokeWidth={2} 
          />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="card-info">
        <Link href={productUrl} className="product-title">
          {product.name}
        </Link>
        
        {/* PRICING ROW */}
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {discountPercent > 0 && (
            <>
              <span className="old-price">₹{originalPrice}</span>
              <span className="badge">{discountPercent}% OFF</span>
            </>
          )}
        </div>

        {/* 🔥 5. Secure BUY NOW Button 🔥 */}
        <button onClick={handleSecureBuy} className="buy-btn">
          BUY NOW
        </button>
      </div>
    </div>
  );
};

/* =========================
   MAIN CATEGORY PAGE
========================= */
export default function CategoryPage() {
  const params = useParams();
  const categoryRaw = (params?.category as string) || "men";
  
  const pageTitle = categoryRaw.toLowerCase() === "kids" 
    ? "KIDS COLLECTION" 
    : `${categoryRaw.toUpperCase()}S COLLECTION`;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          const filtered = data.products.filter(
            (p: any) => p.category?.toLowerCase() === categoryRaw.toLowerCase()
          );
          setProducts(filtered);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryRaw]);

  // GSAP Animations
  useEffect(() => {
    if (isLoading || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.fromTo(".cat-card", 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, products.length]);

  return (
    <main ref={containerRef} className="category-page">
      <div className="cat-container">
        
        {/* HEADER */}
        <div className="header-block">
          <h1 ref={titleRef} className="cat-title">{pageTitle}</h1>
          <hr className="divider" />
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={40} />
            <p>ACCESSING ARTIFACTS...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>ARCHIVE EMPTY</h3>
            <p>No artifacts found for this sector yet.</p>
          </div>
        ) : (
          <div className="cat-grid">
            {products.map((product) => (
              <CategoryCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* ================= STYLES ================= */}
      <style jsx global>{`
        /* Card Base */
        .cat-card { display: flex; flex-direction: column; gap: 15px; }

        /* Image Box with Heart */
        .image-box { position: relative; width: 100%; aspect-ratio: 3/4; background-color: #f8f8f8; border-radius: 4px; overflow: hidden; }
        :global(.dark) .image-box { background-color: #111; }
        .img-link { display: block; width: 100%; height: 100%; }

        .wishlist-btn { position: absolute; top: 15px; right: 15px; background: #fff; border: none; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 10; transition: transform 0.2s ease; }
        .wishlist-btn:hover { transform: scale(1.1); }

        /* Info Section */
        .card-info { display: flex; flex-direction: column; gap: 8px; }
        .product-title { font-size: 13px; font-weight: 900; text-transform: uppercase; text-decoration: none; color: var(--text); letter-spacing: 0.5px; }
        
        .price-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .price { font-size: 15px; font-weight: 900; }
        .old-price { font-size: 12px; font-weight: 600; color: #888; text-decoration: line-through; }
        .badge { background: #000; color: #fff; font-size: 10px; font-weight: 900; padding: 3px 6px; border-radius: 3px; letter-spacing: 0.5px; }
        :global(.dark) .badge { background: #fff; color: #000; }

        /* Buy Button (Now a <button> instead of <Link>) */
        .buy-btn { display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px; background: transparent; border: 1px solid var(--text); color: var(--text); font-size: 11px; font-weight: 800; letter-spacing: 2px; text-decoration: none; transition: all 0.3s ease; border-radius: 4px; margin-top: 5px; cursor: pointer; }
        .buy-btn:hover { background: var(--text); color: var(--bg); }

        @media (max-width: 600px) {
          .cat-card { gap: 10px; }
          .wishlist-btn { width: 28px; height: 28px; top: 10px; right: 10px; }
          .wishlist-btn svg { width: 14px; height: 14px; }
          
          .product-title { font-size: 11px; white-space: normal; line-height: 1.3; }
          .price { font-size: 13px; }
          .old-price { font-size: 11px; }
          .badge { font-size: 9px; padding: 2px 4px; }
          
          .buy-btn { padding: 10px 5px; font-size: 10px; letter-spacing: 1px; }
        }
      `}</style>

      <style jsx>{`
        /* 🔥 FIXED: padding-top bumped to 220px to clear the massive navbar 🔥 */
        .category-page { padding: 220px 6% 100px; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
        
        .cat-container { max-width: 1400px; margin: 0 auto; }
        .header-block { margin-bottom: 50px; }
        
        .cat-title { 
          font-size: clamp(3rem, 6vw, 5rem); 
          font-weight: 900; 
          letter-spacing: -2px; 
          margin: 0 0 30px 0; 
          line-height: 1; 
          text-transform: uppercase;
        }
        
        .divider { border: none; border-top: 1px solid rgba(128,128,128,0.2); }

        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 50px 30px; }

        .loading-state, .empty-state { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; opacity: 0.5; }
        .loading-state p { font-size: 12px; font-weight: 800; letter-spacing: 3px; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .empty-state h3 { font-size: 24px; font-weight: 900; margin: 0; }
        .empty-state p { font-size: 14px; margin: 0; }

        @media (max-width: 1200px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 850px) { .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 20px; } }
        
        @media (max-width: 600px) { 
          /* 🔥 FIXED Mobile Padding 🔥 */
          .category-page { padding: 180px 5% 80px; }
          .header-block { margin-bottom: 30px; }
          
          .cat-title { 
            font-size: clamp(2.5rem, 12vw, 3.5rem); 
            letter-spacing: -1px; 
            margin-bottom: 20px;
            line-height: 1.1;
            word-wrap: break-word; 
          }
          
          .cat-grid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px 10px; 
          } 
        }
      `}</style>
    </main>
  );
}