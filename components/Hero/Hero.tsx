"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useTheme } from "@/app/context/ThemeContext"

const COLORWAYS = [
  { label: "Mustard",    color: "#c8902a", img: "/hero/mustard-tshirt-gorila-removebg-preview.png" },
  { label: "Black",      color: "#1a1a1a", img: "/hero/black-tshirt-gorilaa-removebg-preview.png" },
  { label: "White",      color: "#f0ede8", img: "/hero/white-tshirt-gorila-removebg-preview.png" },
  { label: "Beige",      color: "#d4c5a9", img: "/hero/beige-tshirt-gorila-removebg-preview.png" },
  { label: "Coffee",     color: "#6b3f2a", img: "/hero/cofeeee-tshirt-gorila-removebg-preview.png" },
  { label: "Navy",       color: "#2d3d5c", img: "/hero/Navy-Millange-tshirt-gorila-removebg-preview.png" },
  { label: "Olive",      color: "#5a6040", img: "/hero/Olive-tshirt-gorila-removebg-preview.png" },
  { label: "Purple",     color: "#5b3d7a", img: "/hero/purple-tshirt-gorila-removebg-preview.png" },
  { label: "Airforce",   color: "#4a7299", img: "/hero/airforce-tshirt-gorila-removebg-preview.png" },
  { label: "Wine",       color: "#7a1f35", img: "/hero/winee-tshirt-gorila-removebg-preview.png" },
]

