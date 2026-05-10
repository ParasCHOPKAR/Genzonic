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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Listen to scroll to highlight the correct sidebar button dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "privacy", "terms", "returns"];
      const scrollPosition = window.scrollY + 300; // Offset for navbar

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
          top: 140px; /* Sticks neatly below navbar */
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
          /* 🔥 This pushes the anchor target down so it doesn't hide behind the navbar! 🔥 */
          scroll-margin-top: 150px; 
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

        /* MOBILE FIXES */
        @media (max-width: 900px) {
          .policy-container { grid-template-columns: 1fr; gap: 40px; }
          .policy-wrapper { padding: 180px 5% 80px; }
          
          /* Turn Sidebar into a horizontal scrolling nav on mobile */
          .policy-sidebar { 
            top: 80px; 
            z-index: 100; 
            background: var(--bg); 
            margin: 0 -5%; /* Break out of padding */
            padding: 10px 5%;
            border-bottom: 1px solid rgba(128,128,128,0.1);
          }
          .sidebar-inner { padding: 0; border: none; background: transparent; }
          .sidebar-title { display: none; }
          .policy-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .policy-nav::-webkit-scrollbar { display: none; }
          .nav-btn { white-space: nowrap; width: auto; padding: 10px 16px; }
          
          .section-header { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}