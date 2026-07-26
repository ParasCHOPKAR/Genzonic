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

  const handleImageClick = () => {
    const tl = gsap.timeline()
    tl.to(charRef.current, {
      scale: 0.93,
      filter: "blur(10px) brightness(1.3)",
      opacity: 0.6,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setCurrentIndex((prev) => prev + 1)
    }).to(charRef.current, {
      scale: 1,
      filter: "blur(0px) brightness(1)",
      opacity: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.75)"
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.from(".hz-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hz-headline span", { y: "110%", opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, "-=0.3")
        .from(".hz-sub", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(".hz-cta-wrap", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(".hz-specs", { x: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, "-=0.7")
        .from(charRef.current, { y: 60, opacity: 0, filter: "blur(20px)", duration: 1.2, ease: "expo.out" }, "-=1.2")
        .from(".hz-scroll-hint", { opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")

      // Gentle float
      gsap.to(charRef.current, {
        y: "-=18",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to(pulseRef.current, {
        scale: 2.5,
        opacity: 0,
        duration: 2.5,
        repeat: -1,
        ease: "sine.out"
      })
    }, heroRef)

    return () => ctx.revert()
  }, [darkMode])

  const bg = darkMode ? "#080808" : "#f5f5f0"
  const fg = darkMode ? "#ffffff" : "#080808"
  const accent = "#ff4500"
  const accentSoft = darkMode ? "rgba(255,69,0,0.12)" : "rgba(255,69,0,0.08)"

  return (
    <section className="hz-section" ref={heroRef} style={{ background: bg, color: fg }}>

      {/* ── Noise texture ── */}
      <div className="hz-noise" />

      {/* ── Accent gradient blob ── */}
      <div className="hz-blob" style={{
        background: `radial-gradient(ellipse at 60% 50%, ${accentSoft} 0%, transparent 65%)`
      }} />

      {/* ── Background word ── */}
      <div className="hz-bg-word" style={{ color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)" }}>
        GENZONIC
      </div>

      {/* ══════════════════════════════════════
          DESKTOP LAYOUT  (≥1024px)
      ══════════════════════════════════════ */}
      <div className="hz-desktop">

        {/* Left panel – copy */}
        <div className="hz-left">
          <div className="hz-badge" style={{ borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)", color: accent }}>
            <span className="hz-badge-dot" style={{ background: accent }} />
            SERIES 01 · CORE COLLECTION
          </div>

          <h1 className="hz-headline">
            <span>STREET</span>
            <span>WEAR</span>
            <span style={{ color: accent }}>REDE</span>
            <span style={{ color: accent }}>FINED</span>
          </h1>

          <p className="hz-sub" style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>
            Heavyweight 240GSM. Drop-shoulder silhouette.<br />
            Built for the bold. Worn by the few.
          </p>

          <div className="hz-cta-wrap">
            <Link href="/shop/men" className="hz-btn-primary" style={{ background: fg, color: bg }}>
              SHOP NOW
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/collections/premium" className="hz-btn-ghost" style={{ borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", color: fg }}>
              VIEW LOOKBOOK
            </Link>
          </div>

          <div className="hz-stats">
            {[["240GSM", "Fabric Weight"], ["15+", "Colorways"], ["100%", "Bio-washed"]].map(([val, label]) => (
              <div key={label} className="hz-stat">
                <span className="hz-stat-val" style={{ color: fg }}>{val}</span>
                <span className="hz-stat-label" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center – Gorilla image */}
        <div className="hz-center">
          <div
            className="hz-char-wrap"
            ref={charRef}
            onMouseEnter={handleImageClick}
            onClick={handleImageClick}
            title="Hover to change colorway"
          >
            <div ref={pulseRef} className="hz-pulse" style={{ borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }} />
            <Image
              src={currentImage}
              alt="GenZonic Gorilla Model"
              width={900}
              height={1100}
              priority
              className="hz-char-img"
            />
            <div className="hz-hover-hint" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              HOVER TO CYCLE
            </div>
          </div>

          {/* Accent line decoration */}
          <div className="hz-accent-line" style={{ background: accent }} />
        </div>

        {/* Right panel – specs */}
        <div className="hz-right">
          <div className="hz-specs-label" style={{ color: accent }}>PRODUCT SPECS</div>
          <ul className="hz-specs-list">
            {[
              "Heavyweight 240GSM Cotton",
              "Signature Drop-Shoulder Fit",
              "High-Density Puff Print",
              "Pre-shrunk & Bio-washed",
              "Reinforced Collar",
              "Unisex Oversized Cut",
            ].map((s) => (
              <li key={s} className="hz-specs" style={{ borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", color: darkMode ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>
                <span className="hz-spec-dot" style={{ background: accent }} />
                {s}
              </li>
            ))}
          </ul>

          <div className="hz-tag" style={{ background: accentSoft, color: accent }}>
            BUILT FOR THE BOLD.
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════
          MOBILE LAYOUT  (< 1024px)
      ══════════════════════════════════════ */}
      <div className="hz-mobile">
        {/* Top badge */}
        <div className="hz-badge hz-badge--mobile" style={{ borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)", color: accent }}>
          <span className="hz-badge-dot" style={{ background: accent }} />
          CORE COLLECTION · SERIES 01
        </div>

        {/* Headline */}
        <h1 className="hz-headline hz-headline--mobile">
          <span>STREET</span>
          <span>WEAR</span>
          <span style={{ color: accent }}>REDE</span>
          <span style={{ color: accent }}>FINED</span>
        </h1>

        {/* Gorilla – full width, no clipping */}
        <div className="hz-mobile-img-wrap">
          <div
            className="hz-char-wrap hz-char-wrap--mobile"
            ref={undefined}
            onClick={handleImageClick}
          >
            <Image
              src={currentImage}
              alt="GenZonic Gorilla Model"
              width={900}
              height={1100}
              priority
              className="hz-char-img hz-char-img--mobile"
            />
            <div className="hz-hover-hint hz-hover-hint--mobile" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              TAP TO CYCLE
            </div>
          </div>
          <div className="hz-accent-line hz-accent-line--mobile" style={{ background: accent }} />
        </div>

        {/* Bottom content */}
        <div className="hz-mobile-bottom">
          <p className="hz-sub" style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)", textAlign: "center" }}>
            240GSM · Drop-Shoulder · Puff Print · Bio-washed
          </p>
          <div className="hz-cta-wrap hz-cta-wrap--mobile">
            <Link href="/shop/men" className="hz-btn-primary" style={{ background: fg, color: bg }}>
              SHOP NOW
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="hz-scroll-hint" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
        <div className="hz-scroll-line" style={{ background: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }} />
        <span>SCROLL</span>
      </div>

      <style jsx>{`
        /* ===========================
           BASE
        =========================== */
        .hz-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hz-noise {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: ${darkMode ? "0.04" : "0.06"};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .hz-blob {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .hz-bg-word {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(80px, 18vw, 340px);
          font-weight: 900;
          letter-spacing: -0.04em;
          white-space: nowrap;
          z-index: 1;
          pointer-events: none;
          text-transform: uppercase;
          user-select: none;
        }

        /* ===========================
           DESKTOP LAYOUT
        =========================== */
        .hz-desktop {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 10;
        }

        .hz-mobile {
          display: none;
        }

        /* LEFT */
        .hz-left {
          flex: 0 0 30%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 0 0 6%;
          z-index: 20;
          gap: 0;
        }

        .hz-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 100px;
          padding: 7px 14px;
          width: fit-content;
          margin-bottom: 28px;
        }

        .hz-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .hz-headline {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-size: clamp(42px, 5vw, 80px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin: 0 0 28px 0;
        }

        .hz-headline span {
          display: block;
          overflow: hidden;
        }

        .hz-sub {
          font-size: 14px;
          line-height: 1.7;
          font-weight: 500;
          margin: 0 0 32px 0;
          max-width: 280px;
        }

        .hz-cta-wrap {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .hz-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .hz-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .hz-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid;
          background: transparent;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .hz-btn-ghost:hover {
          background: ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"};
          transform: translateY(-2px);
        }

        .hz-stats {
          display: flex;
          gap: 28px;
        }

        .hz-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hz-stat-val {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .hz-stat-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* CENTER */
        .hz-center {
          flex: 0 0 40%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: visible;
        }

        .hz-char-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
          max-width: 600px;
          padding-bottom: 0;
        }

        .hz-char-img {
          width: 100%;
          height: auto;
          max-height: 95vh;
          object-fit: contain;
          object-position: bottom center;
          display: block;
          filter: drop-shadow(0 30px 60px ${darkMode ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)"});
          transition: filter 0.3s ease;
        }

        .hz-char-wrap:hover .hz-char-img {
          filter: drop-shadow(0 40px 80px ${darkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)"}) brightness(1.04);
        }

        .hz-pulse {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          border: 1px solid;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .hz-hover-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 12px;
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }

        .hz-char-wrap:hover .hz-hover-hint {
          opacity: 1;
        }

        .hz-accent-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 80px;
          border-radius: 2px;
        }

        /* RIGHT */
        .hz-right {
          flex: 0 0 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 6%;
          z-index: 20;
          gap: 0;
        }

        .hz-specs-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hz-specs-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .hz-specs {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          padding: 13px 0;
          border-bottom: 1px solid;
        }

        .hz-spec-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hz-tag {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          width: fit-content;
        }

        /* SCROLL HINT */
        .hz-scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          z-index: 20;
        }

        .hz-scroll-line {
          width: 1px;
          height: 40px;
          border-radius: 2px;
          animation: scrollPulse 2s infinite ease-in-out;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 1; height: 40px; }
          50% { opacity: 0.4; height: 24px; }
        }

        /* ===========================
           MOBILE LAYOUT (< 1024px)
        =========================== */
        @media (max-width: 1023px) {
          .hz-section {
            height: auto;
            min-height: 100dvh;
          }

          .hz-desktop {
            display: none;
          }

          .hz-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            min-height: 100dvh;
            padding: 5vh 5% 4vh;
            box-sizing: border-box;
            position: relative;
            z-index: 10;
          }

          .hz-badge--mobile {
            margin-bottom: 20px;
            font-size: 9px;
          }

          .hz-headline--mobile {
            font-size: clamp(44px, 13vw, 72px);
            text-align: center;
            margin-bottom: 0;
            align-items: center;
          }

          .hz-mobile-img-wrap {
            width: 100%;
            max-width: 480px;
            position: relative;
            margin: -20px auto 0;
            flex: 1;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .hz-char-wrap--mobile {
            width: 100%;
            max-width: 420px;
            padding-bottom: 0;
          }

          .hz-char-img--mobile {
            max-height: none;
            width: 100%;
            height: auto;
          }

          .hz-hover-hint--mobile {
            position: static;
            transform: none;
            opacity: 1;
            bottom: auto;
            left: auto;
            margin-top: 8px;
          }

          .hz-accent-line--mobile {
            display: none;
          }

          .hz-mobile-bottom {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding-top: 16px;
          }

          .hz-cta-wrap--mobile {
            width: 100%;
            max-width: 360px;
            flex-direction: column;
            margin-bottom: 0;
          }

          .hz-btn-primary {
            width: 100%;
            justify-content: center;
          }

          .hz-scroll-hint {
            display: none;
          }

          .hz-bg-word {
            font-size: 35vw;
          }
        }
      `}</style>
    </section>
  )
}
