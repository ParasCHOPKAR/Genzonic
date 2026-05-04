"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useTheme } from "@/app/context/ThemeContext"
import TextType from "./TextType"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function BrandStory() {
  const { theme } = useTheme()
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.set(".story-title span", { y: 80, opacity: 0 })
      gsap.set(".story-p", { y: 30, opacity: 0 })
      gsap.set(".stat", { y: 30, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      })

      tl.to(".story-title span", {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
      })

      tl.to(".story-p", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.4")

      tl.to(".stat", {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")

      // subtle parallax
      gsap.to(".content-grid", {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      })

      // slow kinetic loop
      gsap.to(".kinetic-text", {
        xPercent: -100,
        repeat: -1,
        duration: 40,
        ease: "none"
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="brand-story-section">

      {/* Background Text */}
      <div className="kinetic-container">
        <div className="kinetic-text">
          GENZONIC ARCHIVE // CREATIVE REBELS // FUTURE CORE // DIGITAL GENERATION //&nbsp;
          GENZONIC ARCHIVE // CREATIVE REBELS // FUTURE CORE // DIGITAL GENERATION //&nbsp;
        </div>
      </div>

      <div className="content-grid">

        {/* LEFT */}
        <div className="title-area">
          <span className="tech-id">[ STORY_VERSION_1.0 ]</span>

          <h2 className="story-title">
            <div className="line-hide"><span>BUILT FOR THE</span></div>
            <div className="line-hide">
              <span className="outline-text">NEXT GEN</span>
            </div>
          </h2>
        </div>

        {/* RIGHT */}
        <div className="description-area">

          <div className="story-p">
            <TextType 
              text={[
                "GenZonic is a premium streetwear brand engineered for the digital frontier.",
                "We create uniforms for creators, rebels, and the architects of modern culture.",
                "Every drop is a statement of hyper-functional design."
              ]}
              typingSpeed={40}
              deletingSpeed={20}
              pauseDuration={3000}
              startOnVisible={true}
              cursorCharacter="_"
              showCursor={true}
            />
          </div>

          <div className="stats-box">
            <div className="stat">
              <span className="stat-num">2026</span>
              <span className="stat-label">ESTABLISHED</span>
            </div>

            <div className="stat">
              <span className="stat-num">01</span>
              <span className="stat-label">INITIAL DROP</span>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .brand-story-section {
          --bg: ${theme === 'dark' ? '#0a0a0a' : '#ffffff'};
          --text: ${theme === 'dark' ? '#f2f2f2' : '#111111'};
          --border: rgba(0,0,0,0.08);

          position: relative;
          padding: 140px 6%;
          background: var(--bg);
          color: var(--text);
          overflow: hidden;
        }

        .kinetic-container {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotate(-4deg);
          width: 200%;
          opacity: 0.07;
          white-space: nowrap;
        }

        .kinetic-text { 
          font-size: 14vw; 
          font-weight: 900; 
          will-change: transform;
        }

        .content-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 70px;
          align-items: center;
        }

        .tech-id { 
          font-size: 10px; 
          letter-spacing: 3px; 
          opacity: 0.4; 
          margin-bottom: 18px; 
        }

        .story-title { 
          font-size: clamp(3rem, 7vw, 6rem); 
          line-height: 0.95; 
          font-weight: 900; 
          letter-spacing: -3px; 
        }

        .line-hide { overflow: hidden; }

        .outline-text { 
          -webkit-text-stroke: 1px var(--text); 
          color: transparent; 
        }

        .description-area { 
          max-width: 440px; 
        }

        .story-p { 
          font-size: 17px; 
          line-height: 1.7; 
          margin-bottom: 35px; 
          text-transform: uppercase; 
          font-family: monospace; 
          opacity: 0.85;
        }

        .stats-box { 
          display: flex; 
          gap: 30px; 
          border-top: 1px solid var(--border); 
          padding-top: 25px; 
        }

        .stat {
          padding-top: 10px;
          transition: 0.2s;
        }

        .stat:hover {
          transform: translateY(-3px);
        }

        .stat-num { 
          font-size: 22px; 
          font-weight: 800; 
        }

        .stat-label { 
          font-size: 9px; 
          letter-spacing: 2px; 
          opacity: 0.5; 
        }

        @media (max-width: 1024px) { 
          .content-grid { grid-template-columns: 1fr; } 
          .brand-story-section { padding: 100px 6%; } 
        }
      `}</style>
    </section>
  )
}