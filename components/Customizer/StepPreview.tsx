"use client";

import React from "react";
import Image from "next/image";

interface ColorOption {
  name: string;
  hex: string;
}

interface DesignElement {
  id: string;
  type: "text" | "image";
  content: string;
  x: number;
  y: number;
}

interface StepPreviewProps {
  selectedColor: ColorOption;
  selectedSize: string;
  designs: DesignElement[];
}

export default function StepPreview({ selectedColor, selectedSize, designs }: StepPreviewProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-8">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Your Masterpiece</h2>
        <p className="text-gray-500 font-medium">Review your custom design before adding to cart.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 w-full justify-center items-start">
        
        {/* Preview Canvas (Static) */}
        <div className="relative w-full max-w-sm aspect-[4/5] bg-[#e5dfce] rounded-xl overflow-hidden shadow-lg border border-black/5">
          <div 
            className="absolute inset-0 z-0 mix-blend-multiply"
            style={{ backgroundColor: selectedColor.name === 'White' ? 'transparent' : selectedColor.hex }}
          />
          <Image 
            src="/products/tshirt-1-removebg-preview.png"
            alt="Preview T-Shirt"
            fill
            className="object-contain p-4 z-10 pointer-events-none drop-shadow-xl"
          />
          
          <div className="absolute z-20 w-[45%] h-[55%] border border-transparent mt-[5%] left-[27.5%]">
            {designs.map((design) => (
              <div
                key={design.id}
                className="absolute"
                style={{ transform: `translate(${design.x}px, ${design.y}px)` }}
              >
                {design.type === "text" ? (
                  <div className="text-3xl font-black text-black whitespace-pre-wrap px-2 py-1 select-none font-sans drop-shadow-sm leading-none">
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
              </div>
            ))}
          </div>
        </div>

        {/* Summary Details */}
        <div className="flex flex-col gap-6 w-full max-w-sm bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold border-b pb-4">Order Summary</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Product</span>
            <span className="font-bold text-gray-900">Custom T-Shirt</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Color</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{selectedColor.name}</span>
              <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor.hex }} />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Size</span>
            <span className="font-bold text-gray-900">{selectedSize}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Design Elements</span>
            <span className="font-bold text-gray-900">{designs.length} added</span>
          </div>

          <div className="border-t pt-4 mt-2 flex justify-between items-center">
            <span className="text-lg text-gray-800 font-bold">Total Price</span>
            <span className="text-2xl font-black text-[#f4c753]">₹999</span>
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-2 font-medium">
            Inclusive of all taxes & printing costs.
          </p>
        </div>

      </div>
    </div>
  );
}
