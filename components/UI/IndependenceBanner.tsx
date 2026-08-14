"use client";

import React from "react";

export default function IndependenceBanner() {
  return (
    <div className="independence-banner">
      <div className="marquee">
        <div className="marquee-content">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              🇮🇳 HAPPY INDEPENDENCE DAY! USE CODE <strong>FREEDOM77</strong> FOR 15% OFF! 🇮🇳
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        .independence-banner {
          background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);
          color: #000;
          padding: 8px 0;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #000;
          z-index: 1000;
          position: relative;
        }

        .marquee {
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: inline-flex;
          gap: 50px;
          animation: marquee 20s linear infinite;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1px;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
