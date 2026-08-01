"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Type, Upload, Image as ImageIcon, RefreshCw, X } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
}

interface DesignElement {
  id: string;
  type: "text" | "image";
  content: string; // text string or image src
  x: number;
  y: number;
}

interface StepDesignProps {
  selectedColor: ColorOption;
  designs: DesignElement[];
  setDesigns: React.Dispatch<React.SetStateAction<DesignElement[]>>;
}

export default function StepDesign({ selectedColor, designs, setDesigns }: StepDesignProps) {
  const [activeTab, setActiveTab] = useState<"text" | "upload" | "gallery" | null>(null);
  const [inputText, setInputText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddText = () => {
    if (!inputText.trim()) return;
    const newDesign: DesignElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: inputText,
      x: 0,
      y: 0,
    };
    setDesigns([...designs, newDesign]);
    setInputText("");
    setActiveTab(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const newDesign: DesignElement = {
          id: `img-${Date.now()}`,
          type: "image",
          content: event.target.result,
          x: 0,
          y: 0,
        };
        setDesigns([...designs, newDesign]);
      }
    };
    reader.readAsDataURL(file);
    setActiveTab(null);
  };

  const removeDesign = (id: string) => {
    setDesigns(designs.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pb-24">
      
      {/* T-Shirt Canvas Area */}
      <div className="relative w-full max-w-lg mx-auto bg-[#e5dfce] rounded-xl overflow-hidden mb-8 aspect-[4/5] flex items-center justify-center">
        
        {/* Flip Button */}
        <button className="absolute top-4 right-4 z-50 bg-white/50 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center hover:bg-white/80 transition shadow-sm border border-black/10">
          <RefreshCw size={24} className="mb-1" />
          <span className="text-xs font-bold">Flip</span>
        </button>

        {/* Base T-Shirt */}
        <div 
          className="absolute inset-0 z-0 mix-blend-multiply transition-colors duration-300"
          style={{ backgroundColor: selectedColor.name === 'White' ? 'transparent' : selectedColor.hex }}
        />
        
        {/* Need a blank t-shirt image for the base. Assuming one exists or we just use CSS shape for now if not. 
            Since we saw /products/tshirt-1-removebg-preview.png in the original page, we will use it. */}
        <Image 
          src="/products/tshirt-1-removebg-preview.png"
          alt="Blank T-Shirt"
          fill
          className="object-contain p-4 z-10 pointer-events-none drop-shadow-xl"
        />

        {/* Printable Area (Bounding Box) */}
        <div 
          ref={containerRef}
          className="absolute z-20 w-[45%] h-[55%] border-2 border-dashed border-gray-400/50 mt-[5%]"
        >
          {/* Draggable Designs */}
          {designs.map((design) => (
            <motion.div
              key={design.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0}
              dragMomentum={false}
              className="absolute cursor-move group"
              style={{ x: design.x, y: design.y }}
            >
              {/* Delete Button (visible on hover) */}
              <button 
                onClick={() => removeDesign(design.id)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md"
              >
                <X size={14} />
              </button>

              {design.type === "text" ? (
                <div className="text-3xl font-black text-black whitespace-pre-wrap px-2 py-1 select-none font-sans drop-shadow-sm">
                  {design.content}
                </div>
              ) : (
                <div className="relative w-32 h-32 select-none pointer-events-none">
                  <Image 
                    src={design.content} 
                    alt="Uploaded Design" 
                    fill 
                    className="object-contain drop-shadow-md"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toolbar Options (if a tab is active) */}
      {activeTab === 'text' && (
        <div className="w-full max-w-lg bg-white p-4 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-x border-gray-100 flex gap-2">
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Enter your text..." 
             className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black font-semibold"
             autoFocus
           />
           <button 
             onClick={handleAddText}
             className="bg-[#449e89] hover:bg-[#347d6c] text-white px-6 py-3 rounded-lg font-bold transition-colors"
           >
             Add
           </button>
           <button onClick={() => setActiveTab(null)} className="p-3 text-gray-500 hover:text-black">
             <X size={20} />
           </button>
        </div>
      )}

      {/* Main Bottom Toolbar */}
      <div className="w-full max-w-lg bg-white shadow-[0_-5px_30px_rgba(0,0,0,0.05)] flex border border-gray-100 divide-x divide-gray-100 rounded-lg overflow-hidden">
        
        <button 
          onClick={() => setActiveTab(activeTab === 'text' ? null : 'text')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors ${activeTab === 'text' ? 'bg-gray-50 text-[#449e89]' : 'text-gray-700'}`}
        >
          <Type size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">Add Text</span>
        </button>
        
        <label className="flex-1 py-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors text-gray-700">
          <Upload size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </label>
        
        <button className="flex-1 py-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-700">
          <ImageIcon size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">Gallery</span>
        </button>

      </div>
      
    </div>
  );
}
