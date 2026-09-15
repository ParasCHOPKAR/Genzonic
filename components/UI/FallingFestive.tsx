"use client";
import React, { useEffect, useState } from 'react';

const ELEMENTS = ['🌺', '🌸', '🌼'];

export default function FallingFestive() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial items after component mounts (client-side only to prevent hydration mismatch)
    const generateItems = () => {
      const newItems = Array.from({ length: 7 }).map((_, i) => {
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
          {item.type}
        </div>
      ))}
    </div>
  );
}
