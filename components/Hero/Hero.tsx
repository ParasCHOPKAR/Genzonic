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
      "/hero/black-tshirt-gorilaa-removebg-preview.png",
      "/hero/white-tshirt-gorila-removebg-preview.png",
      "/hero/beige-tshirt-gorila-removebg-preview.png",
      "/hero/cofeeee-tshirt-gorila-removebg-preview.png",
      "/hero/mustard-tshirt-gorila-removebg-preview.png",
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
      filter: "blur(12px) brightness(1.5)",
      opacity: 0.6,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setCurrentIndex((prev) => prev + 1)
    })
    .to(charRef.current, {
      scale: 1,
      filter: "blur(0px) brightness(1)",
      opacity: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.7)"
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {            
      const tl = gsap.timeline()

      tl.from(".cyber-grid", { opacity: 0, duration: 2, ease: "power2.inOut" })
        .from(".ambient-glow", { opacity: 0, scale: 0.5, duration: 3, ease: "power2.out" }, "-=1.5")
        .from(watermarkRef.current, { opacity: 0, scale: 0.85, duration: 2.5, ease: "expo.out" }, "-=2")
        .from(".reveal-text", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=2")
        .from(charRef.current, { scale: 1.1, filter: "blur(20px)", opacity: 0, y: 60, duration: 2, ease: "expo.out" }, "-=1.8")

      gsap.to(pulseRef.current, {
        scale: 2.2,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        ease: "sine.out"
      })

      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to(charRef.current, {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to(watermarkRef.current, {
        scale: 1.05,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none"
      })

    }, heroRef)

    return () => ctx.revert()
  }, [darkMode])

  return (
    <section 
      className="hero-section" 
      ref={heroRef}
      style={{
        background: darkMode ? "#050505" : "#fdfdfd", 
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      
      <div className="noise-overlay" />
      <div ref={glowRef} className="ambient-glow" />
      <div className="cyber-grid" />

      <div 
        ref={watermarkRef} 
        className="bg-watermark" 
        style={{ color: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
      >
        GenZonic
      </div>  

      {/* =========================================
          LEFT SIDE: Brand Intro 
          ========================================= */}
      <div className="editorial-side left-side">
        <div className="tech-label reveal-text hide-mobile">SERIES_01 // CORE COLLECTION</div>
        
        {/* Adjusted mobile title spacing */}
        <h2 className="editorial-title reveal-text">THE NEW <br className="desktop-br"/> STANDARD</h2>
        
        {/* Paragraph hidden on mobile for cleaner UI */}
        <p className="editorial-desc reveal-text hide-mobile">
          Experience our signature silhouettes. Hover over the subject to cycle through the available premium colorways.
        </p>

        {/* Desktop Premium CTA (Hidden on Mobile) */}
        <div className="reveal-text hide-mobile mt-5">
          <Link href="/premium-collection" className="premium-orange-btn">
            SHOP PREMIUM
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* =========================================
          CENTER CHARACTER (HOVERABLE / CLICKABLE) 
          ========================================= */}
      <div 
        className="character-container" 
        ref={charRef}
        onMouseEnter={handleImageHover} 
        onClick={handleImageHover} 
      >
        <div ref={pulseRef} className="click-pulse" />

        <Image 
          src={currentImage} 
          alt="GenZonic Subject"
          width={1000}
          height={1000}
          priority
          className="hero-image"
        />

        <div className="tap-indicator">
          <div className="arrow-wrapper">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <span className="tap-text"><span className="hide-mobile">HOVER</span><span className="hide-desktop">TAP</span> TO CYCLE</span>
        </div>
      </div>

      {/* =========================================
          RIGHT SIDE: Technical Content & Mobile CTA 
          ========================================= */}
      <div className="editorial-side right-side">
        <div className="tech-label reveal-text hide-mobile">ENGINEERED AESTHETICS</div>
        
        <div className="tier-block reveal-text">
          <h3 className="mobile-bottom-title">STREETWEAR <br className="hide-mobile" /> REDEFINED</h3>
          
          {/* List & Text completely hidden on mobile! */}
          <ul className="spec-list hide-mobile">
            <li>Heavyweight 240GSM Cotton</li>
            <li>Signature Drop-Shoulder Fit</li>
            <li>High-Density Puff Print</li>
            <li>Pre-shrunk & Bio-washed</li>
          </ul>
          <p className="bold-statement hide-mobile"><strong>Built for the bold.</strong></p>
        </div>

        {/* Desktop Men's CTA (Hidden on Mobile) */}
        <div className="reveal-text hide-mobile mt-5">
          <Link href="/shop/men" className="premium-orange-btn secondary-btn">
            SHOP MEN'S
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* 🔥 MOBILE ONLY CTA 🔥 
            (Placed exactly below STREETWEAR REDEFINED) */}
        <div className="reveal-text hide-desktop mobile-cta-wrapper">
          <Link href="/premium-collection" className="premium-orange-btn mobile-full-btn">
            SHOP PREMIUM
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* SCROLL HINT */}
      <div className="scroll-hint-modern reveal-text hide-mobile">
        <span>DISCOVER MORE</span>
        <div className="line"></div>
      </div>

      {/* =========================================
          BULLETPROOF CSS STYLING
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
          z-index: 3;
          pointer-events: none;
          opacity: ${darkMode ? "0.04" : "0.05"};
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

        /* --- EDITORIAL SECTIONS (DESKTOP) --- */
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
        .bold-statement { font-size: 16px; color: ${darkMode ? '#fff' : '#000'}; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

        /* =========================================================
           🔥 CUSTOM BUTTON CSS (ORANGE BOX) 🔥
           ========================================================= */
        .premium-orange-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #FF4500; 
          color: #ffffff !important;
          padding: 20px 42px; 
          border-radius: 4px; 
          font-family: inherit;
          font-weight: 900;
          font-size: 14px; 
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(255, 69, 0, 0.35); 
          border: 1px solid #FF4500;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
        }

        .premium-orange-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(255, 69, 0, 0.5);
          background-color: #E63E00; 
          border-color: #E63E00;
        }

        /* Secondary Button Style for Men's CTA */
        .secondary-btn {
          background-color: ${darkMode ? "#ffffff" : "#000000"};
          color: ${darkMode ? "#000000" : "#ffffff"} !important;
          border-color: ${darkMode ? "#ffffff" : "#000000"};
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .secondary-btn:hover {
          background-color: transparent;
          color: ${darkMode ? "#ffffff" : "#000000"} !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .mt-5 { margin-top: 1.5rem; }

        /* --- CHARACTER & INTERACTION --- */
        .character-container {
          position: absolute;
          top: 15%;      
          bottom: 15%;   
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 35vw;   
          z-index: 10;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center; 
          z-index: 5;
          transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .click-pulse { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; border: 1px solid ${darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}; border-radius: 50%; pointer-events: none; }

        .tap-indicator { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 15; pointer-events: none; opacity: 0.5; transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .arrow-wrapper { animation: arrowBounce 2s infinite ease-in-out; }
        .tap-text { font-size: 9px; font-weight: 900; letter-spacing: 4px; white-space: nowrap; text-transform: uppercase; }

        .character-container:hover .tap-indicator, 
        .character-container:active .tap-indicator { opacity: 1; transform: translate(-50%, -60%); }
        .character-container:hover .hero-image { filter: drop-shadow(0 0 50px ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}); }

        @keyframes arrowBounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }

        /* --- SCROLL HINT --- */
        .scroll-hint-modern { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 15px; opacity: 0.6; z-index: 10; }
        .scroll-hint-modern span { font-size: 10px; letter-spacing: 3px; font-weight: 800; }
        .scroll-hint-modern .line { width: 1px; height: 40px; background: currentColor; animation: pulseLine 2s infinite cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes pulseLine { 0%, 100% { transform: scaleY(1); transform-origin: bottom; opacity: 1; } 50% { transform: scaleY(0.2); transform-origin: bottom; opacity: 0.3; } }

        /* --- DESKTOP/MOBILE VISIBILITY HELPERS --- */
        .hide-desktop { display: none !important; }

        /* ================= 🔥 PERFECTED CLEAN MOBILE VIEW 🔥 ================= */
        @media (max-width: 1024px) {
          .hero-section {
            height: auto;
            min-height: 100dvh; 
            flex-direction: column;
            justify-content: center; /* Center everything vertically */
            gap: 2rem; /* Add strict spacing to prevent overlapping */
            padding-top: 100px; 
            padding-bottom: 50px;
          }

          .editorial-side {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 5%;
          }
          
          /* Flow 1: Top Headline */
          .left-side { order: 1; margin-bottom: 0; }
          
          /* Flow 2: Centered Image */
          .character-container { 
            order: 2; 
            position: relative !important; 
            top: auto !important; 
            bottom: auto !important; 
            left: auto !important; 
            transform: none !important;
            width: 100% !important; 
            height: 40vh !important; /* Controlled height */
            min-height: 350px; /* Force minimum space so it doesn't shrink and bleed out */
            margin: 0 !important; /* Rely on gap for spacing */
          }
          
          /* Flow 3: Bottom Headline & Single Button */
          .right-side { order: 3; }

          /* Button styling to span cleanly below text */
          .mobile-cta-wrapper { 
            width: 100%; 
            display: flex; 
            justify-content: center; 
            margin-top: 15px; 
          }
          .mobile-full-btn { 
            width: 100%; 
            max-width: 320px; 
            padding: 20px 20px; 
          }
          
          /* Hide all text and secondary buttons */
          .hide-mobile { display: none !important; }
          .desktop-br { display: none !important; }
          .hide-desktop { display: flex !important; } 
          
          .hero-image { 
            height: 100% !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            object-position: center !important; 
            transform: scale(0.9); /* Adds breathing room around the image */
          }
          
          .bg-watermark { top: 40% !important; font-size: 28vw !important; }
        }

        @media (max-width: 600px) {
          .editorial-title { font-size: clamp(34px, 12vw, 44px) !important; margin-bottom: 0; line-height: 1.2 !important; padding: 0 10px; }
          .mobile-bottom-title { font-size: clamp(28px, 10vw, 36px) !important; margin-bottom: 10px; line-height: 1.2 !important; padding: 0 10px; }
          .character-container { 
            height: 38vh !important; 
            min-height: 320px; 
          }
        }
      `}</style>
    </section>
  )
}