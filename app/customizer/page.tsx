"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, CheckCircle } from "lucide-react";
import Link from "next/link";

// --- Data ---
const TSHIRT_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#222222" },
  { name: "Navy", hex: "#1A237E" },
  { name: "Gray", hex: "#9E9E9E" },
  { name: "Red", hex: "#D32F2F" },
  { name: "Olive", hex: "#556B2F" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const CATEGORIES = [
  { id: "faith-based", name: "Faith-Based Streetwear", image: "/stickers/faith-based.png" },
  { id: "micro-trends", name: "Micro-Trends & Hyper-Niche", image: "/stickers/micro-trends.png" },
  { id: "elevated-basics", name: "\"Elevated Basics\"", image: "/stickers/elevated-basics.png" },
  { id: "vintage-bootleg", name: "Vintage Bootleg & Fan Art", image: "/stickers/vintage-bootleg.png" },
  { id: "glitch-art", name: "Deconstructed & Glitch Art", image: "/stickers/glitch-art.png" },
  { id: "acid-graphics", name: "Acid Graphics & Psychedelic", image: "/stickers/acid-graphics.png" },
  { id: "cyber-sigilism", name: "Cyber-Sigilism & Neo-Tribal", image: "/stickers/cyber-sigilism.png" },
  { id: "eco-warrior", name: "Eco-Warrior & Sustainability", image: "/stickers/eco-warrior.png" },
  { id: "varsity-sports", name: "Varsity & Retro Sports", image: "/stickers/varsity-sports.png" },
  { id: "memes-chaotic", name: "Memes & Quirky Chaotic Art", image: "/stickers/memes-chaotic.png" },
  { id: "celestial-mystical", name: "Celestial & Mystical", image: "/stickers/celestial-mystical.png" },
  { id: "cottagecore", name: "Cottagecore & Neo-Vintage", image: "/stickers/cottagecore.png" },
  { id: "anime-manga", name: "Anime & Manga Panels", image: "/stickers/anime-manga.png" },
];

const DESIGNS = CATEGORIES.map(cat => ({
  id: cat.id,
  categoryId: cat.id,
  url: cat.image,
  name: cat.name + " Design"
}));

export default function CustomizerPage() {
  const [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const filteredDesigns = DESIGNS.filter((d) => d.categoryId === selectedCategory);

  const handleAddToCart = () => {
    if (!selectedDesign) {
      alert("Please select a design first!");
      return;
    }

    setIsAdding(true);

    const designObj = DESIGNS.find(d => d.url === selectedDesign);

    addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom ${designObj?.name || 'T-Shirt'}`,
      price: 999,
      image: selectedDesign,
      size: selectedSize,
      stock: 100, // Generous stock for made-to-order
    });

    setTimeout(() => {
      setIsAdding(false);
      alert("Custom T-Shirt added to cart!");
    }, 800);
  };

  return (
    <div className="customizer-container">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span style={{ color: "var(--text)" }}>CUSTOMIZER</span>
      </div>

      <div className="customizer-header">
        <h1 className="customizer-title">DESIGN YOUR OWN VIBE</h1>
        <p className="customizer-subtitle">CHOOSE YOUR CANVAS, PICK YOUR AESTHETIC, AND WEAR YOUR ART.</p>
      </div>

      <div className="customizer-grid">
        
        {/* Left Column: T-Shirt Preview */}
        <div className="preview-display">
          <div className="main-image-container">
            {/* Base T-Shirt Image with Color Overlay via CSS */}
            <div 
              className="color-overlay" 
              style={{ backgroundColor: selectedColor.hex }}
            ></div>
            
            <Image 
              src="/products/tshirt-1-removebg-preview.png"
              alt="Blank T-Shirt"
              fill
              className="base-tshirt"
              priority
            />

            {/* Design Overlay */}
            {selectedDesign && (
              <div className="design-overlay">
                 <div className="design-inner">
                   <Image
                      src={selectedDesign}
                      alt="Selected Design"
                      fill
                      className="design-img"
                   />
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customization Options */}
        <div className="options-panel">
          
          <div className="price-block">
            <span className="current-price">₹999</span>
            <span className="discount-badge">CUSTOM BUILD</span>
          </div>
          <p className="taxes-note">Inclusive of all taxes & printing costs</p>

          <div className="options-section">
            <div className="section-header">
              <span className="section-label">1. SELECT COLOR</span>
              <span className="section-value">{selectedColor.name}</span>
            </div>
            <div className="color-grid">
              {TSHIRT_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`color-btn ${selectedColor.name === color.name ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          <div className="options-section">
            <div className="section-header">
              <span className="section-label">2. SELECT SIZE</span>
              <span className="section-value">{selectedSize}</span>
            </div>
            <div className="size-grid">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="options-section">
            <div className="section-header">
              <span className="section-label">3. CHOOSE AESTHETIC</span>
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="options-section">
            <div className="section-header">
              <span className="section-label">4. PICK A DESIGN</span>
            </div>
            <div className="designs-grid">
              {filteredDesigns.map(design => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design.url)}
                  className={`design-thumb ${selectedDesign === design.url ? 'active' : ''}`}
                >
                  <Image 
                    src={design.url} 
                    alt={design.name} 
                    fill 
                    className="design-thumb-img"
                  />
                </button>
              ))}
            </div>
          </div>

          <button 
            className={`add-to-cart-large ${isAdding ? 'success' : ''}`} 
            onClick={handleAddToCart}
            disabled={!selectedDesign}
          >
            {isAdding ? <CheckCircle size={20} /> : <ShoppingBag size={20} />}
            {isAdding ? "ADDED TO CART ✓" : (selectedDesign ? "ADD TO CART" : "SELECT A DESIGN FIRST")}
          </button>

        </div>
      </div>

      <style jsx>{`
        .customizer-container { 
          padding: 110px 5% 40px; 
          background: var(--bg); 
          color: var(--text); 
          min-height: 100vh; 
          max-width: 1600px; 
          margin: 0 auto; 
          font-family: 'Inter', sans-serif; 
          display: flex;
          flex-direction: column;
        }
        
        .breadcrumb { font-size: 11px; font-weight: 700; color: #888; margin-bottom: 25px; letter-spacing: 1px; text-transform: uppercase; }
        .breadcrumb a { color: #888; text-decoration: none; }
        .breadcrumb a:hover { color: var(--text); }
        
        .customizer-header { margin-bottom: 40px; text-align: center; }
        .customizer-title { font-size: clamp(32px, 4vw, 48px); font-weight: 900; margin: 0 0 10px 0; letter-spacing: -1px; text-transform: uppercase; }
        .customizer-subtitle { font-size: 14px; font-weight: 600; color: #888; letter-spacing: 2px; }

        .customizer-grid { 
          display: grid; 
          grid-template-columns: minmax(400px, 600px) 450px; 
          justify-content: center; 
          gap: 60px; 
          align-items: start;
        }

        .preview-display { width: 100%; position: sticky; top: 120px; }
        .main-image-container { position: relative; width: 100%; aspect-ratio: 4/5; background: rgba(128,128,128,0.03); border-radius: 8px; overflow: hidden; border: 1px solid rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center;}
        
        .color-overlay { position: absolute; inset: 0; z-index: 0; mix-blend-mode: multiply; transition: background-color 0.3s ease; }
        :global(.dark) .color-overlay { mix-blend-mode: color-burn; }
        
        .base-tshirt { object-fit: contain; padding: 20px; z-index: 10; pointer-events: none; mix-blend-mode: normal; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
        
        .design-overlay { position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center; pointer-events: none; padding-bottom: 15%; }
        .design-inner { width: 40%; height: 40%; position: relative; mix-blend-mode: normal; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2)); animation: popIn 0.3s ease forwards;}
        .design-img { object-fit: contain; }

        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .options-panel { display: flex; flex-direction: column; gap: 30px; }

        .price-block { display: flex; align-items: center; gap: 15px; }
        .current-price { font-size: 32px; font-weight: 900; }
        .discount-badge { background: var(--text); color: var(--bg); font-size: 11px; font-weight: 900; padding: 6px 10px; letter-spacing: 1px; border-radius: 4px;}
        .taxes-note { font-size: 12px; color: #888; font-weight: 600; margin-top: -20px; }

        .options-section { display: flex; flex-direction: column; gap: 12px; padding-top: 20px; border-top: 1px solid rgba(128,128,128,0.1); }
        .section-header { display: flex; justify-content: space-between; align-items: center;}
        .section-label { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #888; }
        .section-value { font-size: 12px; font-weight: 900; color: var(--text); text-transform: uppercase; background: rgba(128,128,128,0.1); padding: 4px 10px; border-radius: 4px;}

        .color-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .color-btn { width: 45px; height: 45px; border-radius: 50%; border: 2px solid rgba(128,128,128,0.2); cursor: pointer; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .color-btn:hover { transform: scale(1.1); }
        .color-btn.active { border-color: var(--text); transform: scale(1.1); box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--text); }

        .size-grid { display: flex; gap: 10px; flex-wrap: wrap; }
        .size-btn { width: 55px; height: 55px; border-radius: 6px; border: 1px solid rgba(128,128,128,0.2); background: transparent; color: var(--text); font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .size-btn:hover { border-color: var(--text); }
        .size-btn.active { background: var(--text); color: var(--bg); border-color: var(--text); }

        .category-select { width: 100%; padding: 15px; border-radius: 6px; border: 1px solid rgba(128,128,128,0.2); background: var(--bg); color: var(--text); font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 1px;}
        .category-select:focus { outline: none; border-color: var(--text); }

        .designs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .design-thumb { position: relative; width: 100%; aspect-ratio: 1; border-radius: 6px; border: 1px solid rgba(128,128,128,0.2); background: rgba(128,128,128,0.03); cursor: pointer; transition: 0.2s; overflow: hidden; }
        .design-thumb:hover { border-color: rgba(128,128,128,0.5); transform: scale(1.05); }
        .design-thumb.active { border-color: var(--text); border-width: 2px; transform: scale(1.05); }
        .design-thumb-img { object-fit: cover; padding: 4px; }

        .add-to-cart-large { width: 100%; padding: 22px; background: var(--text); color: var(--bg); border: none; border-radius: 6px; font-size: 14px; font-weight: 900; letter-spacing: 2px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.3s; margin-top: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .add-to-cart-large:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
        .add-to-cart-large:disabled { opacity: 0.5; cursor: not-allowed; }
        .add-to-cart-large.success { background: #50e3c2; color: #000; }

        @media (max-width: 1024px) {
          .customizer-grid { grid-template-columns: 1fr; gap: 40px; }
          .preview-display { position: relative; top: 0; }
          .main-image-container { min-height: 50vh; }
        }

        @media (max-width: 600px) {
          .customizer-container { padding: 90px 15px 30px; }
          .customizer-title { font-size: 28px; }
          .main-image-container { height: 50vh; }
          .designs-grid { grid-template-columns: repeat(3, 1fr); }
          .add-to-cart-large { padding: 18px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
