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
  const textRef = useRef(null)
  const { theme } = useTheme()
  const darkMode = theme === "dark"

  // --------------------------------------------------------
  // ⚠️ UPDATE THESE PATHS WITH YOUR ACTUAL BACKGROUND IMAGES
  // --------------------------------------------------------
  const desktopBgImage = "/hero/desktop-bg.png" // e.g., "/hero/models-bg-desktop.jpg"
  const mobileBgImage = "/hero/my_primium-photo-mobile-view.png"   // e.g., "/hero/models-bg-mobile.jpg"

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
      "/hero/mustard-tshirt-gorila-removebg-preview.png", // Using Mustard first based on your new mockup
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

      // Initial Entrance Animations
      tl.from(".main-title-text", { y: -30, opacity: 0, duration: 1.5, ease: "power4.out" })
        .from(bgRef.current, { opacity: 0, scale: 1.05, duration: 2, ease: "power2.out" }, "-=1")
        .from(charRef.current, { y: 50, scale: 1.1, opacity: 0, filter: "blur(20px)", duration: 1.5, ease: "expo.out" }, "-=1.5")
        .from(".bottom-content", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=1")

      // Continuous Floating Animation for the Gorilla
      gsap.to(charRef.current, {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

    }, heroRef)

    return () => ctx.revert()
  }, [darkMode])

  return (
    <section 
      className="hero-section" 
      ref={heroRef}
      style={{
        background: darkMode ? "#0a0a0a" : "#f9f9f9", 
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      
      {/* Subtle Noise Texture */}
      <div className="noise-overlay" />

      {/* =========================================
          TOP: TITLE
          ========================================= */}
      <div className="top-title-container z-20 relative">
        <h1 className="main-title-text">
          THE NEW<br/>STANDARD
        </h1>
      </div>

      {/* =========================================
          MIDDLE: VISUAL COMPOSITION (BG MODELS + GORILLA)
          ========================================= */}
      <div className="visuals-container z-10 relative">
        
        {/* Layer 1: Static Background Models */}
        <div ref={bgRef} className="bg-models-layer absolute inset-0 w-full h-full">
          {/* Desktop Background Image */}
          <div className="desktop-bg absolute inset-0 w-full h-full">
            <Image 
              src={desktopBgImage} 
              alt="GenZonic Models Background" 
              fill 
              className="object-contain object-bottom"
              priority
            />
          </div>
          {/* Mobile Background Image */}
          <div className="mobile-bg absolute inset-0 w-full h-full">
            <Image 
              src={mobileBgImage} 
              alt="GenZonic Models Background" 
              fill 
              className="object-cover sm:object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* Layer 2: Interactive 3D Gorilla */}
        <div 
          className="gorilla-layer relative w-full h-full flex justify-center items-end"
          ref={charRef}
          onMouseEnter={handleImageHover} 
          onClick={handleImageHover} 
        >
          <Image 
            src={currentImage} 
            alt="GenZonic Subject"
            width={1000}
            height={1000}
            priority
            className="hero-gorilla-image"
          />

          {/* Center Interactive Indicator */}
          <div className="tap-indicator absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="arrow-wrapper">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={darkMode ? "#ffffff" : "#000000"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <span className="tap-text text-[10px] font-black tracking-[3px] mt-1 text-center" style={{color: darkMode ? "#ffffff" : "#000000"}}>
              <span className="hide-mobile">HOVER</span><span className="hide-desktop">TAP</span><br/>TO CYCLE
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM: CONTENT & CTA
          ========================================= */}
      <div className="bottom-content-container z-20 relative flex flex-col items-center gap-4 pb-8">
        <h3 className="bottom-content subtitle-text">STREETWEAR REDEFINED</h3>
        
        <Link href="/premium-collection" className="bottom-content solid-black-btn">
          SHOP PREMIUM
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
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
          width: 100%;
          min-height: 100vh; /* Changed from fixed 100vh to min-height to prevent crunching */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          padding-top: 100px; /* Space for navbar */
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: ${darkMode ? "0.03" : "0.04"};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- TYPOGRAPHY --- */
        .top-title-container {
          text-align: center;
          margin-top: 2vh;
        }

        .main-title-text {
          font-size: clamp(48px, 10vw, 100px); /* Massive responsive text */
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: ${darkMode ? "#ffffff" : "#000000"};
        }

        .subtitle-text {
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* --- VISUALS CONTAINER --- */
        .visuals-container {
          flex-grow: 1;
          width: 100%;
          max-width: 1600px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end; /* Align characters to bottom */
          min-height: 50vh; /* Guarantee space for characters */
        }

        .bg-models-layer {
          pointer-events: none; /* Let clicks pass through to gorilla */
        }

        .gorilla-layer {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .hero-gorilla-image {
          width: 100%;
          height: 100%;
          max-width: 800px; /* Control max width on massive screens */
          object-fit: contain;
          object-position: bottom; /* Anchor to bottom */
          transition: filter 0.3s ease;
        }

        .tap-indicator {
          pointer-events: none;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        .gorilla-layer:hover .tap-indicator {
          opacity: 1;
        }
        .arrow-wrapper { animation: arrowSlide 2s infinite ease-in-out; }
        @keyframes arrowSlide { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }

        /* --- BOTTOM CONTENT & BUTTON --- */
        .bottom-content-container {
          width: 100%;
          padding: 0 5%;
          margin-top: 2vh;
        }

        .solid-black-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${darkMode ? "#ffffff" : "#000000"};
          color: ${darkMode ? "#000000" : "#ffffff"};
          padding: 18px 48px;
          border-radius: 4px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 380px; /* Constrain on desktop, fill on mobile */
        }

        .solid-black-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.25);
        }

        .solid-black-btn:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        /* --- RESPONSIVE DESKTOP/MOBILE DISPLAY --- */
        .hide-desktop { display: none; }
        .desktop-bg { display: block; }
        .mobile-bg { display: none; }

        @media (max-width: 768px) {
          .hide-desktop { display: inline; }
          .hide-mobile { display: none; }
          
          .desktop-bg { display: none; }
          .mobile-bg { display: block; }
          
          .hero-section {
            padding-top: 90px;
          }

          .visuals-container {
            min-height: 45vh; /* Adjust for mobile screens */
          }

          .hero-gorilla-image {
            transform: scale(1.05); /* Slight zoom on mobile */
          }
          
          .solid-black-btn {
            padding: 16px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  )
}