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

      gsap.set(".story-title span", { y: 100, opacity: 0 })
      gsap.set(".story-p", { y: 40, opacity: 0 })
      gsap.set(".stat", { y: 40, opacity: 0 })
      gsap.set(".tech-id", { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      })

      tl.to(".tech-id", {
        opacity: 0.6,
        duration: 0.8,
        ease: "power2.out",
      })

      tl.to(".story-title span", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6")

      tl.to(".story-p", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5")

      tl.to(".stat", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5")

      // subtle parallax
      gsap.to(".content-grid", {
        y: -40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      })

      // slow kinetic loop
      gsap.to(".kinetic-text", {
        xPercent: -50,
        repeat: -1,
        duration: 25,
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
          <span>GENZONIC ARCHIVE // CREATIVE REBELS // FUTURE CORE // DIGITAL GENERATION //</span>
          <span>GENZONIC ARCHIVE // CREATIVE REBELS // FUTURE CORE // DIGITAL GENERATION //</span>
        </div>
      </div>

      <div className="content-grid">

        {/* LEFT */}
        <div className="title-area">
          <span className="tech-id">[ STORY_VERSION_2.0 ]</span>

          <h2 className="story-title">
            <div className="line-hide"><span>BUILT FOR</span></div>
            <div className="line-hide"><span>THE NEXT</span></div>
            <div className="line-hide">
              <span className="outline-text">GENERATION</span>
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
              pauseDuration={4000}
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
          --bg: ${theme === 'dark' ? '#0a0a0a' : '#f0f0f0'};
          --text: ${theme === 'dark' ? '#f2f2f2' : '#111111'};
          --border: rgba(128,128,128,0.2);

          position: relative;
          padding: 160px 5%;
          background: var(--bg);
          color: var(--text);
          overflow: hidden;
        }

        .kinetic-container {
          position: absolute;
          top: 50%;
          left: 0;
          width: 200%;
          transform: translateY(-50%) rotate(-3deg);
          opacity: 0.04;
          white-space: nowrap;
          overflow: hidden;
          pointer-events: none;
        }

        .kinetic-text { 
          font-size: clamp(100px, 15vw, 200px); 
          font-weight: 950; 
          will-change: transform;
          display: inline-flex;
        }
        
        .kinetic-text span {
          padding-right: 50px;
        }

        .content-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
        }

        .tech-id { 
          font-size: 11px; 
          font-weight: 800;
          letter-spacing: 4px; 
          margin-bottom: 24px; 
          display: block;
        }

        .story-title { 
          font-size: clamp(3.5rem, 8vw, 7.5rem); 
          line-height: 0.9; 
          font-weight: 900; 
          letter-spacing: -3px; 
          margin: 0;
        }

        .line-hide { overflow: hidden; }
        
        .line-hide span {
          display: block;
        }

        .outline-text { 
          -webkit-text-stroke: 2px var(--text); 
          color: transparent; 
        }

        .description-area { 
          max-width: 500px; 
        }

        .story-p { 
          font-size: 18px; 
          line-height: 1.7; 
          margin-bottom: 50px; 
          text-transform: uppercase; 
          font-family: monospace; 
          opacity: 0.85;
          min-height: 120px;
        }

        .stats-box { 
          display: flex; 
          gap: 50px; 
          border-top: 1px solid var(--border); 
          padding-top: 30px; 
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-num { 
          font-size: 32px; 
          font-weight: 900; 
          line-height: 1;
        }

        .stat-label { 
          font-size: 10px; 
          letter-spacing: 3px; 
          font-weight: 800;
          opacity: 0.6; 
        }

        @media (max-width: 1200px) {
          .content-grid { gap: 40px; }
          .story-title { font-size: clamp(3.5rem, 7vw, 6rem); }
        }

        @media (max-width: 1024px) { 
          .content-grid { grid-template-columns: 1fr; gap: 60px; } 
          .brand-story-section { padding: 120px 5%; }
          .description-area { max-width: 100%; }
          .story-p { min-height: auto; }
        }
        
        @media (max-width: 600px) {
          .stats-box { gap: 30px; flex-direction: column; }
          .story-title { letter-spacing: -1px; }
          .outline-text { -webkit-text-stroke: 1px var(--text); }
        }
      `}</style>
    </section>
  )
}