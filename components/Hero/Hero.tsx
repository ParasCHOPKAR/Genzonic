"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
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

  // 🔥 Triggered on hover (Desktop) and click (Mobile)
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

      // Initial Entrance Animations
      tl.from(".cyber-grid", { opacity: 0, duration: 2, ease: "power2.inOut" })
        .from(".ambient-glow", { opacity: 0, scale: 0.5, duration: 3, ease: "power2.out" }, "-=1.5")
        .from(watermarkRef.current, { opacity: 0, scale: 0.85, duration: 2.5, ease: "expo.out" }, "-=2")
        .from(".reveal-text", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=2")
        .from(charRef.current, { scale: 1.1, filter: "blur(20px)", opacity: 0, y: 60, duration: 2, ease: "expo.out" }, "-=1.8")

      // Continuous Breathing Pulse for Character
      gsap.to(pulseRef.current, {
        scale: 2.2,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        ease: "sine.out"
      })

      // Ambient Glow Breathing
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Continuous Slow Float for Character
      gsap.to(charRef.current, {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Ultra-slow continuous scaling for the background watermark
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
      
      {/* 1. Cinematic Noise Overlay */}
      <div className="noise-overlay" />

      {/* 2. Modern Ambient Glow */}
      <div ref={glowRef} className="ambient-glow" />

      {/* 3. Subtle Cyber Grid */}
      <div className="cyber-grid" />

      {/* Brand Watermark */}
      <div 
        ref={watermarkRef} 
        className="bg-watermark" 
        style={{ color: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
      >
        GenZonic
      </div>  

      {/* LEFT SIDE: Brand Intro */}
      <div className="editorial-side left-side">
        <div className="tech-label reveal-text">SERIES_01 // CORE COLLECTION</div>
        <h2 className="editorial-title reveal-text">THE NEW <br className="desktop-br"/> STANDARD</h2>
        <p className="editorial-desc reveal-text">
          Experience our signature silhouettes. <span className="hide-mobile">Hover over</span><span className="hide-desktop">Tap</span> the subject to cycle through the available premium colorways.
        </p>
      </div>

      {/* CENTER CHARACTER (HOVERABLE / CLICKABLE) */}
      <div 
        className="character-container" 
        ref={charRef}
        onMouseEnter={handleImageHover} 
        onClick={handleImageHover} // 🔥 Mobile Tap Support
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

        {/* REFINED ARROW INDICATOR */}
        <div className="tap-indicator">
          <div className="arrow-wrapper">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <span className="tap-text"><span className="hide-mobile">HOVER</span><span className="hide-desktop">TAP</span> TO CYCLE</span>
        </div>
      </div>

      {/* RIGHT SIDE: Premium Vault & Promo */}
      <div className="editorial-side right-side">
        <div className="tech-label reveal-text hide-mobile">THE ULTIMATE EXPERIENCE</div>
        
        <div className="tier-block reveal-text">
          <h3>PREMIUM VAULT</h3>
          <p>
            GenZonic Core Garment <br/>
            <strong>5 Exclusive Artifacts</strong> <br/>
            Structured Vault Box
          </p>
        </div>

        <div className="promo-pill reveal-text">
          GET EXTRA 10% OFF YOUR FIRST ORDER
        </div>

        <button className="modern-cta reveal-text">SHOP COLLECTION</button>
      </div>

      {/* SCROLL HINT */}
      <div className="scroll-hint-modern reveal-text">
        <span>DISCOVER MORE</span>
        <div className="line"></div>
      </div>

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

        /* --- MODERN BACKGROUND ELEMENTS --- */
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
          z-index: 11;
          width: 360px;
          display: flex;
          flex-direction: column;
        }
        .left-side {
          align-items: flex-start;
          text-align: left;
        }
        .right-side {
          align-items: flex-end;
          text-align: right;
        }

        .tech-label { font-size: 12px; letter-spacing: 4px; font-weight: 900; opacity: 0.6; margin-bottom: 25px; text-transform: uppercase; }
        .editorial-title { font-size: clamp(32px, 4vw, 42px); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.03em; }
        .editorial-desc { font-size: 14px; line-height: 1.6; opacity: 0.7; font-weight: 500; }

        .tier-block { text-align: right; margin-bottom: 10px; }
        .tier-block h3 { font-size: 18px; font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; color: #ff3e00; }
        .tier-block p { font-size: 14px; opacity: 0.9; line-height: 1.8; margin: 0; font-weight: 500; }
        .tier-block strong { color: ${darkMode ? '#fff' : '#000'}; font-weight: 900; }

        .promo-pill { margin-top: 20px; margin-bottom: 40px; display: inline-block; padding: 12px 20px; border: 2px solid #ff3e00; color: #ff3e00; background: rgba(255, 62, 0, 0.1); font-size: 11px; font-weight: 900; letter-spacing: 1px; border-radius: 4px; box-shadow: 0 4px 20px rgba(255, 62, 0, 0.2); }
        
        .modern-cta { background: ${darkMode ? "#fff" : "#000"}; color: ${darkMode ? "#000" : "#fff"}; border: 1px solid ${darkMode ? "#fff" : "#000"}; padding: 22px 50px; font-weight: 900; font-size: 12px; letter-spacing: 5px; cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .modern-cta:hover { background: transparent; color: ${darkMode ? "#fff" : "#000"}; }

        /* --- CHARACTER & INTERACTION --- */
        .character-container {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          z-index: 10;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .hero-image {
          height: 92vh;
          width: auto;
          object-fit: contain;
          z-index: 5;
          transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .click-pulse { position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; border: 1px solid ${darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}; border-radius: 50%; pointer-events: none; }

        .tap-indicator { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 15; pointer-events: none; opacity: 0.5; transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .arrow-wrapper { animation: arrowBounce 2s infinite ease-in-out; }
        .tap-text { font-size: 9px; font-weight: 900; letter-spacing: 4px; white-space: nowrap; text-transform: uppercase; }

        .character-container:hover .tap-indicator, 
        .character-container:active .tap-indicator { opacity: 1; transform: translate(-50%, -60%); }
        .character-container:hover .hero-image { filter: drop-shadow(0 0 50px ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}); }

        @keyframes arrowBounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }

        /* --- SCROLL HINT --- */
        .scroll-hint-modern { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 15px; opacity: 0.6; z-index: 10; }
        .scroll-hint-modern span { font-size: 10px; letter-spacing: 3px; font-weight: 800; }
        .scroll-hint-modern .line { width: 1px; height: 40px; background: currentColor; animation: pulseLine 2s infinite cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes pulseLine { 0%, 100% { transform: scaleY(1); transform-origin: bottom; opacity: 1; } 50% { transform: scaleY(0.2); transform-origin: bottom; opacity: 0.3; } }

        /* --- DESKTOP/MOBILE VISIBILITY HELPERS --- */
        .hide-desktop { display: none; }

        /* ================= 🔥 RESPONSIVE MOBILE FIX 🔥 ================= */
        @media (max-width: 1024px) {
          /* Change to a stacked column layout so everything shows */
          .hero-section {
            height: auto;
            min-height: 100dvh; /* Ensures it fills screen but can scroll if needed */
            flex-direction: column;
            justify-content: space-evenly;
            padding-top: 120px; /* Clears the mobile navbar */
            padding-bottom: 40px;
          }

          /* Force the side panels to act like normal, centered blocks */
          .editorial-side {
            position: relative !important;
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 10%;
          }
          
          /* Order the stacking: Top Text -> Monkey -> Bottom Text */
          .left-side { order: 1; margin-bottom: 20px; }
          .character-container { 
            order: 2; 
            position: relative !important; 
            left: auto !important; 
            bottom: auto !important; 
            transform: none !important;
            margin: 20px 0;
          }
          .right-side { order: 3; }

          /* Center the text elements that were right-aligned on desktop */
          .tier-block { text-align: center !important; }
          .desktop-br { display: none; }
          
          /* Scale elements down to fit the phone screen */
          .hero-image { height: 45vh !important; }
          .bg-watermark { top: 40% !important; font-size: 28vw !important; }
          .scroll-hint-modern { display: none !important; } /* Hide to save space */
          
          /* Ensure CTA button spans nicely */
          .modern-cta { width: 100%; max-width: 320px; padding: 18px 20px; }

          /* Handle Helpers */
          .hide-desktop { display: inline; }
          .hide-mobile { display: none; }
        }

        /* Smaller phone tweaks */
        @media (max-width: 600px) {
          .hero-image { height: 40vh !important; }
          .editorial-title { font-size: clamp(28px, 8vw, 36px) !important; margin-bottom: 10px; }
          .editorial-desc { font-size: 13px !important; }
          .promo-pill { margin-bottom: 25px !important; }
        }
      `}</style>
    </section>
  )
}