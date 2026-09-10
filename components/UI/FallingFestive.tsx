"use client";
import React, { useEffect, useState } from 'react';

const ModakSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Base shape of modak */}
    <path 
      d="M 50 15 C 20 50, 15 90, 50 90 C 85 90, 80 50, 50 15 Z" 
      fill="#FFD700" 
      stroke="#E67E22" 
      strokeWidth="3" 
    />
    {/* Inner fold lines */}
    <path d="M 50 15 C 35 50, 35 90, 50 90" fill="transparent" stroke="#E67E22" strokeWidth="2" />
    <path d="M 50 15 C 65 50, 65 90, 50 90" fill="transparent" stroke="#E67E22" strokeWidth="2" />
    <path d="M 50 15 C 50 50, 50 90, 50 90" fill="transparent" stroke="#E67E22" strokeWidth="2" />
  </svg>
);

const ELEMENTS = ['🌺', '🌸', '🌼', 'modak', 'modak'];

export default function FallingFestive() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial items after component mounts (client-side only to prevent hydration mismatch)
    const generateItems = () => {
      const newItems = Array.from({ length: 15 }).map((_, i) => {
        const type = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
        return {
          id: i,
          type,
          left: Math.random() * 100, // random x position 0-100%
          animationDuration: Math.random() * 6 + 6, // 6s to 12s
          animationDelay: Math.random() * 5, // 0 to 5s delay
          size: Math.random() * 15 + 20, // 20px to 35px
          rotation: Math.random() > 0.5 ? 1 : -1, // CW or CCW rotation
        };
      });
      setItems(newItems);
    };

    generateItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fallAndRotate1 {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fallAndRotate2 {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(-360deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-60px',
            fontSize: `${item.size}px`,
            animation: `${item.rotation === 1 ? 'fallAndRotate1' : 'fallAndRotate2'} ${item.animationDuration}s linear ${item.animationDelay}s infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
          }}
        >
          {item.type === 'modak' ? <ModakSVG size={item.size} /> : item.type}
        </div>
      ))}
    </div>
  );
}
