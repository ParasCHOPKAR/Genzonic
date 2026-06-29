"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { useCartStore } from "@/store/cartStore";
// 🔥 Added Loader2 to the imports
import { ShoppingBag, CheckCircle, Loader2 } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const router = useRouter(); 
  
  const [product, setProduct] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?t=${new Date().getTime()}`);
        const data = await res.json();
        if (data.success) {
          const found = data.products.find((p: any) => p.slug === slug);
          setProduct(found);
          if (found?.sizes?.length > 0) setSelectedSize(found.sizes[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [slug]);

  // 🔥 THE NEW PREMIUM LOADER
  if (!product) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        background: "var(--bg)", 
        color: "var(--text)",
        fontFamily: "inherit"
      }}>
        <Loader2 
          className="animate-spin" 
          size={54} 
          color="#FF3E00" 
          style={{ marginBottom: "20px" }} 
        />
        <h2 style={{ 
          fontSize: "18px", 
          fontWeight: 900, 
          letterSpacing: "4px", 
          textTransform: "uppercase",
          margin: "0 0 10px 0",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        }}>
          Forging Artifact
        </h2>
        <p style={{ 
          fontSize: "12px", 
          fontWeight: 600, 
          letterSpacing: "2px", 
          opacity: 0.5, 
          textTransform: "uppercase",
          margin: 0
        }}>
          Decrypting vault data...
        </p>
  
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    );
  }

  const gallery = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size.");
    
    setIsAdding(true); 
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize
    });
    
    setTimeout(() => {
      router.push("/cart");
    }, 800);
  };

  return (
    <div className="pdp-container">
      <div className="breadcrumb">
        Home / {product.category.toUpperCase()} / T-SHIRTS / <span style={{ color: "var(--text)" }}>{product.name}</span>
      </div>

      <div className="pdp-grid">
        
        <div className="thumbnails">
          {gallery.map((img: string, idx: number) => (
            <div 
              key={idx} 
              className={`thumb ${selectedImageIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedImageIndex(idx)}
            >
              <Image 
                src={img || "/fallback.png"} 
                alt={`Thumb ${idx}`} 
                fill 
                style={{ objectFit: 'contain', padding: '4px' }} 
              />
            </div>
          ))}
        </div>

        <div className="main-image-container">
          <Image 
            src={gallery[selectedImageIndex] || "/fallback.png"} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'contain', padding: '20px' }} 
            priority 
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="price-block">
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{originalPrice}</span>
            <span className="discount-badge">{discountPercent}% OFF</span>
          </div>

          <p className="taxes-note">Inclusive of all taxes</p>

          <div className="size-section">
            <div className="size-header">
              <span className="size-label">SELECT SIZE</span>
            
            </div>
            <div className="size-grid">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size: string) => (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <button className="size-btn active">ONE SIZE</button>
              )}
            </div>
          </div>

          <button className={`add-to-cart-large ${isAdding ? 'success' : ''}`} onClick={handleAddToCart}>
            {isAdding ? <CheckCircle size={20} /> : <ShoppingBag size={20} />}
            {isAdding ? "ADDED TO CART ✓" : "ADD TO CART"}
          </button>

          <div className="product-desc">
            <h4>DESCRIPTION / LORE</h4>
            <p>{product.description || "A premium artifact crafted with meticulous attention to detail. Heavyweight fabric, dropped shoulders, and a structured fit designed for the modern streetwear aesthetic."}</p>
          </div>
        </div>

      </div>

      <style jsx>{`
        .pdp-container { 
          padding: 110px 5% 40px; 
          background: var(--bg); 
          color: var(--text); 
          height: 100vh; 
          max-width: 1600px; 
          margin: 0 auto; 
          font-family: 'Inter', sans-serif; 
          display: flex;
          flex-direction: column;
          overflow: hidden; 
        }
        
        .breadcrumb { font-size: 11px; font-weight: 700; color: #888; margin-bottom: 25px; letter-spacing: 1px; text-transform: uppercase; }
        
        .pdp-grid { 
          flex: 1; 
          display: grid; 
          grid-template-columns: 80px minmax(400px, 600px) 450px; 
          justify-content: center; 
          gap: 60px; 
          min-height: 0; 
        }
        
        .thumbnails { display: flex; flex-direction: column; gap: 12px; height: 100%; overflow-y: auto; padding-right: 5px; }
        .thumbnails::-webkit-scrollbar { display: none; }
        .thumb { position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 6px; overflow: hidden; cursor: pointer; border: 1px solid rgba(128,128,128,0.2); transition: 0.2s; background: rgba(128,128,128,0.03); flex-shrink: 0; }
        .thumb.active { border-color: var(--text); border-width: 2px; }
        .thumb img { transition: 0.2s; }
        .thumb:hover { border-color: rgba(128,128,128,0.5); }

        .main-image-container { position: relative; width: 100%; height: 100%; background: rgba(128,128,128,0.03); border-radius: 8px; overflow: hidden; border: 1px solid rgba(128,128,128,0.1); }

        .product-info { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding-right: 15px; padding-bottom: 50px; }
        .product-info::-webkit-scrollbar { width: 4px; }
        .product-info::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }

        .product-title { font-size: clamp(28px, 3vw, 36px); font-weight: 900; margin: 0; line-height: 1.1; letter-spacing: -1px; text-transform: uppercase; }
        
        .price-block { display: flex; align-items: center; gap: 15px; margin-top: 15px; }
        .current-price { font-size: 28px; font-weight: 900; }
        .original-price { font-size: 18px; font-weight: 600; color: #888; text-decoration: line-through; }
        
        .discount-badge { background: var(--text); color: var(--bg); font-size: 11px; font-weight: 900; padding: 6px 10px; letter-spacing: 1px; border-radius: 4px;}

        .taxes-note { font-size: 12px; color: #888; font-weight: 600; margin-top: 8px; }

        .size-section { margin-top: 35px; }
        .size-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .size-label { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #888; }
        .size-guide { font-size: 12px; font-weight: 700; color: var(--text); cursor: pointer; text-decoration: underline; opacity: 0.6; transition: 0.2s; }
        .size-guide:hover { opacity: 1; }
        
        .size-grid { display: flex; gap: 10px; flex-wrap: wrap; }
        .size-btn { width: 55px; height: 55px; border-radius: 6px; border: 1px solid rgba(128,128,128,0.2); background: transparent; color: var(--text); font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .size-btn:hover { border-color: var(--text); }
        .size-btn.active { background: var(--text); color: var(--bg); border-color: var(--text); }

        .add-to-cart-large { width: 100%; padding: 22px; background: var(--text); color: var(--bg); border: none; border-radius: 6px; font-size: 14px; font-weight: 900; letter-spacing: 2px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.3s; margin-top: 35px; flex-shrink: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .add-to-cart-large:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
        .add-to-cart-large.success { background: #50e3c2; color: #000; }

        .product-desc { margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(128,128,128,0.1); }
        .product-desc h4 { font-size: 11px; font-weight: 800; letter-spacing: 2px; margin-bottom: 12px; color: #888; }
        .product-desc p { font-size: 13px; line-height: 1.7; opacity: 0.8; font-weight: 500; }

        @media (max-width: 1024px) {
          .pdp-container { height: auto; overflow: auto; }
          .pdp-grid { grid-template-columns: 1fr; height: auto; gap: 30px; }
          .thumbnails { flex-direction: row; order: 2; overflow-x: auto; height: auto; padding-bottom: 10px; }
          .thumb { width: 80px; height: 100px; flex-shrink: 0; }
          .main-image-container { order: 1; height: 60vh; }
          .product-info { order: 3; padding-bottom: 20px; }
        }
      `}</style>
    </div>
  );
}