"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useTheme } from "@/app/context/ThemeContext"

export default function Hero() {
  const heroRef = useRef(null)
  const charRef = useRef(null)
  const pulseRef = useRef(null)
  const watermarkRef = useRef(null)
  const glowRef = useRef(null)
  const { theme } = useTheme()
  const darkMode = theme === "dark"

  const images = {
    dark: [
      "/hero/white-tshirt-gorila-removebg-preview.png",
      "/hero/beige-tshirt-gorila-removebg-preview.png",
      "/hero/black-tshirt-gorilaa-removebg-preview.png",
      "/hero/cofeeee-tshirt-gorila-removebg-preview.png",
      "/hero/mustard-tshirt-gorila-removebg-preview.png",
      "/hero/Navy-Millange-tshirt-gorila-removebg-preview.png",
      "/hero/Olive-tshirt-gorila-removebg-preview.png",
      "/hero/purple-tshirt-gorila-removebg-preview.png",
      "/hero/airforce-tshirt-gorila-removebg-preview.png",
      "/hero/winee-tshirt-gorila-removebg-preview.png",
    ],
    light: [
      "/hero/mustard-tshirt-gorila-removebg-preview.png",
      "/hero/black-tshirt-gorilaa-removebg-preview.png",
      "/hero/white-tshirt-gorila-removebg-preview.png",
      "/hero/beige-tshirt-gorila-removebg-preview.png",
      "/hero/cofeeee-tshirt-gorila-removebg-preview.png",
      "/hero/Navy-Millange-tshirt-gorila-removebg-preview.png",
      "/hero/Olive-tshirt-gorila-removebg-preview.png",
      "/hero/purple-tshirt-gorila-removebg-preview.png",
      "/hero/airforce-tshirt-gorila-removebg-preview.png",
      "/hero/winee-tshirt-gorila-removebg-preview.png",
    ]
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const activeImages = darkMode ? images.dark : images.light
  const currentImage = activeImages[currentIndex % activeImages.length]

  const handleImageHover = () => {
    const tl = gsap.timeline()

    tl.to(charRef.current, {
      scale: 0.92,
      filter: "blur(8px) brightness(1.2)",
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setCurrentIndex((prev) => prev + 1)
    })
    .to(charRef.current, {
      scale: 1,
      filter: "blur(0px) brightness(1)",
      opacity: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.7)"
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {            
      const tl = gsap.timeline()

      // Unified Entrance Animations for Desktop & Mobile
      tl.from(".cyber-grid", { opacity: 0, duration: 2, ease: "power2.inOut" })
        .from(".main-title-text, .editorial-title", { y: -30, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1.5")
        .from(charRef.current, { y: 50, scale: 1.1, opacity: 0, filter: "blur(20px)", duration: 1.5, ease: "expo.out" }, "-=1.5")
        .from(".reveal-text, .bottom-content", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1")

      // Continuous Floating Animation for the Gorilla
      gsap.to(charRef.current, {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      
      gsap.to(pulseRef.current, {
        scale: 2.2,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        ease: "sine.out"
      })

    }, heroRef)

    return () => ctx.revert()
  }, [darkMode])

  return (
    <section 
      className="hero-section" 
      ref={heroRef}
      style={{
        background: darkMode ? "#0a0a0a" : "#fdfdfd", 
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      
      {/* Background Ambience (Desktop & Mobile) */}
      <div className="noise-overlay" />
      <div ref={glowRef} className="ambient-glow" />
      <div className="cyber-grid" />
      <div ref={watermarkRef} className="bg-watermark" style={{ color: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
        GenZonic
      </div>  

      {/* =========================================
          DESKTOP ONLY: LEFT EDITORIAL
          ========================================= */}
      <div className="editorial-side left-side hide-mobile">
        <div className="tech-label reveal-text">SERIES_01 // CORE COLLECTION</div>
        <h2 className="editorial-title reveal-text">THE NEW <br/> STANDARD</h2>
        <p className="editorial-desc reveal-text">
          Experience our signature silhouettes. Hover over the subject to cycle through the available premium colorways.
        </p>

        <div className="reveal-text mt-5">
          {/* UPDATED SHOP NOW BUTTON - REDIRECTS TO MENS PAGE */}
          <Link href="/shop/men" className="solid-black-btn">
            SHOP NOW
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* =========================================
          MOBILE ONLY: TOP TITLE
          ========================================= */}
      <div className="top-title-container z-20 relative hide-desktop">
        {/* Title kept clean and hidden initially to not crowd space */}
      </div>

      {/* =========================================
          CENTER: VISUAL COMPOSITION
          ========================================= */}
      <div className="visuals-container z-10">
        
        {/* Interactive 3D Gorilla (Visible on Both Desktop & Mobile) */}
        <div 
          className="gorilla-layer"
          ref={charRef}
          onMouseEnter={handleImageHover} 
          onClick={handleImageHover} 
        >
          <div ref={pulseRef} className="click-pulse hide-mobile" />
          
          <Image 
            src={currentImage} 
            alt="GenZonic Subject"
            width={1000}
            height={1000}
            priority
            className="hero-gorilla-image"
          />

          {/* Text overlay matched to mockup */}
          <div className="tap-indicator">
            <div className="arrow-wrapper">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={darkMode ? "#ffffff" : "#000000"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <span className="tap-text text-[10px] font-black tracking-[4px] mt-2 text-center" style={{color: darkMode ? "#ffffff" : "#000000"}}>
              <span className="hide-mobile">HOVER TO CYCLE</span>
              <span className="hide-desktop">TAP<br/>TO CYCLE</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          DESKTOP ONLY: RIGHT EDITORIAL
          ========================================= */}
      <div className="editorial-side right-side hide-mobile">
        <div className="tech-label reveal-text">ENGINEERED AESTHETICS</div>
        <div className="tier-block reveal-text">
          <h3>STREETWEAR <br/> REDEFINED</h3>
          <ul className="spec-list">
            <li>Heavyweight 240GSM Cotton</li>
            <li>Signature Drop-Shoulder Fit</li>
            <li>High-Density Puff Print</li>
            <li>Pre-shrunk & Bio-washed</li>
          </ul>
          <p className="bold-statement"><strong>Built for the bold.</strong></p>
        </div>
        {/* Removed extra button here to keep the CTA unified */}
      </div>

      {/* =========================================
          MOBILE ONLY: BOTTOM CONTENT & CTA
          ========================================= */}
      <div className="bottom-content-container z-20 relative hide-desktop">
        <h3 className="bottom-content subtitle-text" style={{ color: darkMode ? "#fff" : "#000" }}>STREETWEAR REDEFINED</h3>
        
        {/* UPDATED SHOP NOW BUTTON - REDIRECTS TO MENS PAGE */}
        <Link href="/shop/men" className="bottom-content solid-black-btn w-full">
          SHOP NOW
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* =========================================
          CSS STYLES
          ========================================= */}
      <style jsx>{`
        /* --- LAYOUT FUNDAMENTALS --- */
        .hero-section {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          padding: 0 5%;
        }

        .bg-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(100px, 24vw, 400px);
          font-weight: 900;
          letter-spacing: -0.04em;
          white-space: nowrap;
          z-index: 1;
          pointer-events: none;
          text-transform: uppercase;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: ${darkMode ? "0.03" : "0.04"};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, ${darkMode ? "rgba(255, 62, 0, 0.12)" : "rgba(255, 62, 0, 0.08)"} 0%, transparent 50%);
          z-index: 0;
          pointer-events: none;
        }

        .cyber-grid {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-size: 100px 100px;
          background-image: 
            linear-gradient(to right, ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"} 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }

        /* --- DESKTOP EDITORIAL SECTIONS --- */
        .editorial-side {
          z-index: 12;
          width: 320px;
          display: flex;
          flex-direction: column;
        }
        
        .left-side { align-items: flex-start; text-align: left; }
        .right-side { align-items: flex-end; text-align: right; }

        .tech-label { font-size: 12px; letter-spacing: 4px; font-weight: 900; opacity: 0.6; margin-bottom: 25px; text-transform: uppercase; }
        .editorial-title { font-size: clamp(36px, 4vw, 48px); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.03em; text-transform: uppercase; }
        .editorial-desc { font-size: 15px; line-height: 1.6; opacity: 0.7; font-weight: 500; margin-bottom: 20px; }

        .tier-block { margin-bottom: 10px; }
        .tier-block h3 { font-size: clamp(26px, 2.5vw, 32px); font-weight: 900; line-height: 1.1; margin-bottom: 15px; letter-spacing: -0.02em; text-transform: uppercase; }
        .spec-list { list-style: none; padding: 0; margin: 0 0 15px 0; font-size: 14px; opacity: 0.85; line-height: 1.8; font-weight: 500; }
        .spec-list li { margin-bottom: 4px; }
        .bold-statement { font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

        /* --- VISUALS CONTAINER (DESKTOP) --- */
        .visuals-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        .gorilla-layer {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 68%; /* Desktop height constraint */
          max-width: 420px; 
          display: flex;
          justify-content: center;
          align-items: flex-end;
          pointer-events: auto; 
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          z-index: 5;
        }

        .hero-gorilla-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: bottom; 
          transition: filter 0.3s ease;
        }

        .click-pulse { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; border: 1px solid ${darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}; border-radius: 50%; pointer-events: none; }

        .tap-indicator {
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.3s ease;
        }
        .gorilla-layer:hover .tap-indicator { opacity: 1; }
        .arrow-wrapper { animation: arrowSlide 2s infinite ease-in-out; }
        @keyframes arrowSlide { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }

        /* --- BUTTONS --- */
        .solid-black-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${darkMode ? "#ffffff" : "#000000"};
          color: ${darkMode ? "#000000" : "#ffffff"};
          padding: 18px 48px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          max-width: 380px; 
          border-radius: 4px;
        }

        .solid-black-btn:active { transform: translateY(1px); }

        .mt-5 { margin-top: 1.5rem; }

        /* --- MOBILE TYPOGRAPHY --- */
        .top-title-container {
          text-align: center;
          margin-bottom: -15px; 
        }
        .main-title-text {
          font-size: clamp(40px, 12vw, 80px); 
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }
        .subtitle-text {
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* --- RESPONSIVE TOGGLES --- */
        .hide-desktop { display: none !important; }
        .hide-mobile { display: flex; } 

        /* =========================================
           MOBILE LAYOUT - DYNAMIC & RESPONSIVE
           ========================================= */
        @media (max-width: 1024px) {
          .hide-desktop { display: flex !important; }
          .hide-mobile { display: none !important; }
          
          .top-title-container.hide-desktop { display: block !important; } 
          
          .hero-section {
            height: 100dvh; /* Exact viewport height for seamless framing */
            min-height: 600px; /* Safeguard for incredibly tiny screens */
            flex-direction: column;
            justify-content: space-between;
            padding: 12vh 0 4vh 0; /* Proportional top/bottom spacing */
          }

          /* --- DYNAMIC MIDDLE VISUAL --- */
          .visuals-container {
            position: relative; 
            width: 100%;
            flex: 1 1 0; /* Automatically consumes all available free space between title and button */
            display: flex;
            justify-content: center;
            align-items: flex-end; /* Gorilla stays anchored to the bottom */
            margin: 0;
            overflow: visible; /* Prevents Gorilla clipping */
          }
          
          .gorilla-layer {
            position: absolute;
            height: 100%; /* Fully stretches to fill visuals-container */
            max-height: 50vh; /* Prevents overflow into text areas */
            width: 100%;
            max-width: 90vw; /* Scales neatly on all phone widths */
            bottom: 0; 
            left: 50%;
            transform: translateX(-50%);
          }

          .hero-gorilla-image {
            transform: scale(1.1); /* Subtle pop */
            transform-origin: bottom center;
            object-fit: contain;
            object-position: bottom center;
          }
          
          .tap-indicator {
            top: 55%; 
          }
          
          /* --- CLEAN CENTERED CTA --- */
          .bottom-content-container { 
            flex-shrink: 0; /* Prevents crushing */
            width: 100%; 
            display: flex; 
            flex-direction: column;
            align-items: center; /* Centers the button neatly since models are gone */
            gap: 15px;
            z-index: 20;
            padding: 0 5%; 
          }

          .subtitle-text {
            width: 100%;
            text-align: center;
            margin-bottom: 0;
          }

          .solid-black-btn { 
            width: 100%; 
            max-width: 320px; 
            padding: 18px 20px; 
            font-size: 13px;
            justify-content: center !important;
          }
          
          .bg-watermark { top: 40% !important; font-size: 28vw !important; }
        }
      `}</style>
    </section>
  )
}