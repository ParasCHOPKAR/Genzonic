"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { useTheme } from "@/app/context/ThemeContext";
import { useCartStore } from "@/store/cartStore";
import { useWishlist } from "@/app/context/WishlistContext";

import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Search,
  User,
  LogOut,
  Key,
  BookOpen,
  Ticket,
  Shield,
  Box,
  Check
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  /* =========================
     CONTEXT & STORE
  ========================= */
  const { theme } = useTheme();
  const { cart } = useCartStore();
  const { wishlist } = useWishlist();

  /* =========================
     AUTH
  ========================= */
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  /* =========================
     ROUTE
  ========================= */
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  /* =========================
     STATES
  ========================= */
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 🔥 HYDRATION FIX STATE
  const [mounted, setMounted] = useState(false);

  /* =========================
     EFFECTS
  ========================= */
  // Hydration fix for Zustand persist & LocalStorage Context
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body Lock Effect
  useEffect(() => {
    if (categoryOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [categoryOpen, mobileMenuOpen]);

  /* =========================
     MATH & PARSERS
  ========================= */
  // Calculates true total (e.g., 2 Mediums + 1 Large = 3 total items)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Smart Name Parser
  const getDisplayName = () => {
    if (!user) return "";
    
    // If the user has a real name that isn't the default "GenZonic"
    if (user.name && !user.name.toLowerCase().includes("genzonic")) {
      return user.name.split(" ")[0];
    }
    
    // Fallback: Extract name from email (e.g. paraschopkar0@gmail.com -> paraschopkar0 -> Paras)
    if (user.email) {
      const emailName = user.email.split("@")[0].replace(/[0-9]/g, ""); // Removes numbers
      return emailName.charAt(0).toUpperCase() + emailName.slice(1); // Capitalizes first letter
    }
    
    return "VIP";
  };

  /* =========================
     MARQUEE TEXT
  ========================= */
  const marqueeText =
    "EVERY ORDER INCLUDES • CUSTOM GENZONIC KEYCHAIN • BRAND STORY CARD • EXCLUSIVE DISCOUNT CARD • CUSTOM PATCH & STICKERS • PREMIUM UTILITY BOX • MORE THAN JUST APPAREL — IT’S AN EXPERIENCE • ";

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <div className="top-marquee">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="marquee-inner">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="marquee-item">
                  {marqueeText}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">

          {/* ===== LOGO ===== */}
          <Link href="/" className="logo-wrapper">
            <Image
              src={
                theme === "dark"
                  ? "/bg-remove-white-text.png"
                  : "/bg-remove-black-text.png"
              }
              width={180}
              height={70}
              alt="GenZonic"
              className="brand-logo"
              priority
            />
          </Link>

          {/* ===== NAV LINKS (Hidden on Mobile via <style jsx>) ===== */}
          <nav className="nav-links desktop-only">
            <Link href="/shop/men" className="nav-item">Men</Link>
            <Link href="/shop/women" className="nav-item">Women</Link>
            <Link href="/shop/kids" className="nav-item">Kids</Link>
          </nav>

          {/* ===== RIGHT SIDE ===== */}
          <div className="nav-actions">

            {/* SEARCH (Hidden on Mobile via <style jsx>) */}
            <div className={`search-wrapper desktop-only ${searchOpen ? "active" : ""}`}>
              <input
                type="text"
                placeholder="SEARCH"
                className="search-input"
              />
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>
            </div>

            {/* COLLECTION BUTTON (Hidden on Mobile via <style jsx>) */}
            <button
              className="collections-btn premium-pop-btn desktop-only"
              onClick={() => setCategoryOpen(true)}
            >
              PREMIUM COLLECTION <ChevronDown size={16} />
            </button>

            {/* 🔥 WISHLIST BUTTON (Visible everywhere) 🔥 */}
            <Link href="/wishlist" className="wishlist-btn" style={{ position: "relative", display: "flex", alignItems: "center", textDecoration: "none", fontSize: "22px", marginRight: "10px", transition: "transform 0.2s" }}>
              ❤️
              {mounted && wishlist.length > 0 && (
                <span style={{ position: "absolute", top: "-5px", right: "-8px", backgroundColor: "#ef4444", color: "white", fontSize: "10px", fontWeight: "bold", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 2px 5px rgba(0,0,0,0.2)" }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 🔥 UPDATED CART BUTTON (Visible everywhere) 🔥 */}
            <Link href="/cart" className="cart-btn" style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <ShoppingCart size={26} />
              {mounted && cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>

            {/* ================= AUTH (Hidden on Mobile via <style jsx>) ================= */}
            <div className="auth-group desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className={`auth-btn ${isLogin ? "active-auth" : ""}`}
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <span className="user-name">
                    Hi, {getDisplayName()}
                  </span>
                  <Link href="/profile" className="profile-btn">
                    <User size={22} />
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" className="admin-btn">
                      Admin
                    </Link>
                  )}
                  <button
                    className="logout-btn"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut size={22} />
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON (Visible only on Mobile via <style jsx>) */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

          </div>
        </div>
      </header>

      {/* ================= TRUE MOBILE SIDEBAR (DRAWER) ================= */}
      {/* 1. Blurred Backdrop */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* 2. Slide-out Sidebar */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        
        <div className="sidebar-header">
          <span className="sidebar-title">NAVIGATION</span>
          <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="mobile-nav-links">
          <Link href="/shop/men" onClick={() => setMobileMenuOpen(false)}>MEN'S <span className="arrow">→</span></Link>
          <Link href="/shop/women" onClick={() => setMobileMenuOpen(false)}>WOMEN'S <span className="arrow">→</span></Link>
          <Link href="/shop/kids" onClick={() => setMobileMenuOpen(false)}>KID'S <span className="arrow">→</span></Link>
          
          <button 
            className="mobile-premium-trigger"
            onClick={() => {
              setMobileMenuOpen(false);
              setCategoryOpen(true);
            }}
          >
            PREMIUM VAULT <ChevronDown size={20} />
          </button>
        </div>

        <div className="mobile-auth-actions">
          <div className="mobile-search-box">
            <Search size={20} />
            <input type="text" placeholder="Search artifacts..." />
          </div>

          {!isAuthenticated ? (
            <Link href="/login" className="mobile-action-btn primary" onClick={() => setMobileMenuOpen(false)}>
              AUTHORIZE // SIGN IN
            </Link>
          ) : (
            <>
              {/* 🔥 Profile centered directly 🔥 */}
              <div className="mobile-user-tag">
                <User size={18} />
                <span>{user?.email}</span>
              </div>

              <Link href="/profile" className="mobile-action-btn outline" onClick={() => setMobileMenuOpen(false)}>
                MY PROFILE
              </Link>

              {user?.role === "admin" && (
                <Link href="/admin" className="mobile-action-btn admin" onClick={() => setMobileMenuOpen(false)}>
                  COMMAND CENTER
                </Link>
              )}
              
              <button className="mobile-action-btn danger" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut size={18} /> LOGOUT
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= CATEGORY OVERLAY ================= */}
      <div className={`category-overlay ${categoryOpen ? "show" : ""}`}>
        
        {/* OVERLAY HEADER */}
        <div className="overlay-header-split">
          <div className="overlay-brand-line">
            <Image
              src={
                theme === "dark"
                  ? "/bg-remove-white-text.png"
                  : "/bg-remove-black-text.png"
              }
              width={130}
              height={50}
              alt="GenZonic"
              className="overlay-logo"
            />
            <div className="overlay-divider-line"></div>
            <span className="overlay-inline-title">PREMIUM COLLECTION</span>
          </div>
          
          <button
            className="close-btn"
            onClick={() => setCategoryOpen(false)}
          >
            <X size={32} />
            <span className="desktop-only-text">CLOSE</span>
          </button>
        </div>

        {/* OVERLAY SPLIT BODY */}
        <div className="overlay-split-body">
          
          {/* LEFT COLUMN: NAVIGATION */}
          <div className="overlay-left-col">
            <div className="nav-vertical-list">
              <Link href="/shop/men" style={{ '--i': 1 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>
                MEN'S <span className="hover-arrow">→</span>
              </Link>
              <Link href="/shop/women" style={{ '--i': 2 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>
                WOMEN'S <span className="hover-arrow">→</span>
              </Link>
              <Link href="/shop/kids" style={{ '--i': 3 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>
                KID'S <span className="hover-arrow">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: PREMIUM SHOWCASE */}
          <div className="overlay-right-col">
            
            {/* Intro Text */}
            <div className="showcase-intro reveal-item" style={{ '--i': 1 } as React.CSSProperties}>
              <h3>THE ULTIMATE EXPERIENCE</h3>
              <p>GenZonic Premium bridges the gap between high-fashion presentation and core streetwear. It is not just clothing; it is a meticulously curated physical artifact.</p>
            </div>

            {/* Comparison Table */}
            <div className="showcase-comparison reveal-item" style={{ '--i': 2 } as React.CSSProperties}>
              <div className="comp-side regular-side">
                <h4>REGULAR</h4>
                <ul>
                  <li>GenZonic Core Garment</li>
                  <li>Standard Poly-mailer</li>
                  <li>Basic Tagging</li>
                </ul>
              </div>
              <div className="comp-side premium-side">
                <h4>PREMIUM</h4>
                <ul>
                  <li><Check size={16} strokeWidth={3}/> GenZonic Core Garment</li>
                  <li><Check size={16} strokeWidth={3}/> 5 Exclusive Artifacts</li>
                  <li><Check size={16} strokeWidth={3}/> Structured Vault Box</li>
                </ul>
              </div>
            </div>

            {/* Visual Items Grid */}
            <div className="showcase-items-grid">
              
              <div className="perk-card reveal-item" style={{ '--i': 3 } as React.CSSProperties}>
                <div className="perk-icon-wrapper"><Key size={28} strokeWidth={1.5} /></div>
                <div className="perk-info">
                  <h5>Custom Keychain</h5>
                  <p>Heavyweight matte metal with engraved branding.</p>
                </div>
              </div>

              <div className="perk-card reveal-item" style={{ '--i': 4 } as React.CSSProperties}>
                <div className="perk-icon-wrapper"><BookOpen size={28} strokeWidth={1.5} /></div>
                <div className="perk-info">
                  <h5>Brand Story Card</h5>
                  <p>High-GSM pressed paper detailing the lore.</p>
                </div>
              </div>

              <div className="perk-card reveal-item" style={{ '--i': 5 } as React.CSSProperties}>
                <div className="perk-icon-wrapper"><Ticket size={28} strokeWidth={1.5} /></div>
                <div className="perk-info">
                  <h5>Exclusive Discount</h5>
                  <p>A physical NFC-enabled card for future drops.</p>
                </div>
              </div>

              <div className="perk-card reveal-item" style={{ '--i': 6 } as React.CSSProperties}>
                <div className="perk-icon-wrapper"><Shield size={28} strokeWidth={1.5} /></div>
                <div className="perk-info">
                  <h5>Custom Patches</h5>
                  <p>Woven brand insignias with adhesive backing.</p>
                </div>
              </div>

              <div className="perk-card reveal-item box-card" style={{ '--i': 7 } as React.CSSProperties}>
                <div className="perk-icon-wrapper"><Box size={32} strokeWidth={1.5} /></div>
                <div className="perk-info">
                  <h5>Premium Utility Box</h5>
                  <p>A matte-black rigid structure designed to be kept and reused.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE MOBILE OVERRIDES ================= */}
      <style jsx>{`
        .wishlist-btn:hover {
          transform: scale(1.1);
        }
        
        /* Hide Mobile Sidebar by default on Desktop */
        .mobile-backdrop, .mobile-sidebar, .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 1024px) {
          /* 1. HIDE ALL DESKTOP NAVBAR ELEMENTS */
          :global(.desktop-only),
          :global(.nav-links),
          :global(.search-wrapper),
          :global(.collections-btn),
          :global(.auth-group) {
            display: none !important;
          }

          /* 2. FORCE NAVBAR ACTIONS TO ALIGN RIGHT */
          :global(.nav-actions) {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 15px !important;
            width: auto !important;
          }

          /* 3. SHOW HAMBURGER MENU */
          .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: var(--text, inherit);
            cursor: pointer;
            padding: 0;
          }

          /* 4. MOBILE SIDEBAR BACKDROP */
          .mobile-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 99998 !important; 
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .mobile-backdrop.open {
            opacity: 1;
            pointer-events: auto;
          }

          /* 5. MOBILE SIDEBAR DRAWER */
          .mobile-sidebar {
            display: flex;
            position: fixed;
            top: 0;
            right: 0;
            width: 85%;
            max-width: 400px;
            height: 100vh;
            background: var(--bg, #050505) !important; 
            color: var(--text, #ffffff);
            z-index: 99999 !important; 
            flex-direction: column;
            padding: 30px 25px;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
            overflow-y: auto;
          }
          .mobile-sidebar.open {
            transform: translateX(0);
          }

          /* SIDEBAR HEADER - Z-INDEX FIX SO IT ALWAYS CLICKS */
          .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); }
          .sidebar-title { font-size: 10px; font-weight: 900; letter-spacing: 3px; opacity: 0.5; }
          .sidebar-close-btn { 
            background: transparent; border: none; color: inherit; 
            cursor: pointer; display: flex; align-items: center; justify-content: center; 
            padding: 10px; margin-right: -10px; 
            position: relative; z-index: 100000 !important; /* Force top layer */
            pointer-events: auto;
          }

          /* SIDEBAR LINKS */
          .mobile-nav-links { display: flex; flex-direction: column; gap: 0; margin-bottom: 20px; }
          .mobile-nav-links a, .mobile-premium-trigger { font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: inherit; text-decoration: none; padding: 20px 0; border-bottom: 1px solid rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: space-between; background: transparent; border: none; width: 100%; cursor: pointer; text-align: left; outline: none; }
          .mobile-premium-trigger { color: #ffc107; }
          .arrow { opacity: 0.3; font-size: 20px; }

          /* SIDEBAR AUTH & SEARCH */
          .mobile-auth-actions { 
            display: flex; flex-direction: column; gap: 12px; 
            margin-top: 20px;
            padding-bottom: 40px; 
          }
          
          .mobile-search-box { display: flex; align-items: center; gap: 10px; background: rgba(128,128,128,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px; }
          .mobile-search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 14px; color: inherit; font-weight: 600; }
          
          /* 🔥 PROFILE CENTERED 🔥 */
          .mobile-user-tag { 
            display: flex; 
            align-items: center; 
            justify-content: center; /* Centers horizontally */
            gap: 8px; 
            font-size: 13px; 
            font-weight: 800; 
            opacity: 0.7; 
            padding: 10px 0 15px 0; 
            width: 100%; 
            text-align: center;
          }
          
          /* 🔥 IMPROVED BUTTON STYLING 🔥 */
          .mobile-action-btn { 
            display: flex; align-items: center; justify-content: center; gap: 10px; 
            width: 100%; padding: 16px; font-size: 12px; font-weight: 900; 
            letter-spacing: 2px; text-decoration: none; border-radius: 8px; 
            border: none; cursor: pointer; text-transform: uppercase; transition: 0.2s; 
          }
          .mobile-action-btn.primary { background: var(--text, #fff); color: var(--bg, #000); }
          
          /* Fixed the weird box around MY PROFILE */
          .mobile-action-btn.outline { 
            background: transparent; 
            color: var(--text); 
            border: 2px solid var(--text); /* Solid bold border instead of gray wireframe */
          }
          
          .mobile-action-btn.admin { background: #3b82f6; color: white; }
          .mobile-action-btn.danger { background: transparent; color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }

          /* PREMIUM OVERLAY MOBILE FIXES */
          :global(.overlay-split-body) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.desktop-only-text) { display: none !important; }
        }

        @media (max-width: 600px) {
          /* 🔥 LOGO ADJUSTED TO BE CLEARLY VISIBLE 🔥 */
          :global(.brand-logo) { 
            height: 36px !important; /* Increased height to make logo bigger */
            width: auto !important; 
            object-fit: contain !important;
          }
          
          :global(.cart-btn) svg { width: 24px; height: 24px; }
          .mobile-menu-btn svg { width: 28px; height: 28px; } /* Slightly larger hamburger */
          .mobile-sidebar { width: 90%; }
        }
      `}</style>
    </>
  );
}