'use client';

import React, { useState, useEffect } from 'react';

const Loader = () => {
  // 🔥 FIXED: Default to TRUE so it covers the screen immediately,
  // preventing the underlying website from flashing before the loader starts.
  const [shouldRender, setShouldRender] = useState(true);
  
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("genzonic_visited");

    if (!hasVisited) {
      // First time visiting this session -> Start animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // 🔥 FIXED: Write to sessionStorage ONLY when the animation finishes.
            // This prevents React Strict Mode from breaking the loader on the first load!
            sessionStorage.setItem("genzonic_visited", "true");
            
            setTimeout(() => setIsLoaded(true), 400); 
            setTimeout(() => setUnmount(true), 1600); 
            return 100;
          }
          return prev + 1; 
        });
      }, 35);

      return () => clearInterval(interval);
    } else {
      // Has already visited this session -> Instantly hide
      setShouldRender(false);
      setUnmount(true);
    }
  }, []);

  const waveYOffset = 300 - (progress * 3.5);

  // If unmount is true OR shouldRender is false, render absolutely nothing
  if (unmount || !shouldRender) return null;

  return (
    <>
      <style>{`
        /* BASE CSS (DESKTOP) */
        .loader-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #1a1a1a; 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999999; 
          overflow: hidden;
          transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1), opacity 1s ease-in-out;
        }

        .watermark-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 75vh; 
          max-height: 800px;
          width: auto;
          opacity: 0.03; 
          pointer-events: none;
          z-index: 0;
          object-fit: contain;
        }

        .loader-wrapper.zoom-out {
          transform: scale(25);
          opacity: 0;
          pointer-events: none;
        }

        .loader-content {
          position: relative;
          width: 95%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10; 
        }

        .wavy-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .brand-text {
          font-family: 'Unbounded', 'Helvetica Neue', Arial, sans-serif;
          font-size: 185px; 
          font-weight: 900;
          font-style: italic; 
          letter-spacing: -4px; 
        }

        .text-dark {
          fill: #3a3a3a; 
        }

        .wave-animation {
          animation: wave-flow 2.5s linear infinite;
        }

        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-1000px); }
        }

        .loader-percentage {
          width: 100%;
          text-align: right;
          padding-right: 5%;
          color: #ffffff;
          font-family: 'Unbounded', 'Helvetica Neue', Arial, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          margin-top: -10px;
        }

        /* MOBILE RESPONSIVE CSS */
        @media (max-width: 768px) {
          .loader-percentage {
            padding-right: 10%;
            font-size: 0.9rem;
            margin-top: -3vw;
          }
          
          .watermark-logo {
            height: auto; 
            width: 90vw; 
            max-height: 40vh; 
          }
        }
      `}</style>

      <div className={`loader-wrapper ${isLoaded ? 'zoom-out' : ''}`}>
        
        {/* Background Watermark */}
        <img 
          src="/bg-remove-white-okay.png" 
          alt="GenZonic Watermark" 
          className="watermark-logo" 
        />

        <div className="loader-content">
          
          <svg className="wavy-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <clipPath id="textMask">
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="brand-text">
                  GenZonic
                </text>
              </clipPath>

              <path 
                id="wavePath" 
                d="M 0 50 Q 250 100 500 50 T 1000 50 L 1000 800 L 0 800 Z" 
              />
            </defs>

            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="brand-text text-dark">
              GenZonic
            </text>

            <g clipPath="url(#textMask)">
              <g style={{ transform: `translateY(${waveYOffset}px)`, transition: 'transform 0.1s linear' }}>
                <g className="wave-animation">
                  <use href="#wavePath" x="0" y="0" fill="#ffffff" />
                  <use href="#wavePath" x="1000" y="0" fill="#ffffff" />
                </g>
              </g>
            </g>
          </svg>

          <div className="loader-percentage">
            loading... {progress} %
          </div>

        </div>
      </div>
    </>
  );
};

export default Loader;``
