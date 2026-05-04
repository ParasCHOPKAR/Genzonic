"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/app/context/ThemeContext"

export default function Footer() {

  const footerRef = useRef<HTMLDivElement>(null)
  const bigTextRef = useRef<HTMLHeadingElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const { theme } = useTheme()
  const darkMode = theme === "dark"

  useEffect(() => {

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {

      gsap.from(".footer-content-block", {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%"
        }
      })

      gsap.fromTo(
        bigTextRef.current,
        { y: 120, scale: 0.85, opacity: 0.2 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1
          }
        }
      )

      gsap.to(logoRef.current, {
        y: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2.5
      })

    }, footerRef)

    return () => ctx.revert()

  }, [])


  const styles = {

    footer: {
      width: "100%",
      background: darkMode ? "#0a0a0a" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000",
      padding: "220px 0 120px",
      position: "relative" as const,
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      minHeight: "850px",
      transition: "background 0.6s ease"
    },

    gradient: {
      position: "absolute" as const,
      inset: 0,
      background: darkMode
        ? "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.06), transparent 60%)"
        : "radial-gradient(circle at 50% 120%, rgba(0,0,0,0.06), transparent 60%)",
      pointerEvents: "none" as const
    },

    grid: {
      width: "100%",
      maxWidth: "1400px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: "70px",
      padding: "0 6%",
      position: "relative" as const,
      zIndex: 2
    },

    logoImage: {
      width: "160px",
      marginBottom: "22px",
      transition: "all .4s ease"
    },

    desc: {
      fontSize: "15px",
      lineHeight: 1.7,
      color: darkMode ? "#bbb" : "#555",
      maxWidth: "340px"
    },

    title: {
      fontSize: "13px",
      letterSpacing: "0.25em",
      textTransform: "uppercase" as const,
      color: darkMode ? "#777" : "#888",
      marginBottom: "22px",
      fontWeight: 500
    },

    link: {
      display: "block",
      textDecoration: "none",
      fontSize: "16px",
      color: darkMode ? "#fff" : "#000",
      marginBottom: "14px",
      fontWeight: 500,
      position: "relative" as const
    },

    bigContainer: {
      width: "100%",
      marginTop: "60px",
      pointerEvents: "none" as const,
      display: "flex",
      justifyContent: "center"
    },

    bigText: {
      fontSize: "17vw", /* Default Desktop Size */
      fontWeight: 900,
      lineHeight: "0.85",
      letterSpacing: "-0.02em",
      margin: 0,
      color: darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.08)",
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const
    }

  }

  return (

    <footer ref={footerRef} style={styles.footer} className="footer-base">

      <div style={styles.gradient}></div>

      <div style={styles.grid} className="footer-grid">

        {/* LEFT BLOCK: BRANDING */}

        <div className="footer-content-block">

          <div ref={logoRef}>
            <Image
              src={darkMode ? "/bg-remove-white-okay.png" : "/bg-remove-black.png"}
              alt="GenZonic"
              width={170}
              height={60}
              style={styles.logoImage}
            />
          </div>

          <p style={styles.desc}>
            Bridging the gap between high-fashion presentation and core streetwear. More than just apparel—it is a curated physical artifact.
          </p>

        </div>


        {/* BLOCK 2: THE SHOP/VAULT */}

        <div className="footer-content-block">

          <h4 style={styles.title}>THE VAULT</h4>

          <Link href="/shop/men" className="f-link" style={styles.link}>Men's Artifacts</Link>
          <Link href="/shop/women" className="f-link" style={styles.link}>Women's Artifacts</Link>
          <Link href="/shop/kids" className="f-link" style={styles.link}>Kid's Artifacts</Link>

        </div>


        {/* BLOCK 3: USER/SUPPORT */}

        <div className="footer-content-block">

          <h4 style={styles.title}>SUPPORT</h4>

          <Link href="/profile" className="f-link" style={styles.link}>Access Profile</Link>
          <Link href="/cart" className="f-link" style={styles.link}>View Loadout</Link>
          <Link href="/contact" className="f-link" style={styles.link}>Contact Command</Link>

        </div>


        {/* BLOCK 4: LEGAL (Required for Razorpay) */}

        <div className="footer-content-block">

          <h4 style={styles.title}>LEGAL</h4>

          <Link href="/privacy" className="f-link" style={styles.link}>Privacy Policy</Link>
          <Link href="/terms" className="f-link" style={styles.link}>Terms & Conditions</Link>
          <Link href="/refunds" className="f-link" style={styles.link}>Refund Policy</Link>

        </div>

      </div>


      {/* BIG BACKGROUND TEXT */}

      <div style={styles.bigContainer}>
        <h1 ref={bigTextRef} style={styles.bigText} className="big-bg-text">
          GENZONIC
        </h1>
      </div>

      <style jsx>{`

      .f-link::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 0%;
        height: 1px;
        background: ${darkMode ? "#fff" : "#000"};
        transition: width .35s ease;
      }

      .f-link:hover::after {
        width: 100%;
      }

      .f-link:hover {
        transform: translateX(6px);
        color: #ffc107 !important;
        transition: all .3s ease;
      }

      /* 🔥 TABLET RESPONSIVE OVERRIDES 🔥 */
      @media (max-width: 900px) {
        .footer-base {
          padding: 150px 0 100px !important;
          min-height: 600px !important;
        }

        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 50px !important;
        }

        .footer-content-block:first-child {
          grid-column: span 2;
        }

        /* Scaled down to prevent overflow */
        .big-bg-text {
          font-size: 16vw !important; 
        }
      }

      /* 🔥 MOBILE RESPONSIVE OVERRIDES 🔥 */
      @media (max-width: 600px) {
        .footer-base {
          padding: 100px 0 60px !important;
          min-height: auto !important;
        }

        .footer-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }

        .footer-content-block:first-child {
          grid-column: span 1 !important;
        }

        /* 🔥 PERFECTLY SCALED MOBILE FIX 🔥 */
        .big-bg-text {
          font-size: 13vw !important; /* Reduced from 28vw so the full word fits */
          margin-top: 40px !important;
        }
      }

      `}</style>

    </footer>

  )
}