"use client";

import React from "react";
import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
}

interface StepColorSizeProps {
  colors: ColorOption[];
  sizes: string[];
  selectedColor: ColorOption;
  selectedSize: string;
  onColorChange: (color: ColorOption) => void;
  onSizeChange: (size: string) => void;
}

export default function StepColorSize({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: StepColorSizeProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto py-8 px-4">
      
      {/* Select Color Section */}
      <div className="w-full mb-10">
        <h3 className="text-lg font-bold mb-6 text-center text-gray-800 tracking-wide">Select Color</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {colors.map((color) => {
            const isSelected = selectedColor.name === color.name;
            return (
              <button
                key={color.name}
                onClick={() => onColorChange(color)}
                className={`relative w-20 h-20 rounded-xl transition-all duration-200 border-2 ${
                  isSelected 
                    ? "border-[#f4c753] shadow-md scale-105" 
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 text-black">
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Size Section */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-gray-800 tracking-wide">Select Size</h3>
          <button className="text-[#3498db] text-sm font-semibold hover:underline">Size Guide</button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`w-14 h-14 flex items-center justify-center rounded-xl text-lg font-bold transition-all border-2 ${
                  isSelected
                    ? "bg-[#f4c753] border-[#f4c753] text-black shadow-md scale-105"
                    : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-500 font-medium">
          Garment: Chest (in Inch) <span className="font-bold text-gray-700">44</span> | Front Length (in Inch) <span className="font-bold text-gray-700">29.75</span> | Sleeve Length (in Inch) <span className="font-bold text-gray-700">10</span>
        </div>
      </div>
      
    </div>
  );
}
