"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

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

  const addToCart = useCartStore((state) => state.addToCart);

  const filteredDesigns = DESIGNS.filter((d) => d.categoryId === selectedCategory);

  const handleAddToCart = () => {
    if (!selectedDesign) {
      alert("Please select a design first!");
      return;
    }

    const designObj = DESIGNS.find(d => d.url === selectedDesign);

    addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom ${designObj?.name || 'T-Shirt'}`,
      price: 999,
      image: selectedDesign,
      size: selectedSize,
      stock: 100, // Generous stock for made-to-order
    });

    alert("Custom T-Shirt added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 tracking-tight">
            Design Your Own Vibe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your canvas, pick your aesthetic, and wear your art. Premium DTF prints on high-quality fabrics.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: T-Shirt Preview */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-start">
            <div className="sticky top-28 w-full max-w-md aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative shadow-2xl ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
              
              {/* Base T-Shirt Image with Color Overlay via CSS */}
              <div 
                className="absolute inset-0 z-0 transition-colors duration-500 ease-in-out mix-blend-multiply dark:mix-blend-color-burn" 
                style={{ backgroundColor: selectedColor.hex }}
              ></div>
              
              <Image 
                src="/products/tshirt-1-removebg-preview.png"
                alt="Blank T-Shirt"
                width={500}
                height={500}
                className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-xl p-4 mix-blend-overlay"
              />

              {/* Design Overlay */}
              {selectedDesign && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pb-[15%]">
                   <div className="w-[45%] h-[45%] relative animate-in zoom-in duration-300 drop-shadow-2xl opacity-90 mix-blend-normal">
                     <Image
                        src={selectedDesign}
                        alt="Selected Design"
                        fill
                        className="object-contain"
                     />
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customization Options */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
            
            {/* Price */}
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Base Price</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹999</p>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                1. Select Color
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{selectedColor.name}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {TSHIRT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 focus:outline-none transition-all shadow-sm ${
                      selectedColor.name === color.name ? "border-blue-600 scale-110 shadow-md ring-2 ring-blue-600/20" : "border-gray-200 dark:border-gray-600 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Choose Aesthetic</h3>
              <div className="relative">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none font-medium cursor-pointer shadow-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Design Grid */}
            <div>
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">4. Pick a Design</h3>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                 {filteredDesigns.map(design => (
                   <button
                     key={design.id}
                     onClick={() => setSelectedDesign(design.url)}
                     className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group bg-white ${
                       selectedDesign === design.url ? "border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-105" : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                     }`}
                   >
                     <Image 
                       src={design.url} 
                       alt={design.name} 
                       fill 
                       className="object-cover p-2 group-hover:scale-110 transition-transform duration-300"
                     />
                   </button>
                 ))}
               </div>
            </div>

            {/* Action Area */}
            <div className="mt-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleAddToCart}
                disabled={!selectedDesign}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedDesign 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/40 hover:-translate-y-1" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedDesign ? "Add to Cart - ₹999" : "Select a Design"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
