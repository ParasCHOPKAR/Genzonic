"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useTheme } from "@/app/context/ThemeContext"

export default function Hero() {
  const heroRef = useRef(null)
  const charRef = useRef(null)
  const bgRef = useRef(null)
  const pulseRef = useRef(null)
  const watermarkRef = useRef(null)
  const glowRef = useRef(null)
  const { theme } = useTheme()
  const darkMode = theme === "dark"

  // --------------------------------------------------------
  // ⚠️ MOBILE ONLY BACKGROUND IMAGE
  // --------------------------------------------------------
  const mobileBgImage = "/hero/my_primium-photo-mobile-view.png"

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

      tl.from(".cyber-grid", { opacity: 0, duration: 2, ease: "power2.inOut" })
        .from(".main-title-text, .editorial-title", { y: -30, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1.5")
        .from(bgRef.current, { opacity: 0, scale: 1.05, duration: 2, ease: "power2.out" }, "-=1.5")
        .from(charRef.current, { y: 50, scale: 1.1, opacity: 0, filter: "blur(20px)", duration: 1.5, ease: "expo.out" }, "-=1.5")
        .from(".reveal-text, .bottom-content", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1")

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
        background: darkMode ? "#0a0a0a" : "#f5f5f5", 
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      
      {/* Background Ambience */}
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
          <Link href="/premium-collection" className="solid-black-btn">
            SHOP PREMIUM
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* =========================================
          MOBILE ONLY: TOP TITLE
          ========================================= */}
      <div className="top-title-container z-20 relative hide-desktop">
        <h1 className="main-title-text">
          THE NEW<br/>STANDARD
        </h1>
      </div>

      {/* =========================================
          CENTER: VISUAL COMPOSITION
          ========================================= */}
      <div className="visuals-container z-10">
        
        {/* Layer 1: Mobile Background Models */}
        <div ref={bgRef} className="bg-models-layer absolute inset-0 w-full h-full hide-desktop">
          <Image 
            src={mobileBgImage} 
            alt="Mobile Models Background" 
            fill 
            className="mobile-bg-img"
            priority
          />
        </div>

        {/* Layer 2: Interactive 3D Gorilla */}
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

        <div className="reveal-text mt-5">
          <Link href="/shop/men" className="solid-black-btn secondary-btn">
            SHOP MEN'S
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* =========================================
          MOBILE ONLY: BOTTOM CONTENT & CTA
          ========================================= */}
      <div className="bottom-content-container z-20 relative hide-desktop">
        <h3 className="bottom-content subtitle-text" style={{ color: darkMode ? "#fff" : "#000" }}>STREETWEAR REDEFINED</h3>
        
        <Link href="/premium-collection" className="bottom-content solid-black-btn w-full">
          SHOP PREMIUM
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
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

        .bg-models-layer {
          pointer-events: none; 
          z-index: 1;
        }

        .gorilla-layer {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 75%;       /* 🔥 Reduced from 85% for a better desktop size */
          max-width: 460px;  /* 🔥 Reduced from 580px for a better desktop size */
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
          top: 52%; 
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
        }

        .solid-black-btn:active { transform: translateY(1px); }

        .secondary-btn {
          background-color: transparent;
          color: ${darkMode ? "#ffffff" : "#000000"};
          border: 2px solid ${darkMode ? "#ffffff" : "#000000"};
          box-shadow: none;
          border-radius: 4px;
        }
        .secondary-btn:hover {
          background-color: ${darkMode ? "#ffffff" : "#000000"};
          color: ${darkMode ? "#000000" : "#ffffff"} !important;
        }

        .mt-5 { margin-top: 1.5rem; }

        /* --- RESPONSIVE TOGGLES --- */
        .hide-desktop { display: none !important; }
        .hide-mobile { display: flex; } 

        /* =========================================
           MOBILE LAYOUT MATCHING EXACT IMAGE
           ========================================= */
        @media (max-width: 1024px) {
          .hide-desktop { display: flex !important; }
          .hide-mobile { display: none !important; }
          .top-title-container.hide-desktop { display: block !important; } 
          
          .hero-section {
            height: auto;
            min-height: 100dvh;
            flex-direction: column;
            justify-content: space-between;
            /* Extra bottom padding gives space to prevent FAB collision */
            padding: 10vh 5% clamp(60px, 12vh, 100px) 5%; 
          }

          /* --- 1. TITLE STYLING --- */
          .top-title-container {
            flex-shrink: 0;
            text-align: center;
            z-index: 20;
            margin-bottom: -5vh; 
          }
          .main-title-text {
            /* 🔥 Scaled down so it perfectly fits compact screens like iPhone SE */
            font-size: clamp(34px, 11vw, 65px); 
            font-weight: 900;
            line-height: 0.9;
            letter-spacing: -0.04em;
            text-transform: uppercase;
          }

          /* --- 2. FLEXIBLE MIDDLE VISUAL (Background + Gorilla) --- */
          .visuals-container {
            position: relative; 
            width: 100%;
            flex: 1 1 auto; 
            margin: 0;
            min-height: 45vh; /* Assures it doesn't collapse on landscape */
          }

          .bg-models-layer {
            /* 🔥 Breaks out of the 5% padding by setting 100vw and translating */
            width: 100vw !important;  
            left: 50% !important;   
            transform: translateX(-50%) !important;
            height: 100% !important; 
            top: 0 !important;    
          }

          .mobile-bg-img {
            object-fit: cover !important; /* Cover eliminates all white spaces on sides */
            object-position: center top !important; 
            transform: scale(1.05) !important; /* Slight zoom to smooth edges */
          }
          
          .gorilla-layer {
            height: 85%; 
            width: 100%;
            max-width: 480px; 
            bottom: 0;
          }

          .hero-gorilla-image {
            transform: scale(1); 
            transform-origin: bottom center;
          }
          
          /* --- 3. BOTTOM CTA MATCHING IMAGE EXACTLY --- */
          .bottom-content-container { 
            flex-shrink: 0;
            width: 100%; 
            display: flex; 
            flex-direction: column;
            align-items: flex-start; /* Aligns content left generally */
            gap: 10px;
            z-index: 20;
            padding-right: 60px; /* Buffer space so FABs (floating icons) never cover text */
          }

          .subtitle-text {
            font-size: clamp(13px, 3.5vw, 16px);
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            width: 100%;
            text-align: center; /* Centers just this text */
            margin-bottom: 5px;
          }

          /* Overriding solid block button to plain text with arrow */
          .bottom-content-container .solid-black-btn { 
            background: transparent !important;
            color: ${darkMode ? "#ffffff" : "#000000"} !important;
            padding: 0 !important;
            width: auto !important;
            max-width: none !important;
            justify-content: flex-start !important;
            font-size: 13px !important;
            letter-spacing: 0.5px !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  )
}