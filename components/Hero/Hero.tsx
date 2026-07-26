"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useTheme } from "@/app/context/ThemeContext"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const charRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const darkMode = theme === "dark"

  const images = [
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

  const [currentIndex, setCurrentIndex] = useState(0)
  const currentImage = images[currentIndex % images.length]

  const cycleImage = () => {
    if (!charRef.current) return
    gsap.to(charRef.current, {
      opacity: 0, scale: 0.96, filter: "blur(8px)",
      duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setCurrentIndex(p => p + 1)
        gsap.to(charRef.current, {
          opacity: 1, scale: 1, filter: "blur(0px)",
          duration: 0.5, ease: "expo.out"
        })
      }
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".h-badge", { y: -16, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.3 })
      gsap.from(".h-title-line", { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "expo.out", delay: 0.5 })
      gsap.from(".h-desc", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 1.0 })
      gsap.from(".h-actions", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 1.15 })
      gsap.from(".h-chips", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 1.3 })
      gsap.from(charRef.current, { x: 40, opacity: 0, filter: "blur(20px)", duration: 1.2, ease: "expo.out", delay: 0.6 })

      // gentle float
      gsap.to(charRef.current, { y: "-=14", duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
    }, heroRef)

    return () => ctx.revert()
  }, [darkMode])

  const bg = darkMode ? "#0a0a0a" : "#f7f7f5"
  const fg = darkMode ? "#ffffff" : "#0a0a0a"
  const muted = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"
  const border = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  const accent = "#ff4500"

  return (
    <section ref={heroRef} className="hero-root" style={{ background: bg, color: fg }}>

      {/* subtle noise */}
      <div className="hero-noise" />

      {/* watermark */}
      <div className="hero-wm" style={{ color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)" }}>GZ</div>

      {/* ─── DESKTOP ≥1024px ─── */}
      <div className="hero-desk">

        {/* LEFT: copy */}
        <div className="hero-copy">
          <div className="h-badge" style={{ border: `1px solid ${border}`, color: accent }}>
            <span className="h-dot" style={{ background: accent }} />
            New Drop · 2025
          </div>

          <h1 className="hero-h1">
            <span className="h-title-line">Dress</span>
            <span className="h-title-line">Bold.</span>
            <span className="h-title-line" style={{ color: accent }}>Stay Raw.</span>
          </h1>

          <p className="h-desc" style={{ color: muted }}>
            Premium 240GSM streetwear built for people who don't follow trends — they set them.
          </p>

          <div className="h-actions">
            <Link href="/shop/men" className="btn-fill" style={{ background: fg, color: bg }}>
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/collections/premium" className="btn-outline" style={{ border: `1px solid ${border}`, color: muted }}>
              View Collection
            </Link>
          </div>

          <div className="h-chips">
            {["240GSM Cotton", "Drop-Shoulder Fit", "Puff Print", "Bio-washed"].map(tag => (
              <span key={tag} className="h-chip" style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: muted }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: gorilla */}
        <div className="hero-visual">
          {/* accent glow behind image */}
          <div className="hero-glow" style={{ background: `radial-gradient(ellipse at center, ${darkMode ? "rgba(255,69,0,0.18)" : "rgba(255,69,0,0.10)"} 0%, transparent 65%)` }} />
          <div
            className="hero-char"
            ref={charRef}
            onMouseEnter={cycleImage}
            onClick={cycleImage}
            title="Hover to change colorway"
          >
            <Image
              src={currentImage}
              alt="GenZonic Gorilla"
              width={900}
              height={1100}
              priority
              className="hero-img"
              style={{ filter: `drop-shadow(0 24px 48px ${darkMode ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.18)"})` }}
            />
            <div className="hero-cycle-hint" style={{ color: muted }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hover to cycle colors
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE <1024px ─── */}
      <div className="hero-mob">
        {/* badge */}
        <div className="h-badge h-badge-m" style={{ border: `1px solid ${border}`, color: accent }}>
          <span className="h-dot" style={{ background: accent }} />
          New Drop · 2025
        </div>

        {/* title */}
        <h1 className="hero-h1 hero-h1-m">
          <span className="h-title-line">Dress</span>
          <span className="h-title-line">Bold.</span>
          <span className="h-title-line" style={{ color: accent }}>Stay Raw.</span>
        </h1>

        {/* gorilla image — full, no clip */}
        <div
          className="hero-mob-img"
          onClick={cycleImage}
        >
          <div className="hero-glow hero-glow-m" style={{ background: `radial-gradient(ellipse at center, ${darkMode ? "rgba(255,69,0,0.15)" : "rgba(255,69,0,0.08)"} 0%, transparent 65%)` }} />
          <Image
            src={currentImage}
            alt="GenZonic Gorilla"
            width={900}
            height={1100}
            priority
            className="hero-img-m"
            style={{ filter: `drop-shadow(0 20px 40px ${darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.12)"})` }}
          />
          <div className="hero-tap-hint" style={{ color: muted }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tap to change color
          </div>
        </div>

        {/* desc + cta */}
        <p className="h-desc h-desc-m" style={{ color: muted }}>
          Premium 240GSM streetwear — built for the bold.
        </p>
        <Link href="/shop/men" className="btn-fill btn-fill-m" style={{ background: fg, color: bg }}>
          Shop Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* chips */}
        <div className="h-chips h-chips-m">
          {["240GSM", "Drop-Shoulder", "Puff Print", "Bio-washed"].map(tag => (
            <span key={tag} className="h-chip" style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: muted }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* ── Root ── */
        .hero-root {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: ${darkMode ? "0.035" : "0.055"};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .hero-wm {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(120px, 24vw, 440px);
          font-weight: 900;
          letter-spacing: -0.05em;
          z-index: 1;
          pointer-events: none;
          user-select: none;
        }

        /* ── Desktop layout ── */
        .hero-desk {
          display: flex;
          align-items: stretch;
          min-height: 100vh;
          position: relative;
          z-index: 10;
        }

        .hero-mob {
          display: none;
        }

        /* copy panel */
        .hero-copy {
          flex: 0 0 44%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 0 80px 7%;
          gap: 0;
          position: relative;
          z-index: 20;
        }

        /* badge */
        .h-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          border-radius: 100px;
          padding: 7px 16px;
          width: fit-content;
          margin-bottom: 32px;
        }

        .h-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: blink 2s infinite ease-in-out;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* headline */
        .hero-h1 {
          display: flex;
          flex-direction: column;
          font-size: clamp(52px, 5.5vw, 90px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin: 0 0 28px 0;
          overflow: hidden;
        }

        .h-title-line {
          display: block;
        }

        /* desc */
        .h-desc {
          font-size: 15px;
          line-height: 1.65;
          font-weight: 500;
          margin: 0 0 36px 0;
          max-width: 320px;
        }

        /* actions */
        .h-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .btn-fill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 30px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-fill:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.22);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 26px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          background: transparent;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .btn-outline:hover {
          background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
          transform: translateY(-2px);
        }

        /* chips */
        .h-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .h-chip {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* visual panel */
        .hero-visual {
          flex: 0 0 56%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .hero-char {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 620px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-img {
          width: 100%;
          height: auto;
          max-height: 96vh;
          object-fit: contain;
          object-position: bottom center;
          display: block;
          transition: filter 0.3s ease;
        }

        .hero-char:hover .hero-img {
          filter: drop-shadow(0 32px 64px rgba(0,0,0,0.3)) brightness(1.04) !important;
        }

        .hero-cycle-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 8px;
          white-space: nowrap;
          padding-bottom: 20px;
        }

        .hero-char:hover .hero-cycle-hint {
          opacity: 1;
        }

        /* ── Mobile layout ── */
        @media (max-width: 1023px) {
          .hero-desk { display: none; }

          .hero-mob {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            min-height: 100dvh;
            padding: 100px 6% 40px;
            box-sizing: border-box;
            position: relative;
            z-index: 10;
            gap: 0;
          }

          .h-badge-m {
            margin-bottom: 20px;
          }

          .hero-h1-m {
            font-size: clamp(46px, 13vw, 76px);
            align-items: center;
            margin-bottom: 24px;
          }

          /* gorilla image container */
          .hero-mob-img {
            width: 100%;
            max-width: 420px;
            position: relative;
            flex-shrink: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }

          .hero-glow-m {
            border-radius: 50%;
            top: 10%; left: 10%; right: 10%; bottom: 10%;
            inset: unset;
            width: 80%;
            height: 80%;
            position: absolute;
            left: 10%;
          }

          .hero-img-m {
            width: 100%;
            height: auto;
            object-fit: contain;
            object-position: bottom center;
            display: block;
            position: relative;
            z-index: 1;
          }

          .hero-tap-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 4px;
            margin-bottom: 16px;
          }

          .h-desc-m {
            font-size: 14px;
            max-width: 280px;
            text-align: center;
            margin-bottom: 24px;
          }

          .btn-fill-m {
            width: 100%;
            max-width: 320px;
            justify-content: center;
            margin-bottom: 24px;
          }

          .h-chips-m {
            justify-content: center;
          }

          .hero-wm {
            font-size: 42vw;
          }
        }
      `}</style>
    </section>
  )
}
