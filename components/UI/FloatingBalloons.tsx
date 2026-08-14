"use client";

import React, { useEffect, useState } from "react";

const COLORS = ["#FF9933", "#FFFFFF", "#138808"]; // Saffron, White, Green

interface Balloon {
  id: number;
  color: string;
  left: number;
  animationDuration: number;
  delay: number;
  scale: number;
  popped?: boolean;
}

export default function FloatingBalloons() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    // Generate an initial set of balloons
    const initialBalloons = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      color: COLORS[i % 3], // Distribute colors evenly
      left: Math.random() * 100, // Random horizontal position
      animationDuration: 10 + Math.random() * 15, // Between 10s and 25s
      delay: Math.random() * 10, // Stagger start times
      scale: 0.6 + Math.random() * 0.6, // Random size
    }));

    setBalloons(initialBalloons);
  }, []);

  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Remove the balloon from the DOM after the animation completes
    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== id));
    }, 150);
  };

  if (balloons.length === 0) return null;

  return (
    <div className="balloon-container">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon-wrapper"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.animationDuration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div
            className={`balloon ${b.popped ? "popped" : ""}`}
            onClick={() => !b.popped && popBalloon(b.id)}
            style={{
              backgroundColor: b.color,
              transform: b.popped ? `scale(${b.scale * 2.5})` : `scale(${b.scale})`,
              opacity: b.popped ? 0 : b.color === "#FFFFFF" ? 0.9 : 0.8,
              boxShadow:
                b.color === "#FFFFFF"
                  ? "inset -5px -5px 15px rgba(0,0,0,0.1)"
                  : "inset -5px -5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <div className="string"></div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .balloon-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          pointer-events: none; /* Let clicks pass through */
          z-index: 50; /* Above most content, below modals */
        }

        .balloon-wrapper {
          position: absolute;
          bottom: -150px;
          animation: floatUp linear infinite;
        }

        .balloon {
          width: 60px;
          height: 75px;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          position: relative;
          pointer-events: auto;
          cursor: crosshair;
          transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        }

        .balloon.popped {
          pointer-events: none;
        }

        .balloon.popped .string,
        .balloon.popped::before {
          display: none;
        }

        .balloon::before {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 10px;
          background-color: inherit;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .string {
          position: absolute;
          bottom: -60px;
          left: 50%;
          width: 1px;
          height: 60px;
          background: rgba(255, 255, 255, 0.4);
          transform-origin: top center;
          animation: sway 3s ease-in-out infinite alternate;
        }

        @keyframes floatUp {
          0% {
            bottom: -150px;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            bottom: 110vh;
            transform: translateY(-110vh) rotate(15deg);
          }
        }

        @keyframes sway {
          0% {
            transform: rotate(-5deg);
          }
          100% {
            transform: rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
