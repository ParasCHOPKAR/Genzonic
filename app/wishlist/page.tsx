"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import { X, ShoppingCart, ArrowRight, Heart, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTheme } from "@/app/context/ThemeContext";
import gsap from "gsap";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartStore();
  const { theme } = useTheme(); 
  
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // 🔥 State to track which item was just added for the success animation
  const [addedItemId, setAddedItemId] = useState<string | number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (!isMounted) return;
    
    const ctx = gsap.context(() => {
      gsap.from(".anim-fade-up", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMounted, wishlist.length]);

  // 🔥 FIXED: Bulletproof Add To Cart Function
  const handleAddToCart = (item: any) => {
    // 1. Send the exact formatted data to Zustand Cart Store with 'as any' to bypass TS errors
    addToCart({
      ...item, // Spreads all original item properties to ensure nothing is missed
      quantity: 1,
      size: "M", // Default size for quick-add
      color: "Black" // Default color for quick-add
    } as any);

    // 2. Trigger the success UI animation
    setAddedItemId(item.id);

    // 3. Reset the button after 2 seconds
    setTimeout(() => {
      setAddedItemId(null);
    }, 2000);
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div 
      ref={containerRef}
      className="wishlist-wrapper"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="header-section anim-fade-up">
          <span className="subtitle">
            GenZonic Archive // Sector 04
          </span>
          <h1 className="title">
            Saved Artifacts
          </h1>
          <div className="status-bar">
            <span>VAULT STATUS:</span>
            <span className={wishlist.length === 0 ? "status-empty" : "status-active"}>
              {wishlist.length === 0 ? "EMPTY" : `${wishlist.length} SECURED`}
            </span>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {wishlist.length === 0 ? (
          <div className="empty-vault anim-fade-up">
            <div className="heart-radar">
              <Heart size={40} className="pulse-heart" />
              <div className="radar-ring delay-1"></div>
              <div className="radar-ring delay-2"></div>
            </div>
            <h2>VAULT IS SECURE BUT EMPTY</h2>
            <p>
              No artifacts detected in this sector. Return to the core collection and identify silhouettes to secure.
            </p>
            
            <Link href="/shop/men" className="explore-btn">
              EXPLORE ARCHIVE <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          
          /* ================= POPULATED GRID ================= */
          <div className="wishlist-grid">
            {wishlist.map((item) => {
              const isJustAdded = addedItemId === item.id;

              return (
                <div key={item.id} className="artifact-card anim-fade-up">
                  
                  {/* Image Container */}
                  <div className="image-vault">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="artifact-img"
                    />
                    
                    {/* Glassmorphic Remove Button */}
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="remove-btn"
                      aria-label="Remove from vault"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Artifact Info */}
                  <div className="artifact-info">
                    <h3>{item.name}</h3>
                    <span className="price">₹{item.price}</span>
                    
                    {/* 🔥 UPGRADED ACTION BUTTON 🔥 */}
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={isJustAdded}
                      className={`cart-btn ${isJustAdded ? "success-state" : ""}`}
                    >
                      {isJustAdded ? (
                        <>
                          <CheckCircle2 size={16} /> ARTIFACT ACQUIRED
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} /> ACQUIRE ARTIFACT
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= PREMIUM STYLES ================= */}
      <style jsx global>{`
        .wishlist-wrapper {
          min-height: 100vh;
          padding: 220px 6% 100px;
          background-color: var(--bg);
          color: var(--text);
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        /* HEADER */
        .header-section {
          margin-bottom: 60px;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 40px;
          position: relative;
        }
        .subtitle {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          opacity: 0.5;
          display: block;
          margin-bottom: 15px;
        }
        .title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -2px;
          margin: 0 0 20px 0;
          line-height: 1;
        }
        .status-bar {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 8px 16px;
          background: rgba(128,128,128,0.05);
          border: 1px solid rgba(128,128,128,0.2);
          border-radius: 4px;
        }
        .status-empty { color: #ef4444; }
        .status-active { color: #22c55e; }

        /* EMPTY VAULT */
        .empty-vault {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          text-align: center;
          background: rgba(128,128,128,0.02);
          border: 1px dashed rgba(128,128,128,0.2);
          border-radius: 8px;
        }
        
        .heart-radar {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }
        .pulse-heart {
          color: rgba(128,128,128,0.4);
          z-index: 2;
        }
        .radar-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(128,128,128,0.3);
          border-radius: 50%;
          animation: radarPulse 3s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }
        .delay-1 { animation-delay: 1s; }
        .delay-2 { animation-delay: 2s; }

        @keyframes radarPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .empty-vault h2 {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0 0 15px 0;
        }
        .empty-vault p {
          font-size: 14px;
          opacity: 0.6;
          max-width: 450px;
          margin: 0 0 40px 0;
          line-height: 1.6;
        }

        .explore-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background-color: var(--text);
          color: var(--bg);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          text-decoration: none;
          text-transform: uppercase;
          border-radius: 4px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--text);
        }
        .explore-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        /* POPULATED GRID */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 40px;
        }

        .artifact-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-vault {
          position: relative;
          aspect-ratio: 4/5;
          background: rgba(128,128,128,0.05);
          border: 1px solid rgba(128,128,128,0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .artifact-img {
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .image-vault:hover .artifact-img {
          transform: scale(1.08);
        }

        /* GLASSMORPHIC REMOVE BUTTON */
        .remove-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text);
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }
        :global(.dark) .remove-btn {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .remove-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: scale(1.1) rotate(90deg);
        }

        /* ARTIFACT INFO */
        .artifact-info {
          display: flex;
          flex-direction: column;
        }
        .artifact-info h3 {
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
        }
        .price {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        /* 🔥 UPGRADED ACQUIRE BUTTON 🔥 */
        .cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: transparent;
          color: var(--text);
          border: 1px solid var(--text);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }
        
        .cart-btn:hover:not(.success-state) {
          background: var(--text);
          color: var(--bg);
        }

        /* SUCCESS STATE STYLING */
        .cart-btn.success-state {
          background: #22c55e !important;
          color: white !important;
          border-color: #22c55e !important;
          cursor: default;
        }

        @media (max-width: 600px) {
          .wishlist-wrapper { padding: 180px 5% 80px; }
          .title { font-size: 2.5rem; }
          .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
          .explore-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}