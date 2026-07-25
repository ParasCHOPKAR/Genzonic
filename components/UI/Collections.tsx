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
      gsap.from(".header-box", {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".header-box",
          start: "top 85%",
        }
      })

      gsap.utils.toArray(".collection-card").forEach((card: any, i) => {
        const img = card.querySelector(".collection-img")
        
        gsap.fromTo(card, 
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: ".collections-grid",
              start: "top 75%",
            }
          }
        )

        gsap.to(img, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="collections-section">
      <div className="container">
        
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
            <div key={i} className={`collection-card card-${i}`}>
              <Link href={item.href} className="hidden-link-wrapper">
                
                <span className="card-tag">{item.tag}</span>
                
                <div className="image-clip">
                  <div className="image-container">
                    <Image
                      src={item.image}
                      fill
                      alt={item.title}
                      className="collection-img"
                      priority={i === 0}
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .collections-section {
          --bg: ${theme === 'dark' ? '#0a0a0a' : '#fcfcfc'};
          --text: ${theme === 'dark' ? '#ffffff' : '#0a0a0a'};
          --accent: ${theme === 'dark' ? '#111111' : '#f0f0f0'};
          
          padding: 100px 5%;
          background: var(--bg);
          color: var(--text);
          transition: background 0.5s ease;
        }

        .container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .header-box {
          margin-bottom: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 20px;
        }

        .tech-tag {
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 800;
          opacity: 0.5;
          margin-bottom: 12px;
          display: block;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -2px;
          margin: 0;
        }

        .outline-text {
          -webkit-text-stroke: 1px var(--text);
          color: transparent;
        }

        .section-description {
          max-width: 300px;
          font-size: 13px;
          line-height: 1.6;
          opacity: 0.6;
          font-weight: 500;
        }

        /* --- BENTO GRID LAYOUT --- */
        .collections-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          grid-template-rows: repeat(2, 320px);
          gap: 20px;
        }

        .card-0 { grid-column: 1 / 2; grid-row: 1 / 3; }
        .card-1 { grid-column: 2 / 3; grid-row: 1 / 2; }
        .card-2 { grid-column: 2 / 3; grid-row: 2 / 3; }

        .collection-card {
          position: relative;
          background: var(--accent);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .hidden-link-wrapper {
          display: block;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .card-tag {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          background: #fff;
          color: #000;
          padding: 6px 10px;
          border-radius: 4px;
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
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .collection-card:hover .collection-img {
          transform: scale(1.08);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
          z-index: 2;
          transition: opacity 0.5s ease;
        }
        
        .collection-card:hover .overlay {
          opacity: 0.8;
        }

        .content-box {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 30px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #ffffff;
        }

        .subtitle {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.8;
          display: block;
          margin-bottom: 8px;
          transform: translateY(10px);
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .card-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
          transform: translateY(10px);
          transition: transform 0.4s ease;
        }

        .card-0 .card-title {
          font-size: 3.5rem;
        }

        .collection-card:hover .subtitle,
        .collection-card:hover .card-title {
          transform: translateY(0);
        }

        .arrow-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #ffffff;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.8) translateX(-10px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .collection-card:hover .arrow-circle {
          transform: scale(1) translateX(0);
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .collections-grid { 
            grid-template-columns: 1fr; 
            grid-template-rows: auto;
            gap: 15px; 
          }
          
          .card-0, .card-1, .card-2 { 
            grid-column: 1 / 2; 
            grid-row: auto; 
            height: 400px;
          }
          
          .header-box { 
            flex-direction: column; 
            align-items: flex-start; 
          }
        }

        @media (max-width: 768px) {
          .collections-section { padding: 60px 5%; }
          .card-0, .card-1, .card-2 { height: 350px; }
          .card-0 .card-title { font-size: 2.5rem; }
          .content-box { padding: 20px; }
          .section-title { font-size: 2rem; }
        }
      `}</style>
    </section>
  )
}
