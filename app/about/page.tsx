"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Info, Shield, FileText, RefreshCw } from "lucide-react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("about");

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset added dynamically for mobile/desktop headers
      const offset = window.innerWidth < 900 ? 120 : 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Listen to scroll to highlight the correct sidebar button dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "privacy", "terms", "returns"];
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="policy-wrapper">
      <div className="policy-container">
        
        {/* ================= STICKY SIDEBAR ================= */}
        <aside className="policy-sidebar anim-item">
          <div className="sidebar-inner">
            <h3 className="sidebar-title">HQ DIRECTORY</h3>
            <nav className="policy-nav">
              <button className={`nav-btn ${activeSection === "about" ? "active" : ""}`} onClick={() => scrollToSection("about")}>
                <Info size={16} /> THE MANIFESTO
              </button>
              <button className={`nav-btn ${activeSection === "privacy" ? "active" : ""}`} onClick={() => scrollToSection("privacy")}>
                <Shield size={16} /> PRIVACY POLICY
              </button>
              <button className={`nav-btn ${activeSection === "terms" ? "active" : ""}`} onClick={() => scrollToSection("terms")}>
                <FileText size={16} /> TERMS & CONDITIONS
              </button>
              <button className={`nav-btn ${activeSection === "returns" ? "active" : ""}`} onClick={() => scrollToSection("returns")}>
                <RefreshCw size={16} /> RETURN POLICY
              </button>
            </nav>
          </div>
        </aside>

        {/* ================= CONTENT AREA ================= */}
        <main className="policy-content">
          
          {/* ABOUT SECTION */}
          <section id="about" className="content-section anim-item">
            <h1 className="section-header">THE MANIFESTO</h1>
            <p className="intro-text">
              GenZonic was forged to bridge the gap between high-fashion presentation and core streetwear. We don't just sell clothes; we dispatch curated physical artifacts.
            </p>
            <div className="text-block">
              <h3>OUR VISION</h3>
              <p>Every garment is treated as a collectible. From the heavyweight fabrics to the premium utility box packaging, the GenZonic experience is designed to be kept, remembered, and archived.</p>
            </div>
            <div className="text-block">
              <h3>THE ARTIFACT SYSTEM</h3>
              <p>We believe in quality over noise. Our drops are highly limited, meticulously crafted, and securely dispatched to VIPs across the nation.</p>
            </div>
          </section>

          <hr className="section-divider anim-item" />

          {/* PRIVACY POLICY */}
          <section id="privacy" className="content-section anim-item">
            <h1 className="section-header">PRIVACY POLICY</h1>
            <p className="intro-text">Your data is secured in our vault. We protect your logistics and payment information with enterprise-grade encryption.</p>
            <div className="text-block">
              <h3>1. DATA COLLECTION</h3>
              <p>We collect essential logistics data (Name, Address, Email, PIN Code) solely for the purpose of dispatching your artifacts and providing secure tracking updates.</p>
            </div>
            <div className="text-block">
              <h3>2. PAYMENT SECURITY</h3>
              <p>All financial transactions are handled via 256-bit encrypted gateways (Razorpay). GenZonic does not store or process your raw credit card or UPI PIN data on our servers.</p>
            </div>
          </section>

          <hr className="section-divider anim-item" />

          {/* TERMS & CONDITIONS */}
          <section id="terms" className="content-section anim-item">
            <h1 className="section-header">TERMS & CONDITIONS</h1>
            <p className="intro-text">By accessing the GenZonic Archive and acquiring artifacts, you agree to our operating protocols.</p>
            <div className="text-block">
              <h3>1. ARTIFACT AVAILABILITY</h3>
              <p>All items in the Premium Vault are subject to strict inventory limits. Adding an artifact to your Cart does not guarantee reservation until the checkout authorization is complete.</p>
            </div>
            <div className="text-block">
              <h3>2. PRICING & DISPATCH</h3>
              <p>Prices are listed in INR (₹) and are inclusive of standard taxes. Complimentary shipping is provided for all mainland India dispatches. Dispatch timelines may vary based on your sector.</p>
            </div>
          </section>

          <hr className="section-divider anim-item" />

          {/* RETURN POLICY */}
          <section id="returns" className="content-section anim-item">
            <h1 className="section-header">RETURN POLICY</h1>
            <p className="intro-text">Artifact compromised? We offer a streamlined replacement protocol.</p>
            <div className="text-block">
              <h3>1. REPLACEMENT WINDOW</h3>
              <p>You have exactly 7 days from the moment of successful delivery to initiate a replacement request if the artifact is damaged, misprinted, or the incorrect size.</p>
            </div>
            <div className="text-block">
              <h3>2. CONDITION OF RETURN</h3>
              <p>The artifact must be unworn, unwashed, and returned with all original premium packaging (Utility Box, Story Card, Keychain, Patches) intact. Missing components will void the authorization.</p>
            </div>
            <div className="text-block">
              <h3>3. REFUNDS</h3>
              <p>Once the returned artifact is inspected at our HQ, a refund will be processed directly to your original payment source within 5-7 business days.</p>
            </div>
          </section>

        </main>
      </div>

      <style jsx>{`
        /* PAGE BASE */
        .policy-wrapper { 
          padding: 220px 5% 100px; 
          background: var(--bg); 
          color: var(--text); 
          min-height: 100vh; 
          font-family: 'Inter', sans-serif; 
          overflow-x: hidden;
        }

        .policy-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          display: grid; 
          grid-template-columns: 280px 1fr; 
          gap: 60px; 
          align-items: start;
        }

        /* SIDEBAR STYLING */
        .policy-sidebar { 
          position: sticky; 
          top: 140px; 
        }
        
        .sidebar-inner {
          background: rgba(128,128,128,0.02);
          border: 1px solid rgba(128,128,128,0.1);
          border-radius: 8px;
          padding: 30px 20px;
        }

        .sidebar-title { 
          font-size: 11px; 
          font-weight: 900; 
          letter-spacing: 3px; 
          color: #888; 
          margin: 0 0 20px 0; 
          border-bottom: 1px solid rgba(128,128,128,0.1); 
          padding-bottom: 15px; 
        }

        .policy-nav { display: flex; flex-direction: column; gap: 5px; }
        
        .nav-btn { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          width: 100%; 
          padding: 14px 16px; 
          background: transparent; 
          border: none; 
          color: var(--text); 
          font-weight: 800; 
          font-size: 12px; 
          letter-spacing: 1px; 
          cursor: pointer; 
          text-align: left; 
          border-radius: 6px; 
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        
        .nav-btn:hover { background: rgba(128,128,128,0.05); opacity: 1; transform: translateX(4px); }
        .nav-btn.active { background: var(--text); color: var(--bg); opacity: 1; transform: translateX(4px); box-shadow: 4px 4px 0px rgba(128,128,128,0.2); }

        /* CONTENT STYLING */
        .content-section {
          padding-bottom: 40px;
        }

        .section-header { 
          font-size: 32px; 
          font-weight: 900; 
          letter-spacing: -1px; 
          margin: 0 0 20px 0; 
          text-transform: uppercase;
        }

        .intro-text { 
          font-size: 16px; 
          font-weight: 600; 
          line-height: 1.6; 
          color: #ffc107; 
          margin-bottom: 40px; 
        }

        .text-block { margin-bottom: 30px; }
        .text-block h3 { font-size: 14px; font-weight: 900; letter-spacing: 1px; margin: 0 0 10px 0; text-transform: uppercase; }
        .text-block p { font-size: 15px; line-height: 1.7; color: var(--text); opacity: 0.7; margin: 0; }

        .section-divider { 
          border: none; 
          border-top: 1px dashed rgba(128,128,128,0.2); 
          margin: 0 0 60px 0; 
        }

        /* 🔥 MOBILE FIXES - HORIZONTAL SCROLL NAV 🔥 */
        @media (max-width: 900px) {
          .policy-wrapper { padding: 120px 0 60px; } /* Remove side padding to let nav span full width */
          .policy-container { grid-template-columns: 1fr; gap: 30px; }
          .policy-content { padding: 0 5%; } /* Add padding back to content only */
          
          .policy-sidebar { 
            position: sticky; 
            top: 60px; /* Sits right under mobile header */
            z-index: 100; 
            background: var(--bg); 
            padding: 15px 5% 10px;
            border-bottom: 1px solid rgba(128,128,128,0.1);
          }
          
          .sidebar-inner { padding: 0; border: none; background: transparent; }
          .sidebar-title { display: none; }
          
          .policy-nav { 
            flex-direction: row; 
            overflow-x: auto; 
            padding-bottom: 5px; 
            gap: 12px;
            /* Hide scrollbars for clean look */
            scrollbar-width: none; 
            -ms-overflow-style: none;
          }
          .policy-nav::-webkit-scrollbar { display: none; }
          
          .nav-btn { 
            white-space: nowrap; 
            flex-shrink: 0; /* CRITICAL: Prevents squishing */
            width: max-content; 
            padding: 10px 18px; 
            border-radius: 30px; /* Pill shape for mobile */
            background: rgba(128,128,128,0.05);
            transform: none !important; /* Disable hover translation on mobile */
          }
          .nav-btn.active {
            box-shadow: none;
          }
          
          .section-header { font-size: 26px; }
        }
      `}</style>

      {/* 🔥 SAFELY WRAPPED GLOBAL STYLES 🔥 */}
      <style jsx global>{`
        .about {
          padding: 180px 8% 120px;
          position: relative;
          overflow-x: hidden;
          transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dark { background: #000; color: #fff; }
        .light { background: #fdfdfd; color: #000; }

        .grain {
          position: fixed;
          inset: 0;
          background: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.06;
          pointer-events: none;
          z-index: 5;
        }

        /* HERO */
        .overflow { 
          overflow: hidden; 
          display: block;
        }

        .hugeText {
          font-size: clamp(60px, 14vw, 200px);
          font-weight: 950;
          letter-spacing: -0.07em;
          line-height: 0.85;
          text-transform: uppercase;
          display: block;
        }

        .heroSub {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid currentColor;
          margin-top: 30px;
          padding-top: 15px;
          font-family: monospace;
          font-size: 11px;
          opacity: 0.7;
          letter-spacing: 0.1em;
        }

        /* STORY */
        .sectionWrapper {
          display: flex;
          margin: 220px 0;
          gap: 60px;
        }

        .sideLabel {
          font-family: monospace;
          font-size: 13px;
          opacity: 0.5;
        }

        .storyContent h2 {
          font-size: clamp(40px, 5vw, 70px);
          line-height: 1.1;
          margin-bottom: 45px;
          text-transform: uppercase;
          font-weight: 900;
        }

        /* VALUES GRID */
        .valuesGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: currentColor;
          border: 1px solid currentColor;
          margin-bottom: 180px;
        }

        .valueCard {
          background: var(--bg-color, inherit);
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .dark .valueCard { background: #000; }
        .light .valueCard { background: #fdfdfd; }

        .cardContent {
          position: relative;
          z-index: 2;
        }

        .valueCard:hover {
          background: #ff3e00 !important;
          color: #fff !important;
        }

        .cardIndicator {
          width: 45px;
          height: 3px;
          background: #ff3e00;
          margin: 25px 0;
          transition: background 0.3s;
        }

        .valueCard:hover .cardIndicator {
          background: #fff;
        }

        .valueCard h3 {
          font-size: 38px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -1.5px;
        }
        /* MISSION SECTION RE-DESIGN */
        .mission {
          padding: 100px 0 150px;
          position: relative;
        }

        .marqueeContainer {
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 60px;
          opacity: 0.3; /* Subtle background feel */
        }

        /* THE SPLIT - This fills the void */
        .missionSplit {
          display: grid;
          grid-template-columns: 1fr 1.5fr; /* Left side takes 40%, Right side 60% */
          gap: 80px;
          align-items: flex-start;
        }

        /* Left Side Decorative Content */
        .missionDetails {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding-top: 10px;
        }

        .detailItem {
          border-bottom: 1px solid rgba(128, 128, 128, 0.2);
          padding-bottom: 15px;
        }

        .detailItem span {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #ff3e00;
          display: block;
          margin-bottom: 5px;
        }

        .detailItem p {
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* Right Side Mission Text */
        .missionContent {
          padding: 0 0 0 60px;
          border-left: 8px solid #ff3e00;
          text-align: left;
        }

        .missionContent p {
          font-size: clamp(22px, 3vw, 36px); /* Larger font to occupy more visual weight */
          font-weight: 500;
          line-height: 1.1;
          text-transform: uppercase;
          margin: 0;
        }

        /* DARK MODE ADJUSTMENT */
        .dark .detailItem {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* MOBILE FIX */
        @media (max-width: 1024px) {
          .missionSplit {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          
          .missionContent {
            padding: 0 0 0 30px;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}