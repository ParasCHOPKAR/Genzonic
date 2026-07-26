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

  const [idx, setIdx] = useState(0)
  const currentImage = images[idx % images.length]

  const cycleImage = () => {
    if (!charRef.current) return
    gsap.to(charRef.current, {
      opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setIdx(p => p + 1)
        gsap.to(charRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "expo.out" })
      }
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from(".hz-left-col > *", { x: -30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" })
        .from(".hz-right-col > *", { x: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" }, "-=0.7")
        .from(charRef.current, { y: 40, opacity: 0, filter: "blur(20px)", duration: 1.1, ease: "expo.out" }, "-=0.9")

      gsap.to(charRef.current, { y: "-=14", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" })
    }, heroRef)
    return () => ctx.revert()
  }, [darkMode])

  const bg = darkMode ? "#0a0a0a" : "#f5f5f2"
  const fg = darkMode ? "#fff" : "#0a0a0a"
  const accent = "#ff4500"
  const muted = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.42)"
  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
  const borderC = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"

  return (
    <section
      ref={heroRef}
      style={{ background: bg, color: fg, height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}
    >
      {/* Noise */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        opacity: darkMode ? 0.03 : 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: `radial-gradient(circle, ${darkMode ? "rgba(255,69,0,0.14)" : "rgba(255,69,0,0.07)"} 0%, transparent 65%)`,
        pointerEvents: "none", zIndex: 1
      }} />

      {/* Watermark */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontSize: "clamp(100px, 22vw, 400px)", fontWeight: 900, letterSpacing: "-0.05em",
        color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
        zIndex: 1, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap"
      }}>GENZONIC</div>

      {/* ═══════════════════════════════════════════
          DESKTOP (≥1024px) — 3-column CSS Grid
      ═══════════════════════════════════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        height: "100%",
        position: "relative",
        zIndex: 10,
      }} className="hz-desk-grid">

        {/* ── LEFT: Headline + CTA ── */}
        <div className="hz-left-col" style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 0 0 6%", gap: 0
        }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase",
            border: `1px solid ${borderC}`, borderRadius: 100, padding: "7px 16px",
            color: accent, width: "fit-content", marginBottom: 28
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0,
              animation: "pulseDot 2s infinite ease-in-out"
            }} />
            New Drop · 2025
          </div>

          {/* Big headline */}
          <div style={{
            fontSize: "clamp(44px, 5vw, 84px)", fontWeight: 900, lineHeight: 0.92,
            letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: 24,
          }}>
            <div>Dress</div>
            <div>Bold.</div>
            <div style={{ color: accent }}>Stay Raw.</div>
          </div>

          {/* Desc */}
          <p style={{ fontSize: 14, lineHeight: 1.7, color: muted, marginBottom: 32, maxWidth: 280, fontWeight: 500 }}>
            Premium streetwear for people who don't follow trends — they set them.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/shop/men" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 28px", borderRadius: 50, fontWeight: 800, fontSize: 12,
              letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
              background: fg, color: bg, transition: "transform 0.2s, box-shadow 0.2s"
            }} className="hz-btn-primary">
              Shop Now
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/collections/premium" style={{
              display: "inline-flex", alignItems: "center",
              padding: "14px 22px", borderRadius: 50, fontWeight: 700, fontSize: 12,
              letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
              border: `1px solid ${borderC}`, color: muted, background: "transparent"
            }} className="hz-btn-ghost">
              Lookbook
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28 }}>
            {[["240GSM", "Fabric"], ["15+", "Colors"], ["100%", "Bio-washed"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: "clamp(18px, 2vw, 28px)", fontWeight: 900, letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Gorilla — fixed height 100% ── */}
        <div style={{
          width: "clamp(300px, 36vw, 600px)",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div
            ref={charRef}
            onMouseEnter={cycleImage}
            onClick={cycleImage}
            style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              cursor: "pointer", WebkitTapHighlightColor: "transparent",
              position: "relative",
            }}
            className="hz-char"
          >
            <Image
              src={currentImage}
              alt="GenZonic Gorilla"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              style={{
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: `drop-shadow(0 20px 50px ${darkMode ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.18)"})`,
              }}
            />
            {/* Hover hint */}
            <div className="hz-hint" style={{ color: muted }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hover to change color
            </div>
          </div>
        </div>

        {/* ── RIGHT: Specs ── */}
        <div className="hz-right-col" style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 6% 0 0", gap: 0, alignItems: "flex-end", textAlign: "right"
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase", color: accent, marginBottom: 20 }}>
            WHAT'S INSIDE
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 0, width: "100%", maxWidth: 260 }}>
            {[
              "Heavyweight 240GSM Cotton",
              "Drop-Shoulder Silhouette",
              "High-Density Puff Print",
              "Pre-shrunk & Bio-washed",
              "Reinforced Ribbed Collar",
              "Unisex Oversized Cut",
            ].map((s, i) => (
              <li key={s} style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
                fontSize: 13, fontWeight: 500, color: muted,
                padding: "12px 0",
                borderBottom: i < 5 ? `1px solid ${borderC}` : "none",
              }}>
                {s}
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0 }} />
              </li>
            ))}
          </ul>

          {/* Tag */}
          <div style={{
            display: "inline-block", padding: "10px 18px", borderRadius: 8,
            background: darkMode ? "rgba(255,69,0,0.12)" : "rgba(255,69,0,0.09)",
            color: accent, fontSize: 11, fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase"
          }}>
            BUILT FOR THE BOLD.
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE (<1024px) — flex column, 100dvh
      ═══════════════════════════════════════════ */}
      <div className="hz-mob" style={{
        display: "none", flexDirection: "column", alignItems: "center", textAlign: "center",
        height: "100%", boxSizing: "border-box", position: "relative", zIndex: 10,
        padding: "90px 6% 24px",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          fontSize: 9, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase",
          border: `1px solid ${borderC}`, borderRadius: 100, padding: "6px 14px",
          color: accent, marginBottom: 18
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
          New Drop · 2025
        </div>

        {/* Headline */}
        <div style={{
          fontSize: "clamp(40px, 12.5vw, 68px)", fontWeight: 900, lineHeight: 0.92,
          letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: 16
        }}>
          <div>Dress Bold.</div>
          <div style={{ color: accent }}>Stay Raw.</div>
        </div>

        {/* Gorilla — fills flex space */}
        <div
          onClick={cycleImage}
          style={{
            flex: "1 1 0", width: "100%", maxWidth: 380, position: "relative",
            cursor: "pointer", minHeight: 0,
          }}
        >
          <Image
            src={currentImage}
            alt="GenZonic Gorilla"
            fill
            priority
            sizes="90vw"
            style={{
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: `drop-shadow(0 16px 40px ${darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.12)"})`,
            }}
          />
        </div>

        {/* Tap hint */}
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", color: muted, textTransform: "uppercase", marginBottom: 18, display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Tap to change color
        </div>

        {/* CTA */}
        <Link href="/shop/men" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "15px 0", borderRadius: 50, fontWeight: 800, fontSize: 13,
          letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none",
          background: fg, color: bg, width: "100%", maxWidth: 320, marginBottom: 20,
        }}>
          Shop Now
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Feature chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {["240GSM", "Drop-Shoulder", "Puff Print", "Bio-washed"].map(t => (
            <span key={t} style={{
              padding: "5px 12px", borderRadius: 100,
              background: cardBg, color: muted,
              fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase"
            }}>{t}</span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.7); }
        }

        .hz-char:hover .hz-hint { opacity: 1; }

        .hz-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
          white-space: nowrap;
          z-index: 10;
        }

        .hz-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.22);
        }

        .hz-btn-ghost:hover {
          background: ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} !important;
          transform: translateY(-2px);
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 1023px) {
          .hz-desk-grid { display: none !important; }
          .hz-mob { display: flex !important; }
        }

        @media (min-width: 1024px) {
          .hz-mob { display: none !important; }
        }
      `}</style>
    </section>
  )
}
