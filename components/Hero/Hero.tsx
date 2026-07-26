"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useTheme } from "@/app/context/ThemeContext"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const charRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLDivElement>(null)
  const bgGridRef = useRef<HTMLDivElement>(null)
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

      // Unified Entrance Animations
      tl.from(".cyber-grid", { opacity: 0, duration: 2, ease: "power2.inOut" })
        .from(".editorial-title, .tech-label", { y: -30, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power4.out" }, "-=1.5")
        .from(charRef.current, { y: 80, scale: 0.9, opacity: 0, filter: "blur(20px)", duration: 1.8, ease: "expo.out" }, "-=1.2")
        .from(".reveal-text, .bottom-content, .shop-now-btn", { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1")

      // Floating Animation for the Gorilla
      gsap.to(charRef.current, {
        y: "-=15",
        duration: 3.5,
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

    // Mouse movement parallax effect for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(charRef.current, {
        x: xPos,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to(bgGridRef.current, {
        x: -xPos * 0.5,
        y: -yPos * 0.5,
        duration: 1.5,
        ease: "power2.out"
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [darkMode])

  return (
    <section 
      className="hero-section" 
      ref={heroRef}
      style={{
        background: darkMode ? "#0a0a0a" : "#fcfcfc", 
        color: darkMode ? "#ffffff" : "#0a0a0a",
      }}
    >
      
      {/* Background Ambience */}
      <div className="noise-overlay" />
      <div className="ambient-glow" />
      <div className="cyber-grid" ref={bgGridRef} />
      <div className="bg-watermark" style={{ color: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
        GenZonic
      </div>  

      <div className="hero-content z-10">
        {/* LEFT COLUMN */}
        <div className="hero-col left-col">
          <div className="tech-label reveal-text hide-on-mobile">SERIES_01 // CORE COLLECTION</div>
          <h2 className="editorial-title reveal-text">THE NEW <br className="hide-on-mobile"/> STANDARD</h2>
          <p className="editorial-desc reveal-text hide-on-mobile">
            Experience our signature silhouettes. Hover over the subject to cycle through the available premium colorways.
          </p>
        </div>

        {/* CENTER COLUMN (VISUAL) */}
        <div className="hero-col center-col">
          <div 
            className="gorilla-layer"
            ref={charRef}
            onMouseEnter={handleImageHover} 
            onClick={handleImageHover} 
          >
            <div ref={pulseRef} className="click-pulse hide-on-mobile" />
            
            <Image 
              src={currentImage} 
              alt="GenZonic Subject"
              width={1000}
              height={1000}
              priority
              className="hero-gorilla-image"
            />

            <div className="tap-indicator">
              <div className="arrow-wrapper">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={darkMode ? "#ffffff" : "#000000"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <span className="tap-text text-[10px] font-black tracking-[4px] mt-2 text-center" style={{color: darkMode ? "#ffffff" : "#000000"}}>
                <span className="hide-on-mobile">HOVER TO CYCLE</span>
                <span className="show-on-mobile">TAP TO CYCLE</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-col right-col">
          <div className="tech-label reveal-text hide-on-mobile">ENGINEERED AESTHETICS</div>
          <div className="tier-block reveal-text">
            <h3>STREETWEAR <br className="hide-on-mobile"/> REDEFINED</h3>
            <ul className="spec-list hide-on-mobile">
              <li>Heavyweight 240GSM Cotton</li>
              <li>Signature Drop-Shoulder Fit</li>
              <li>High-Density Puff Print</li>
              <li>Pre-shrunk & Bio-washed</li>
            </ul>
            <p className="bold-statement hide-on-mobile"><strong>Built for the bold.</strong></p>
          </div>
          
          <Link href="/shop/men" className="shop-now-btn">
            <span>SHOP NOW</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="btn-icon">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* --- LAYOUT FUNDAMENTALS --- */
        .hero-section {
          height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          /* Removed display: flex on parent to prevent child flex items from forcing overflow */
        }

        .hero-content {
          width: 100%;
          max-width: 1800px;
          padding: 0 5%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
          position: relative;
        }

        .hero-col {
          display: flex;
          flex-direction: column;
          z-index: 10;
          min-width: 0; /* Critical for preventing flex items from exceeding container */
        }

        .left-col {
          flex: 1;
          align-items: flex-start;
          text-align: left;
          z-index: 20;
        }

        .center-col {
          flex: 1.5;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          z-index: 5;
        }

        .right-col {
          flex: 1;
          align-items: flex-end;
          text-align: right;
          z-index: 20;
        }

        /* --- BACKGROUND --- */
        .bg-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(100px, 22vw, 400px);
          font-weight: 900;
          letter-spacing: -0.05em;
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
          opacity: ${darkMode ? "0.03" : "0.05"};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .ambient-glow {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, ${darkMode ? "rgba(255, 62, 0, 0.15)" : "rgba(255, 62, 0, 0.08)"} 0%, transparent 60%);
          z-index: 0;
          pointer-events: none;
        }

        .cyber-grid {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          z-index: 1;
          pointer-events: none;
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, ${darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
        }

        /* --- TYPOGRAPHY & ELEMENTS --- */
        .tech-label { 
          font-size: 11px; 
          letter-spacing: 4px; 
          font-weight: 800; 
          opacity: 0.6; 
          margin-bottom: 24px; 
          text-transform: uppercase; 
        }

        .editorial-title { 
          font-size: clamp(32px, 4vw, 56px); 
          font-weight: 900; 
          line-height: 1.05; 
          margin-bottom: 24px; 
          letter-spacing: -0.03em; 
          text-transform: uppercase; 
        }

        .editorial-desc { 
          font-size: 14px; 
          line-height: 1.6; 
          opacity: 0.7; 
          font-weight: 500; 
          max-width: 280px;
        }

        .tier-block { margin-bottom: 30px; }
        .tier-block h3 { 
          font-size: clamp(24px, 2.5vw, 36px); 
          font-weight: 900; 
          line-height: 1.1; 
          margin-bottom: 16px; 
          letter-spacing: -0.02em; 
          text-transform: uppercase;
          word-break: break-word; 
        }
        
        .spec-list { 
          list-style: none; 
          padding: 0; 
          margin: 0 0 16px 0; 
          font-size: 13px; 
          opacity: 0.75; 
          line-height: 1.8; 
          font-weight: 500; 
        }
        .spec-list li { margin-bottom: 4px; }
        .bold-statement { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

        /* --- VISUALS --- */
        .gorilla-layer {
          position: absolute;
          bottom: 0;
          height: 55%;
          max-height: 550px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .hero-gorilla-image {
          height: 100%;
          width: auto;
          object-fit: contain;
          object-position: bottom; 
          transition: filter 0.3s ease;
        }

        .click-pulse { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          width: 150px; 
          height: 150px; 
          border: 1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}; 
          border-radius: 50%; 
          pointer-events: none; 
        }

        .tap-indicator {
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .gorilla-layer:hover .tap-indicator { opacity: 1; }
        .arrow-wrapper { animation: arrowSlide 2s infinite ease-in-out; }
        @keyframes arrowSlide { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }

        /* --- BUTTONS --- */
        .shop-now-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          color: ${darkMode ? "#ffffff" : "#000000"};
          padding: 16px 32px;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 50px;
          border: 1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .shop-now-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: ${darkMode ? "#ffffff" : "#000000"};
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s ease;
          z-index: 0;
        }

        .shop-now-btn:hover::before {
          transform: scaleX(1);
          transform-origin: left;
        }

        .shop-now-btn span, .shop-now-btn .btn-icon {
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
        }

        .shop-now-btn:hover span, .shop-now-btn:hover .btn-icon {
          color: ${darkMode ? "#000000" : "#ffffff"};
        }

        .shop-now-btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .show-on-mobile { display: none; }

        /* =========================================
           MOBILE LAYOUT
           ========================================= */
        @media (max-width: 1024px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline-block !important; }
          
          .hero-section {
            height: 100dvh;
            min-height: 600px;
          }

          .hero-content {
            flex-direction: column;
            justify-content: space-between;
            padding: 12vh 5% 4vh 5%;
          }

          .left-col, .right-col {
            width: 100%;
            align-items: center;
            text-align: center;
          }

          .center-col {
            width: 100%;
            flex: 1;
          }
          
          .gorilla-layer {
            height: 100%;
            max-height: 45vh;
            width: 100%;
            max-width: 100vw;
          }

          .hero-gorilla-image {
            object-fit: contain;
            transform-origin: bottom center;
          }

          .editorial-title {
            font-size: clamp(38px, 12vw, 60px);
            margin-bottom: 0;
          }

          .tier-block {
            margin-bottom: 15px;
          }
          .tier-block h3 {
            font-size: clamp(20px, 5vw, 24px);
            margin-bottom: 0;
          }

          .shop-now-btn {
            width: 100%;
            max-width: 320px;
            background: ${darkMode ? "#ffffff" : "#000000"};
            color: ${darkMode ? "#000000" : "#ffffff"};
            padding: 18px 24px;
          }
          .shop-now-btn::before { display: none; }
          .shop-now-btn:hover span, .shop-now-btn:hover .btn-icon {
             color: ${darkMode ? "#000000" : "#ffffff"};
          }

          .tap-indicator {
            top: 55%; 
          }
          
          .bg-watermark { top: 45%; font-size: 26vw; }
        }
      `}</style>
    </section>
  )
}