export default function Hero() {
  const heroRef  = useRef<HTMLDivElement>(null)
  const charRef  = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const darkMode = theme === "dark"

  const [activeIdx, setActiveIdx] = useState(0)
  const [introPlaying, setIntroPlaying] = useState(true)

  useEffect(() => {
    let t: NodeJS.Timeout
    if (introPlaying) {
      t = setTimeout(() => setIntroPlaying(false), 4000)
    }
    return () => clearTimeout(t)
  }, [introPlaying])

  const switchTo = (i: number) => {
    if (!charRef.current || i === activeIdx) return
    gsap.to(charRef.current, {
      opacity: 0, scale: 0.95, filter: "blur(8px)", duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActiveIdx(i)
        gsap.to(charRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" })
      }
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from(".hz-badge",   { y: -14, opacity: 0, duration: 0.5, ease: "power3.out" })
        .from(".hz-h1 > div",{ y: 40,  opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" }, "-=0.3")
        .from(".hz-desc",    { y: 14,  opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".hz-actions", { y: 14,  opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".hz-stats",   { y: 14,  opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(charRef.current, { y: 30, opacity: 0, filter: "blur(20px)", duration: 1.0, ease: "expo.out" }, "-=0.9")
        .from(".hz-swatches",{ y: 12,  opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .from(".hz-specs li", { x: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, "-=0.5")
      gsap.to(charRef.current, { y: "-=12", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" })
    }, heroRef)
    return () => ctx.revert()
  }, [darkMode])

  /* tokens */
  const bg       = darkMode ? "#0a0a0a"  : "#f5f5f2"
  const fg       = darkMode ? "#ffffff"  : "#0a0a0a"
  const accent   = "#ff4500"
  const muted    = darkMode ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)"
  const cardBg   = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
  const borderC  = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"

  return (
    <section ref={heroRef} style={{ background: bg, color: fg, height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>

      {/* noise */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
        opacity: darkMode ? 0.03 : 0.05,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* center glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"55vw", height:"55vw", borderRadius:"50%", pointerEvents:"none", zIndex:1,
        background:`radial-gradient(circle, ${darkMode?"rgba(255,69,0,0.13)":"rgba(255,69,0,0.07)"} 0%, transparent 65%)`
      }} />

      {/* watermark */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        fontSize:"clamp(80px,20vw,360px)", fontWeight:900, letterSpacing:"-0.05em",
        color: darkMode?"rgba(255,255,255,0.023)":"rgba(0,0,0,0.028)",
        zIndex:1, pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap"
      }}>GENZONIC</div>

      {/* ══════════════════════════════════════════
          DESKTOP GRID
      ══════════════════════════════════════════ */}
      <div className="hz-grid">

        {/* LEFT */}
        <div className="hz-left">
          <div className="hz-badge" style={{ border:`1px solid ${borderC}`, color:accent }}>
            <span className="hz-dot" style={{ background:accent }} />
            New Drop · 2025
          </div>

          <h1 className="hz-h1">
            <div>Dress Bold.</div>
            <div style={{ color:accent }}>Stay Raw.</div>
          </h1>

          <p className="hz-desc" style={{ color:muted }}>
            Premium streetwear for people who don't follow trends — they set them.
          </p>

          <div className="hz-actions">
            <Link href="/shop/men" className="hz-btn-fill">
              Shop Now
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="hz-btn-arrow">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="hz-stats">
            {[["240GSM","Cotton"],["15+","Colors"],["100%","Bio-washed"]].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:900 }}>{v}</div>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1.8px", textTransform:"uppercase", color:muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — gorilla + swatches */}
        <div className="hz-center">
          {/* clickable label — always visible */}
          <div className="hz-click-label" style={{ color:muted }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M20 12a8 8 0 1 1-8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Click to change color
          </div>

          {/* gorilla image or intro video */}
          <div
            ref={charRef}
            className="hz-char"
            onClick={() => introPlaying ? setIntroPlaying(false) : switchTo((activeIdx + 1) % COLORWAYS.length)}
            title="Click to change colorway"
          >
            <video 
              src="/herovideo-01111.webm" 
              autoPlay muted playsInline loop
              style={{ 
                width: "100%", height: "100%", objectFit: "contain", 
                objectPosition: "bottom center",
                transformOrigin: "bottom center",
                transform: "scale(2.0)",
                mixBlendMode: darkMode ? "screen" : "normal",
                position: "absolute", inset: 0, zIndex: 10,
                pointerEvents: "none",
                opacity: introPlaying ? 1 : 0,
                transition: "opacity 1.5s ease-in-out"
              }}
            />
            
            <div style={{ opacity: introPlaying ? 0 : 1, transition: "opacity 1.5s ease-in-out", height: "100%", width: "100%", position: "relative" }}>
              {/* pulsing ring to signal clickability */}
              <div className="hz-ring" style={{ borderColor: darkMode?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.1)" }} />

              <Image
                src={COLORWAYS[activeIdx].img}
                alt={`GenZonic ${COLORWAYS[activeIdx].label} T-shirt`}
                fill
                priority
                sizes="(max-width:1023px) 90vw, 38vw"
                style={{
                  objectFit:"contain",
                  objectPosition:"bottom center",
                  filter:`drop-shadow(0 18px 42px ${darkMode?"rgba(0,0,0,0.6)":"rgba(0,0,0,0.15)"})`,
                }}
              />
            </div>
          </div>

          {/* Color swatches — always visible, clearly labeled */}
          <div className="hz-swatches">
            <span className="hz-sw-label" style={{ color:muted }}>
              {COLORWAYS[activeIdx].label}
            </span>
            <div className="hz-sw-row">
              {COLORWAYS.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => switchTo(i)}
                  onMouseEnter={() => switchTo(i)}
                  title={c.label}
                  className="hz-swatch"
                  style={{
                    background: c.color,
                    outline: i === activeIdx ? `2px solid ${accent}` : `2px solid transparent`,
                    outlineOffset: 2,
                    transform: i === activeIdx ? "scale(1.25)" : "scale(1)",
                  }}
                  aria-label={`Select ${c.label} colorway`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hz-right">
          <div className="hz-specs-head" style={{ color:accent }}>WHAT'S INSIDE</div>
          <ul className="hz-specs">
            {["240GSM Heavyweight Cotton","Drop-Shoulder Fit","High-Density Puff Print","Pre-shrunk & Bio-washed","Reinforced Ribbed Collar","Unisex Oversized Cut"].map((s,i,arr)=>(
              <li key={s} style={{ borderBottom: i < arr.length-1 ? `1px solid ${borderC}` : "none", color:muted }}>
                <span className="hz-spec-dot" style={{ background:accent }} />
                {s}
              </li>
            ))}
          </ul>
          <div className="hz-tag" style={{ background: darkMode?"rgba(255,69,0,0.12)":"rgba(255,69,0,0.09)", color:accent }}>
            BUILT FOR THE BOLD.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE STACK
      ══════════════════════════════════════════ */}
      <div className="hz-mob">
        <div className="hz-badge hz-badge-sm" style={{ border:`1px solid ${borderC}`, color:accent }}>
          <span className="hz-dot" style={{ background:accent }} />
          New Drop · 2025
        </div>

        <div className="hz-h1 hz-h1-sm">
          <div>Dress Bold.</div>
          <div style={{ color:accent }}>Stay Raw.</div>
        </div>

        {/* gorilla — no text overlay */}
        <div className="hz-mob-img" onClick={() => introPlaying ? setIntroPlaying(false) : switchTo((activeIdx + 1) % COLORWAYS.length)}>
          <video 
            src="/herovideo-01111.webm" 
            autoPlay muted playsInline loop
            style={{ 
              width: "100%", height: "100%", objectFit: "contain", 
              objectPosition: "bottom center",
              transformOrigin: "bottom center",
              transform: "scale(2.0)",
              mixBlendMode: darkMode ? "screen" : "normal",
              position: "absolute", inset: 0, zIndex: 10,
              pointerEvents: "none",
              opacity: introPlaying ? 1 : 0,
              transition: "opacity 1.5s ease-in-out"
            }}
          />
          <div style={{ opacity: introPlaying ? 0 : 1, transition: "opacity 1.5s ease-in-out", height: "100%", width: "100%", position: "relative" }}>
            <Image
              src={COLORWAYS[activeIdx].img}
              alt={`GenZonic ${COLORWAYS[activeIdx].label}`}
              fill
              priority
              sizes="90vw"
              style={{ objectFit:"contain", objectPosition:"bottom center",
                filter:`drop-shadow(0 14px 32px ${darkMode?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.12)"})` }}
            />
          </div>
        </div>

        {/* swatches + tap hint */}
        <div className="hz-swatches hz-sw-sm">
          <div className="hz-sw-tap-hint" style={{ color: muted }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M20 12a8 8 0 1 1-8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tap image · {COLORWAYS[activeIdx].label}
          </div>
          <div className="hz-sw-row">
            {COLORWAYS.map((c,i)=>(
              <button key={c.label} onClick={()=>switchTo(i)} onMouseEnter={()=>switchTo(i)} title={c.label} className="hz-swatch"
                style={{ background:c.color,
                  outline: i===activeIdx?`2px solid ${accent}`:"2px solid transparent",
                  outlineOffset:2, transform:i===activeIdx?"scale(1.25)":"scale(1)" }}
                aria-label={`Select ${c.label}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/shop/men" className="hz-btn-fill hz-btn-full">
          Shop Now
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="hz-btn-arrow">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

      </div>

      <style jsx>{`
        @keyframes pulseDot { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes ringPulse {
          0%   { transform:translate(-50%,-50%) scale(1);   opacity:0.5; }
          80%  { transform:translate(-50%,-50%) scale(1.18); opacity:0; }
          100% { opacity:0; }
        }

        /* ─ GRID ─ */
        .hz-grid {
          display:grid;
          grid-template-columns:1fr clamp(280px,36vw,560px) 1fr;
          height:100%;
          position:relative;
          z-index:10;
        }
        .hz-mob { display:none; }

        /* ─ LEFT ─ */
        .hz-left {
          display:flex; flex-direction:column; justify-content:center;
          padding:0 0 0 6%; gap:0; z-index:20;
        }

        .hz-badge {
          display:inline-flex; align-items:center; gap:7px;
          font-size:10px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase;
          border-radius:100px; padding:6px 15px; width:fit-content; margin-bottom:24px;
        }
        .hz-dot {
          width:6px; height:6px; border-radius:50%; flex-shrink:0;
          animation:pulseDot 2s infinite ease-in-out;
        }

        .hz-h1 {
          font-size:clamp(44px,5vw,82px); font-weight:900; line-height:0.93;
          letter-spacing:-0.04em; text-transform:uppercase; margin-bottom:22px;
        }

        .hz-desc {
          font-size:14px; line-height:1.7; font-weight:500;
          margin:0 0 30px; max-width:280px;
        }

        .hz-actions {
          display:flex; gap:10px; flex-wrap:wrap; margin-bottom:36px; align-items:center;
        }
        .hz-btn-fill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 40px;
          border-radius: 100px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          background: linear-gradient(135deg, #ff6a00 0%, #ff3300 100%);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(255, 69, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: none;
          cursor: pointer;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        
        .hz-btn-fill::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-20deg);
          transition: all 0.5s ease;
        }

        .hz-btn-fill:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(255, 69, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        
        .hz-btn-fill:hover::after {
          left: 150%;
        }

        .hz-btn-arrow {
          transition: transform 0.25s ease;
        }
        .hz-btn-fill:hover .hz-btn-arrow {
          transform: translateX(3px);
        }

        .hz-stats { display:flex; gap:26px; }

        /* ─ CENTER ─ */
        .hz-center {
          display:flex; flex-direction:column; align-items:center;
          justify-content:flex-end; position:relative; overflow:visible; padding-bottom:50px;
        }

        .hz-click-label {
          position:absolute; top:18px; left:50%; transform:translateX(-50%);
          display:flex; align-items:center; gap:6px;
          font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          white-space:nowrap; z-index:20; animation:pulseDot 3s infinite ease-in-out;
        }

        .hz-char {
          position:relative; width:100%; flex:1; cursor:pointer;
          -webkit-tap-highlight-color:transparent; min-height:0;
        }
        .hz-char:hover { filter:brightness(1.03); }

        /* pulsing ring */
        .hz-ring {
          position:absolute; top:40%; left:50%;
          transform:translate(-50%,-50%);
          width:200px; height:200px; border-radius:50%;
          border:1.5px solid; pointer-events:none; z-index:5;
          animation:ringPulse 2.8s infinite ease-out;
        }

        /* swatches */
        .hz-swatches {
          display:flex; flex-direction:column; align-items:center; gap:10px;
          padding:10px 0 0; z-index:20; flex-shrink:0;
        }
        .hz-sw-label {
          font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
        }
        .hz-sw-row {
          display:flex; gap:8px; flex-wrap:wrap; justify-content:center;
        }
        .hz-swatch {
          width:22px; height:22px; border-radius:50%; cursor:pointer; border:none;
          transition:transform 0.18s,outline 0.18s; flex-shrink:0;
        }
        .hz-swatch:hover { transform:scale(1.3); }

        /* ─ RIGHT ─ */
        .hz-right {
          display:flex; flex-direction:column; justify-content:center;
          padding:0 6% 0 0; align-items:flex-end; text-align:right; z-index:20;
        }
        .hz-specs-head {
          font-size:10px; font-weight:800; letter-spacing:4px; text-transform:uppercase; margin-bottom:18px;
        }
        .hz-specs {
          list-style:none; padding:0; margin:0 0 24px;
          display:flex; flex-direction:column; width:100%; max-width:260px;
        }
        .hz-specs li {
          display:flex; align-items:center; justify-content:flex-end; gap:10px;
          font-size:12.5px; font-weight:500; padding:11px 0;
        }
        .hz-spec-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
        .hz-tag {
          display:inline-block; padding:9px 16px; border-radius:6px;
          font-size:10px; font-weight:900; letter-spacing:2px; text-transform:uppercase;
        }

        /* ─ MOBILE ─ */
        @media (max-width:1023px) {
          .hz-grid { display:none; }
          .hz-mob {
            display:flex; flex-direction:column; align-items:center; text-align:center;
            height:100%; box-sizing:border-box; padding:100px 5% 40px;
            position:relative; z-index:10; overflow:hidden;
          }

          .hz-badge-sm { margin-bottom:14px; }
          .hz-h1-sm {
            font-size:clamp(38px,11.5vw,64px);
            margin-bottom:10px;
            display:flex; flex-direction:column; align-items:center;
          }

          .hz-mob-img {
            flex:1 1 0; width:100%; max-width:380px; position:relative;
            cursor:pointer; -webkit-tap-highlight-color:transparent; min-height:0;
          }
          .hz-mob-click {
            position:absolute; top:12px; left:50%; transform:translateX(-50%);
            display:flex; align-items:center; gap:6px;
            font-size:9px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
            padding:6px 14px; border-radius:100px; white-space:nowrap; z-index:20;
            backdrop-filter:blur(6px);
          }

          .hz-sw-sm { padding:8px 0 0; }

          .hz-btn-full {
            width: 100%;
            max-width: 320px;
            margin-bottom: 12px;
            padding: 18px 32px;
            font-size: 15px;
          }

          .hz-sw-tap-hint {
            display:flex; align-items:center; gap:5px;
            font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
            margin-bottom:4px;
          }
        }

        @media (min-width:1024px) {
          .hz-mob { display:none !important; }
        }
      `}</style>
    </section>
  )
}
