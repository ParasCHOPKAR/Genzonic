"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/app/context/ThemeContext"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

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
      padding: "180px 0 100px",
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
      gridTemplateColumns: "1.2fr 1fr 1.2fr 1fr",
      gap: "60px",
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
      fontSize: "14px",
      lineHeight: 1.7,
      color: darkMode ? "#bbb" : "#555",
      maxWidth: "320px",
      marginBottom: "25px"
    },
    title: {
      fontSize: "13px",
      letterSpacing: "0.25em",
      textTransform: "uppercase" as const,
      color: darkMode ? "#777" : "#888",
      marginBottom: "25px",
      fontWeight: 800
    },
    link: {
      display: "inline-block",
      textDecoration: "none",
      fontSize: "15px",
      color: darkMode ? "#fff" : "#000",
      marginBottom: "16px",
      fontWeight: 600,
      position: "relative" as const
    },
    contactRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "15px",
      fontWeight: 500,
      color: darkMode ? "#ddd" : "#444",
      marginBottom: "16px"
    },
    bigContainer: {
      width: "100%",
      marginTop: "20px",
      pointerEvents: "none" as const,
      display: "flex",
      justifyContent: "center",
      position: "relative" as const,
      zIndex: 1
    },
    bigText: {
      fontSize: "17vw", 
      fontWeight: 900,
      lineHeight: "0.85",
      letterSpacing: "-0.02em",
      margin: 0,
      color: darkMode
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.05)",
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const
    }
  }

  return (
    <footer ref={footerRef} style={styles.footer} className="footer-base">
      <div style={styles.gradient}></div>

      <div style={styles.grid} className="footer-grid">
        {/* BLOCK 1: BRANDING & SOCIALS */}
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
            Premium streetwear bridging the gap between high-fashion presentation and core culture. More than just apparel — it's an experience.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/genzonic.official" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
          
          {/* Payment Trust Indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px", background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", padding: "8px 12px", width: "max-content", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: "bold", paddingRight: "6px", borderRight: "1px solid rgba(128,128,128,0.3)" }}>VISA</span>
            <span style={{ fontSize: "10px", fontWeight: "bold", paddingRight: "6px", borderRight: "1px solid rgba(128,128,128,0.3)", color: "#ef4444" }}>MC</span>
            <span style={{ fontSize: "10px", fontWeight: "bold", paddingRight: "6px", borderRight: "1px solid rgba(128,128,128,0.3)", color: "#00b4d8" }}>UPI</span>
            <span style={{ fontSize: "10px", fontWeight: "bold", color: "#f97316" }}>RuPay</span>
          </div>
        </div>

        {/* BLOCK 2: THE SHOP/VAULT */}
        <div className="footer-content-block">
          <h4 style={styles.title}>THE VAULT</h4>
          <div><Link href="/shop/men" className="f-link" style={styles.link}>Men's Artifacts</Link></div>
          <div><Link href="/shop/women" className="f-link" style={styles.link}>Women's Artifacts</Link></div>
          <div><Link href="/shop/kids" className="f-link" style={styles.link}>Kid's Artifacts</Link></div>
          <div><Link href="/about#about" className="f-link" style={styles.link}>About GenZonic</Link></div>
        </div>

        {/* BLOCK 3: CONTACT HQ */}
        <div className="footer-content-block">
          <h4 style={styles.title}>CONTACT HQ</h4>
          <div style={styles.contactRow}>
            <Mail size={18} opacity={0.7} />
            <a href="mailto:support@genzonic.store" className="contact-hover">support@genzonic.store</a>
          </div>
          <div style={styles.contactRow}>
            <Phone size={18} opacity={0.7} />
            <a href="tel:+918080363744" className="contact-hover">+91 8080363744</a>
          </div>
          <div style={{ ...styles.contactRow, alignItems: "flex-start" }}>
            <MapPin size={18} opacity={0.7} style={{ marginTop: "4px" }} />
            <span style={{ lineHeight: 1.5 }}>Pune, Maharashtra,<br/>India</span>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Link href="/contact" className="f-link" style={styles.link}>Open Support Ticket</Link>
          </div>
        </div>

        {/* BLOCK 4: LEGAL & POLICIES (🔥 RAZORPAY REQUIRED) */}
        <div className="footer-content-block">
          <h4 style={styles.title}>LEGAL & POLICIES</h4>
          <div><Link href="/about#privacy" className="f-link" style={styles.link}>Privacy Policy</Link></div>
          <div><Link href="/about#terms" className="f-link" style={styles.link}>Terms & Conditions</Link></div>
          <div><Link href="/about#shipping" className="f-link" style={styles.link}>Shipping & Delivery</Link></div>
          <div><Link href="/about#returns" className="f-link" style={styles.link}>Cancellation & Refunds</Link></div>
        </div>
      </div>

      {/* BOTTOM BAR: COPYRIGHT & DEVELOPER */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GENZONIC. ALL RIGHTS RESERVED.</p>
        <p>DEVELOPED BY <span className="highlight" style={{ color: "#ff3e00" }}>Paras Chopkar</span></p>
      </div>

      {/* BIG BACKGROUND TEXT */}
      <div style={styles.bigContainer}>
        <h1 ref={bigTextRef} style={styles.bigText} className="big-bg-text">
          GENZONIC
        </h1>
      </div>

      <style jsx>{`
      /* Link Hover Animations */
      .f-link::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 0%;
        height: 2px;
        background: ${darkMode ? "#fff" : "#000"};
        transition: width .35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .f-link:hover::after {
        width: 100%;
      }

      .f-link:hover {
        transform: translateX(6px);
        color: #ff3e00 !important;
        transition: transform .3s ease, color .3s ease;
      }

      /* Social Icons */
      .social-links {
        display: flex;
        gap: 20px;
        margin-top: 10px;
      }

      .social-links a {
        color: ${darkMode ? "#888" : "#666"};
        transition: 0.3s ease;
      }

      .social-links a:hover {
        color: ${darkMode ? "#fff" : "#000"};
        transform: translateY(-3px);
      }

      /* Contact Hover */
      .contact-hover {
        color: inherit;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .contact-hover:hover {
        color: #ff3e00;
      }

      /* Bottom Bar */
      .footer-bottom {
        width: 100%;
        max-width: 1400px;
        margin: 80px auto 0;
        padding: 30px 6% 0;
        border-top: 1px solid rgba(128,128,128,0.15);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        color: ${darkMode ? "#666" : "#888"};
        position: relative;
        z-index: 2;
      }

      .highlight {
        font-weight: 900;
      }

      /* 🔥 TABLET RESPONSIVE OVERRIDES 🔥 */
      @media (max-width: 900px) {
        .footer-base {
          padding: 120px 0 80px !important;
          min-height: auto !important;
        }

        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 50px !important;
        }

        .footer-content-block:first-child {
          grid-column: span 2;
        }

        .big-bg-text {
          font-size: 16vw !important; 
        }
      }

      /* 🔥 MOBILE RESPONSIVE OVERRIDES 🔥 */
      @media (max-width: 600px) {
        .footer-base {
          padding: 80px 0 40px !important;
        }

        .footer-grid {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }

        .footer-content-block:first-child {
          grid-column: span 1 !important;
        }

        .footer-bottom {
          flex-direction: column;
          gap: 15px;
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
        }

        /* Perfectly scaled mobile background text */
        .big-bg-text {
          font-size: 13vw !important; 
          margin-top: 40px !important;
        }
      }
      `}</style>
    </footer>
  )
}