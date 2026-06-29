"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Loader2, Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext"; 

// 🔥 Force Next.js to fetch the newest layout dynamically from the DB every time
export const dynamic = "force-dynamic";

// Define strict typing for your operational safety
interface ProductType {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
}

// =========================
// UPGRADED PRODUCT CARD
// =========================
const CategoryCard = ({ product }: { product: ProductType }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Auth & Routing Hooks
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Safely grab images (fallbacks included)
  const frontImage = product.images?.[0] || product.image || "/fallback.png";
  const backImage = product.images?.[1] || frontImage; 
  const productId = product._id || product.id || "";
  
  const isWishlisted = isInWishlist(productId);
  
  // Fake a 35% markup for the UI discount badge
  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const productUrl = `/product/${product.slug || productId}`;

  // The Secure Interceptor Function
  const handleSecureBuy = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      router.push(productUrl);
    }
  };

  return (
    <div className="product-card">
      
      {/* IMAGE CONTAINER WITH HOVER EFFECT */}
      <div 
        className="image-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={productUrl} style={{ display: 'block', width: '100%', height: '100%' }}>
          <Image 
            src={frontImage} 
            alt={`${product.name} Front`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', opacity: isHovered ? 0 : 1, transition: 'opacity 0.4s ease' }}
          />
          <Image 
            src={backImage} 
            alt={`${product.name} Back`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />
        </Link>

        {/* Wishlist Button */}
        <button 
          type="button"
          className="like-btn"
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
            fill={isWishlisted ? "#ff3e00" : "transparent"} 
            color={isWishlisted ? "#ff3e00" : "var(--text)"} 
          />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="product-info">
        <div className="info-header">
          <Link href={productUrl}><h3>{product.name}</h3></Link>
        </div>
        
        <div className="price-container">
          <span className="current-price">₹{product.price}</span>
          {discountPercent > 0 && (
            <>
              <span className="original-price">₹{originalPrice}</span>
              <span className="discount-badge">{discountPercent}% OFF</span>
            </>
          )}
        </div>

        {/* Button triggers secure login redirect */}
        <button type="button" onClick={handleSecureBuy} className="buy-now-btn">
          BUY NOW
        </button>
      </div>
    </div>
  );
};


// =========================
// MAIN PAGE COMPONENT
// =========================
export default function CategoryShopPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const category = resolvedParams.category; 
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // 🔥 Added cache: "no-store" to bypass browser fetch caching
        const res = await fetch(`/api/products?category=${category}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch categorized layout data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [category]);

  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg)", color: "var(--text)" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="page-header">
        <span className="label">GENZONIC ARCHIVE</span>
        <h1 className="title">{category.toUpperCase()}S COLLECTION</h1>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>ARTIFACTS COMING SOON</h2>
          <p>This collection is currently empty. Our designers are forging new items.</p>
          <Link href="/" className="btn-return">RETURN TO BASE <ArrowRight size={14} /></Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <CategoryCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* PREMIUM STORE AESTHETIC CSS */}
      <style jsx global>{`
        .category-page { padding: 120px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; max-width: 1600px; margin: 0 auto;}
        .page-header { margin-bottom: 50px; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 20px; }
        .label { font-size: 10px; font-weight: 800; letter-spacing: 4px; opacity: 0.5; }
        .title { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -2px; margin: 10px 0 0 0; }
        
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 40px 20px; }
        .product-card { display: flex; flex-direction: column; gap: 12px; }
        
        .image-wrapper { position: relative; width: 100%; aspect-ratio: 3/4; background: rgba(128,128,128,0.05); overflow: hidden; display: block; border: 1px solid rgba(128,128,128,0.1); border-radius: 6px; }
        .image-wrapper img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .image-wrapper:hover img { transform: scale(1.05); }

        .like-btn { position: absolute; top: 12px; right: 12px; z-index: 10; background: var(--bg); border: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .like-btn:hover { transform: scale(1.1); }

        .product-info { display: flex; flex-direction: column; gap: 8px; }
        .info-header a { text-decoration: none; color: inherit; }
        .info-header h3 { font-size: 14px; font-weight: 800; margin: 0; line-height: 1.3; text-transform: uppercase; }
        .info-header h3:hover { text-decoration: underline; }

        .price-container { display: flex; align-items: center; gap: 8px; }
        .current-price { font-size: 16px; font-weight: 900; color: var(--text); letter-spacing: -0.5px; }
        .original-price { font-size: 12px; font-weight: 600; color: #888; text-decoration: line-through; }
        .discount-badge { background: var(--text); color: var(--bg); font-size: 9px; font-weight: 900; padding: 4px 6px; border-radius: 4px; letter-spacing: 1px; }

        .buy-now-btn { background: transparent; border: 1px solid var(--text); color: var(--text); padding: 10px; width: 100%; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-align: center; text-decoration: none; border-radius: 4px; transition: 0.3s; margin-top: 5px; cursor: pointer; }
        .buy-now-btn:hover { background: var(--text); color: var(--bg); }
        
        .empty-state { padding: 80px 20px; text-align: center; border: 1px dashed rgba(128,128,128,0.2); }
        .empty-state h2 { font-size: 20px; font-weight: 800; letter-spacing: 2px; }
        .empty-state p { opacity: 0.6; font-size: 14px; margin-bottom: 20px; }
        .btn-return { display: inline-flex; align-items: center; gap: 8px; background: var(--text); color: var(--bg); padding: 12px 24px; font-size: 11px; font-weight: 800; text-decoration: none; margin-top: 20px;}
      `}</style>
    </div>
  );
}