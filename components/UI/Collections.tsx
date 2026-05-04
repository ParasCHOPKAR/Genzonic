"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useTheme } from "@/app/context/ThemeContext"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Ensure the href paths match your Next.js routing structure exactly!
const items = [
  { title: "MEN", subtitle: "Urban Essentials", image: "/products/mens-store.jpg", tag: "NEW_DRP", href: "/shop/men" },
  { title: "WOMEN", subtitle: "Modern Street", image: "/products/women-store.jpg", tag: "LTD_EDT", href: "/shop/women" },
  { title: "KIDS", subtitle: "The Core Fit", image: "/products/mens-store.jpg", tag: "ESSNTL", href: "/shop/kids" },
]

export default function Collections() {
  const { theme } = useTheme()
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Dynamic Section Header Reveal
      gsap.from(".header-box", {
        y: 30,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".header-box",
          start: "top bottom",
          end: "bottom center",
          scrub: 1,
        }
      })

      // 2. Loop through cards to handle Scoping and Animations
      gsap.utils.toArray(".collection-card").forEach((card: any) => {
        const img = card.querySelector(".collection-img")
        const border = card.querySelector(".card-border")
        const arrow = card.querySelector(".arrow-circle")
        const title = card.querySelector(".card-title")

        // Continuous Card Entrance/Exit Animation
        gsap.fromTo(card, 
          { y: 50, opacity: 0.2, scale: 0.95 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 60%",
              scrub: true,
            }
          }
        )

        // Refined Parallax Effect
        gsap.to(img, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        })

        // 3. Hover Interactions
        const tl = gsap.timeline({ paused: true })
        
        tl.to(img, { scale: 1.1, duration: 0.8, ease: "power2.out" })
          .to(border, { opacity: 1, duration: 0.4 }, 0)
          .to(arrow, { x: 5, opacity: 1, scale: 1, duration: 0.4 }, 0)
          .to(title, { x: 10, duration: 0.4 }, 0)

        card.addEventListener("mouseenter", () => tl.play())
        card.addEventListener("mouseleave", () => tl.reverse())
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="collections-section">
      <div className="header-box">
        <div className="title-wrapper">
          <span className="tech-tag">GENZONIC // DROP_01</span>
          <h2 className="section-title">THE NEW <span className="outline-text">ERA</span></h2>
        </div>
        <p className="section-description">
          Hyper-functional design. Raw aesthetic. Reactive to the street.
        </p>
      </div>

      <div className="collections-grid">
        {items.map((item, i) => (
          <div key={i} className="collection-card">
            
            {/* 🔥 Wrapping the ENTIRE card content inside the Link 🔥 */}
            <Link href={item.href} className="hidden-link-wrapper">
              
              <div className="card-border" />
              <span className="card-tag">{item.tag}</span>
              
              <div className="image-clip">
                <div className="image-container">
                  <Image
                    src={item.image}
                    fill
                    alt={item.title}
                    className="collection-img"
                    priority
                  />
                  <div className="overlay" />
                </div>
              </div>

              <div className="content-box">
                <div className="text-group">
                  <span className="subtitle">{item.subtitle}</span>
                  <h3 className="card-title">{item.title}</h3>
                </div>
                
                <div className="arrow-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="square" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
            </Link>

          </div>
        ))}
      </div>

      <style jsx>{`
        .collections-section {
          --bg: ${theme === 'dark' ? '#000000' : '#ffffff'};
          --text: ${theme === 'dark' ? '#ffffff' : '#000000'};
          --accent: ${theme === 'dark' ? '#111111' : '#f8f8f8'};
          
          padding: 80px 6%;
          background: var(--bg);
          color: var(--text);
          transition: background 0.5s ease;
        }

        .header-box {
          margin-bottom: 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .tech-tag {
          font-size: 10px;
          letter-spacing: 6px;
          font-weight: 800;
          opacity: 0.5;
          margin-bottom: 10px;
          display: block;
        }

        .section-title {
          font-size: clamp(2.5rem, 8vw, 5.5rem);
          font-weight: 950;
          line-height: 0.9;
          letter-spacing: -4px;
          margin: 0;
        }

        .outline-text {
          -webkit-text-stroke: 1px var(--text);
          color: transparent;
        }

        .section-description {
          max-width: 250px;
          font-size: 12px;
          line-height: 1.5;
          opacity: 0.5;
          text-transform: uppercase;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .collection-card {
          position: relative;
          height: 520px;
          background: var(--accent);
          overflow: hidden;
          border-radius: 4px;
        }

        /* 🔥 This invisible link spans the whole card and handles the click 🔥 */
        .hidden-link-wrapper {
          display: block;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 20; /* Ensures it sits above everything else */
        }

        .card-border {
          position: absolute;
          inset: 0;
          border: 1.5px solid var(--text);
          z-index: 10;
          opacity: 0;
          pointer-events: none;
        }

        .card-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 5;
          font-size: 9px;
          font-weight: 900;
          background: var(--text);
          color: var(--bg);
          padding: 3px 8px;
        }

        .image-clip {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          height: 115%;
          width: 100%;
          top: -7%; 
        }

        .collection-img {
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          z-index: 2;
        }

        .content-box {
          position: absolute;
          bottom: 30px;
          left: 30px;
          right: 30px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }

        .subtitle {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.8;
          display: block;
        }

        .card-title {
          font-size: 2rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
        }

        .arrow-circle {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.8);
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
        }

        @media (max-width: 1024px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .collection-card { height: 450px; }
          .header-box { flex-direction: column; align-items: flex-start; margin-bottom: 40px; }
          .section-description { max-width: 100%; margin-top: 10px; }
        }

        @media (max-width: 768px) {
          .collections-section { padding: 60px 5%; }
          .collections-grid { grid-template-columns: 1fr; gap: 15px; }
          .collection-card { height: 400px; }
          .section-title { font-size: clamp(2.5rem, 12vw, 4rem); letter-spacing: -2px; }
          .card-title { font-size: 1.8rem; }
          .content-box { bottom: 20px; left: 20px; right: 20px; }
        }
      `}</style>
    </section>
  )
}
