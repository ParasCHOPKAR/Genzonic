"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import { useSession } from "next-auth/react"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Loader2, Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ProductCard = ({ product, index }: { product: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const frontImage = product.images?.[0] || "/fallback.png";
  const backImage = product.images?.[1] || frontImage; 
  const productId = product._id || product.id;
  
  const isWishlisted = isInWishlist(productId);
  const originalPrice = product.originalPrice || Math.round(product.price * 1.3);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const productUrl = `/product/${product.slug || productId}`;

  const handleSecureBuy = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      router.push(productUrl);
    }
  };

  return (
    <div className={`product-card card-${index}`}>
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
            style={{ objectFit: 'cover', opacity: isHovered ? 0 : 1, transition: 'opacity 0.5s ease' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <Image 
            src={backImage} 
            alt={`${product.name} Back`}
            fill
            style={{ objectFit: 'cover', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s ease' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>

        {/* Quick Add overlay */}
        <div className={`quick-add-overlay ${isHovered ? 'visible' : ''}`}>
          <button onClick={handleSecureBuy} className="quick-add-btn">
            QUICK ADD
          </button>
        </div>

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
            size={18} 
            fill={isWishlisted ? "#000" : "none"} 
            color={isWishlisted ? "#000" : "#000"} 
            strokeWidth={2} 
          />
        </button>
      </div>

      <div className="card-info">
        <Link href={productUrl} className="product-title">
          {product.name}
        </Link>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {discountPercent > 0 && (
            <span className="old-price">₹{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          // Fetch some products across categories to act as featured items
          const featured = data.products.slice(0, 4);
          setProducts(featured);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isLoading || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".section-header", {
        y: 30,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".section-header",
          start: "top 85%",
        }
      });

      gsap.fromTo(".product-card", 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".grid-container",
            start: "top 80%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, products.length]);

  return (
    <section ref={sectionRef} className="featured-section">
      <div className="container">
        
        <div className="section-header">
          <h2 className="title">NEW ARRIVALS</h2>
          <Link href="/shop/men" className="view-all">
            VIEW ALL
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="view-all-icon">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>NO ARTIFACTS AVAILABLE</p>
          </div>
        ) : (
          <div className="grid-container">
            {products.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} index={i} />
            ))}
          </div>
        )}

      </div>

      <style jsx global>{`
        .product-card { display: flex; flex-direction: column; gap: 16px; }

        .image-box { 
          position: relative; 
          width: 100%; 
          aspect-ratio: 3/4; 
          background-color: var(--accent); 
          overflow: hidden; 
        }
        
        .img-link { display: block; width: 100%; height: 100%; }

        .wishlist-btn { 
          position: absolute; 
          top: 15px; 
          right: 15px; 
          background: #fff; 
          border: none; 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          z-index: 10; 
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wishlist-btn:hover { 
          transform: scale(1.05); 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .quick-add-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 5;
        }
        
        .quick-add-overlay.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .quick-add-btn {
          width: 100%;
          padding: 14px;
          background: #fff;
          color: #000;
          border: none;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .quick-add-btn:hover { background: #f0f0f0; }

        .card-info { display: flex; flex-direction: column; gap: 6px; }
        
        .product-title { 
          font-size: 12px; 
          font-weight: 800; 
          text-transform: uppercase; 
          text-decoration: none; 
          color: var(--text); 
          letter-spacing: 0.5px; 
        }
        
        .price-row { display: flex; align-items: center; gap: 10px; }
        .price { font-size: 14px; font-weight: 900; }
        .old-price { font-size: 12px; font-weight: 600; color: #888; text-decoration: line-through; }

        @media (max-width: 1024px) {
          .quick-add-overlay { display: none; } /* Hide on touch devices usually */
        }
        
        @media (max-width: 600px) {
          .product-card { gap: 12px; }
          .wishlist-btn { width: 32px; height: 32px; top: 10px; right: 10px; }
          .wishlist-btn svg { width: 14px; height: 14px; }
          .product-title { font-size: 11px; }
          .price { font-size: 13px; }
          .old-price { font-size: 11px; }
        }
      `}</style>

      <style jsx>{`
        .featured-section { 
          padding: 100px 5%; 
          background: var(--bg); 
          color: var(--text); 
        }
        
        .container { 
          max-width: 1600px; 
          margin: 0 auto; 
        }
        
        .section-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end; 
          margin-bottom: 40px; 
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 15px;
        }
        
        .title { 
          font-size: clamp(1.5rem, 4vw, 2.5rem); 
          font-weight: 900; 
          letter-spacing: -1px; 
          margin: 0; 
        }
        
        .view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--text);
          border: 1.5px solid var(--text);
          padding: 10px 20px;
          border-radius: 50px;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }
        .view-all:hover {
          background: var(--text);
          color: var(--bg);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .view-all-icon {
          transition: transform 0.25s ease;
        }
        .view-all:hover .view-all-icon {
          transform: translateX(4px);
        }

        .grid-container { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 30px; 
        }

        .loading-state, .empty-state { 
          min-height: 300px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          opacity: 0.5; 
        }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 1024px) { 
          .grid-container { grid-template-columns: repeat(2, 1fr); gap: 40px 20px; } 
          .featured-section { padding: 80px 5%; }
        }
        
        @media (max-width: 600px) { 
          .featured-section { padding: 60px 5%; }
          .section-header { margin-bottom: 30px; }
          .grid-container { gap: 30px 10px; } 
        }
      `}</style>
    </section>
  );
}