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
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  User,
  LogOut,
  Key,
  BookOpen,
  Ticket,
  Shield,
  Box,
  Check,
  ShieldAlert
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
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getDisplayName = () => {
    if (!user) return "";
    if (user.name && !user.name.toLowerCase().includes("genzonic")) {
      return user.name.split(" ")[0];
    }
    if (user.email) {
      const emailName = user.email.split("@")[0].replace(/[0-9]/g, ""); 
      return emailName.charAt(0).toUpperCase() + emailName.slice(1); 
    }
    return "VIP";
  };

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

          {/* ===== NAV LINKS ===== */}
          <nav className="nav-links desktop-only">
            <Link href="/shop/men" className="nav-item">Men</Link>
            <Link href="/shop/women" className="nav-item">Women</Link>
            <Link href="/shop/kids" className="nav-item">Kids</Link>
          </nav>

          {/* ===== RIGHT SIDE ACTIONS - CSS GRID LAYOUT ===== */}
          <div className="nav-actions grid-layout">

            {/* SEARCH */}
            <div className={`search-wrapper desktop-only ${searchOpen ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="SEARCH"
                className="search-input"
              />
              <button
                className="icon-grid-btn"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>
            </div>

            {/* COLLECTION BUTTON */}
            <button
              className="collections-btn premium-pop-btn desktop-only"
              onClick={() => setCategoryOpen(true)}
              style={{ display: "flex", alignItems: "center", height: "40px", boxSizing: "border-box" }}
            >
              PREMIUM COLLECTION <ChevronDown size={16} style={{ marginLeft: '6px' }} />
            </button>

            {/* 🔥 WISHLIST BUTTON 🔥 */}
            <Link href="/wishlist" className="icon-grid-btn hover-scale" style={{ position: "relative" }}>
              <Heart size={24} strokeWidth={1.5} />
              {mounted && wishlist.length > 0 && (
                <span className="badge-pop">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 🔥 CART BUTTON 🔥 */}
            <Link href="/cart" className="icon-grid-btn hover-scale" style={{ position: "relative" }}>
              <ShoppingCart size={24} strokeWidth={1.5} />
              {mounted && cartCount > 0 && (
                <span className="badge-pop">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ================= AUTH ================= */}
            <div className="auth-group desktop-only grid-layout" style={{ gap: '10px' }}>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className={`auth-btn ${isLogin ? "active-auth" : ""}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", boxSizing: "border-box" }}
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <span className="user-name" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                    Hi, {getDisplayName()}
                  </span>
                  <Link href="/profile" className="icon-grid-btn hover-scale">
                    <User size={22} />
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" className="admin-btn" style={{ display: "flex", alignItems: "center", height: "40px", boxSizing: "border-box" }}>
                      Admin
                    </Link>
                  )}
                  <button
                    className="icon-grid-btn hover-scale"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
                  >
                    <LogOut size={22} />
                  </button>
                </>
              )}
            </div>

            {/* 🔥 MOBILE MENU BUTTON 🔥 */}
            <button
              className="mobile-menu-btn icon-grid-btn"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

          </div>
        </div>
      </header>

      {/* ================= TRUE MOBILE SIDEBAR (DRAWER) ================= */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        
        {/* HEADER */}
        <div className="sidebar-header">
          <span className="sidebar-title">NAVIGATION</span>
          <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={32} strokeWidth={1.5} />
          </button>
        </div>

        {/* SEARCH PILL (Sleek block) */}
        <div className="mobile-search-box">
          <Search size={20} opacity={0.6} />
          <input type="text" placeholder="Search the archive..." />
        </div>

        {/* SCROLLABLE MENU AREA */}
        <div className="mobile-scroll-area">
          
          {/* MAIN CATEGORIES - Massive & Clean */}
          <div className="mobile-nav-links">
            <Link href="/shop/men" style={{ '--delay': '0.05s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>MEN'S</span> <ChevronRight size={24} className="arrow" />
            </Link>
            <Link href="/shop/women" style={{ '--delay': '0.1s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>WOMEN'S</span> <ChevronRight size={24} className="arrow" />
            </Link>
            <Link href="/shop/kids" style={{ '--delay': '0.15s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>KID'S</span> <ChevronRight size={24} className="arrow" />
            </Link>
            <button 
              className="mobile-premium-trigger"
              style={{ '--delay': '0.2s' } as React.CSSProperties}
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoryOpen(true);
              }}
            >
              <span className="premium-text">PREMIUM VAULT</span> <ChevronDown size={24} />
            </button>
          </div>

          {/* SECONDARY PERSONAL MENU (Clean list, no bulky boxes) */}
          {isAuthenticated && (
            <div className="mobile-secondary-links">
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} strokeWidth={1.5} /> MY PROFILE
              </Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={20} strokeWidth={1.5} /> MY CART
                {mounted && cartCount > 0 && <span className="nav-counter">{cartCount}</span>}
              </Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={20} strokeWidth={1.5} /> SAVED STYLES
                {mounted && wishlist.length > 0 && <span className="nav-counter">{wishlist.length}</span>}
              </Link>
              
              {user?.role === "admin" && (
                <Link href="/admin" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
                  <ShieldAlert size={20} strokeWidth={1.5} /> COMMAND CENTER
                </Link>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM ANCHORED ACTIONS */}
        <div className="mobile-bottom-actions">
          {!isAuthenticated ? (
            <Link href="/login" className="mobile-action-btn primary" onClick={() => setMobileMenuOpen(false)}>
              AUTHORIZE // SIGN IN
            </Link>
          ) : (
            <div className="mobile-user-card">
              <div className="user-card-info">
                <span className="user-card-label">CURRENT VIP</span>
                <span className="user-card-email truncate">{user?.email}</span>
              </div>
              <button className="mobile-signout-btn" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut size={18} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ================= CATEGORY OVERLAY ================= */}
      <div className={`category-overlay ${categoryOpen ? "show" : ""}`}>
        <div className="overlay-header-split">
          <div className="overlay-brand-line">
            <Image src={theme === "dark" ? "/bg-remove-white-text.png" : "/bg-remove-black-text.png"} width={130} height={50} alt="GenZonic" className="overlay-logo" />
            <div className="overlay-divider-line"></div>
            <span className="overlay-inline-title">PREMIUM COLLECTION</span>
          </div>
          <button className="close-btn" onClick={() => setCategoryOpen(false)}>
            <X size={32} />
            <span className="desktop-only-text">CLOSE</span>
          </button>
        </div>

        <div className="overlay-split-body">
          <div className="overlay-left-col">
            <div className="nav-vertical-list">
              <Link href="/shop/men" style={{ '--i': 1 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>MEN'S <span className="hover-arrow">→</span></Link>
              <Link href="/shop/women" style={{ '--i': 2 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>WOMEN'S <span className="hover-arrow">→</span></Link>
              <Link href="/shop/kids" style={{ '--i': 3 } as React.CSSProperties} onClick={() => setCategoryOpen(false)}>KID'S <span className="hover-arrow">→</span></Link>
            </div>
          </div>
          <div className="overlay-right-col">
            <div className="showcase-intro reveal-item" style={{ '--i': 1 } as React.CSSProperties}>
              <h3>THE ULTIMATE EXPERIENCE</h3>
              <p>GenZonic Premium bridges the gap between high-fashion presentation and core streetwear. It is not just clothing; it is a meticulously curated physical artifact.</p>
            </div>
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
        /* 🔥 CSS GRID LAYOUT - FORCES PERFECT ALIGNMENT 🔥 */
        .grid-layout { display: grid !important; grid-auto-flow: column; align-items: center; gap: 12px; }
        .icon-grid-btn { display: grid !important; place-items: center !important; width: 40px !important; height: 40px !important; margin: 0 !important; padding: 0 !important; text-decoration: none !important; color: inherit !important; background: transparent; border: none; }
        .icon-grid-btn svg { display: block !important; margin: 0 !important; padding: 0 !important; }

        .hover-scale { transition: transform 0.2s ease; }
        .hover-scale:hover { transform: scale(1.1); }

        .badge-pop { position: absolute; top: 0px; right: 0px; background-color: #ef4444; color: white; font-size: 10px; font-weight: bold; border-radius: 50%; width: 18px; height: 18px; display: grid; place-items: center; box-shadow: 0px 2px 5px rgba(0,0,0,0.2); pointer-events: none; transform: translate(25%, -25%); }

        .mobile-backdrop, .mobile-sidebar, .mobile-menu-btn { display: none !important; }

        @media (max-width: 1024px) {
          .desktop-only, .nav-links, .search-wrapper, .collections-btn, .auth-group { display: none !important; }
          .nav-actions { width: auto !important; justify-content: flex-end; gap: 10px; }
          .mobile-menu-btn { display: grid !important; cursor: pointer; margin-left: 5px; }

          /* 1. BACKDROP */
          .mobile-backdrop { display: block !important; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 99998 !important; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
          .mobile-backdrop.open { opacity: 1; pointer-events: auto; }

          /* 2. SIDEBAR DRAWER - PREMIUM REDESIGN */
          .mobile-sidebar { 
            display: flex !important; flex-direction: column; position: fixed; top: 0; right: 0; 
            width: 100%; max-width: 420px; height: 100dvh; 
            background: var(--bg, #050505) !important; color: var(--text, #ffffff);
            z-index: 99999 !important; padding: 30px 25px 20px 25px; 
            transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid rgba(128,128,128,0.15); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
          }
          .mobile-sidebar.open { transform: translateX(0); }

          /* HEADER */
          .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
          .sidebar-title { font-size: 11px; font-weight: 900; letter-spacing: 4px; opacity: 0.5; margin: 0; }
          .sidebar-close-btn { background: transparent; border: none; color: inherit; cursor: pointer; padding: 5px; margin-right: -5px; transition: 0.2s; }
          .sidebar-close-btn:active { transform: scale(0.8); }

          /* SEARCH PILL - Sharp Streetwear Style */
          .mobile-search-box { 
            display: flex; align-items: center; gap: 12px; background: rgba(128,128,128,0.08); 
            padding: 16px 20px; border-radius: 8px; margin-bottom: 40px; 
            border: none; transition: 0.3s; flex-shrink: 0;
          }
          .mobile-search-box:focus-within { background: rgba(128,128,128,0.15); }
          .mobile-search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 14px; color: inherit; font-weight: 600; letter-spacing: 0.5px;}

          /* SCROLL AREA */
          .mobile-scroll-area {
            flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;
            -ms-overflow-style: none; scrollbar-width: none;
          }
          .mobile-scroll-area::-webkit-scrollbar { display: none; }

          /* MASSIVE NAV LINKS - Flex Fixed */
          .mobile-nav-links { display: flex; flex-direction: column; }
          .mobile-nav-links a, .mobile-premium-trigger { 
            display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important;
            width: 100%; font-size: clamp(26px, 8vw, 36px); font-weight: 900; letter-spacing: -1px; 
            color: inherit; text-decoration: none; padding: 22px 0; border-bottom: 1px solid rgba(128,128,128,0.15); 
            background: transparent; border-top: none; border-left: none; border-right: none; cursor: pointer; 
            opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            flex-wrap: nowrap !important; white-space: nowrap !important;
          }
          .mobile-sidebar.open .mobile-nav-links a, .mobile-sidebar.open .mobile-premium-trigger {
            opacity: 1; transform: translateY(0); transition-delay: var(--delay);
          }
          
          .mobile-premium-trigger { color: var(--text); border-bottom: none; padding-bottom: 20px; }
          .arrow { opacity: 0.3; transition: 0.3s; flex-shrink: 0; }
          .mobile-nav-links a:active .arrow { transform: translateX(6px); opacity: 1; }

          /* SECONDARY MENU (Clean List, No Border Box) */
          .mobile-secondary-links {
            display: flex; flex-direction: column; padding-top: 10px;
            opacity: 0; transform: translateY(15px); transition: all 0.4s ease 0.3s;
          }
          .mobile-sidebar.open .mobile-secondary-links { opacity: 1; transform: translateY(0); }

          .mobile-secondary-links a {
            display: flex; align-items: center; gap: 15px; padding: 16px 0;
            font-size: 16px; font-weight: 700; color: inherit; text-decoration: none;
            border-bottom: 1px solid rgba(128,128,128,0.08);
          }
          .mobile-secondary-links a:last-child { border-bottom: none; }
          .mobile-secondary-links a svg { opacity: 0.5; }
          
          .nav-counter { margin-left: auto; background: var(--text); color: var(--bg); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 900; }
          .admin-link { color: #3b82f6 !important; }
          .admin-link svg { color: #3b82f6 !important; opacity: 1 !important; }

          /* BOTTOM ANCHORED ACTIONS */
          .mobile-bottom-actions { 
            margin-top: 20px; padding-top: 25px; flex-shrink: 0;
            opacity: 0; transform: translateY(10px); transition: all 0.4s ease 0.4s; 
          }
          .mobile-sidebar.open .mobile-bottom-actions { opacity: 1; transform: translateY(0); }

          /* HIGH CONTRAST VIP CARD */
          .mobile-user-card {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--text); color: var(--bg); /* Inverted for emphasis */
            border-radius: 8px; padding: 16px 20px;
          }
          .user-card-info { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
          .user-card-label { font-size: 9px; font-weight: 900; letter-spacing: 2px; opacity: 0.6; }
          .user-card-email { font-size: 13px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px;}
          .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

          .mobile-signout-btn {
            background: rgba(128,128,128,0.15); color: inherit; border: none;
            width: 40px; height: 40px; border-radius: 6px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; flex-shrink: 0; transition: 0.2s;
          }
          .mobile-signout-btn:active { background: #ef4444; color: white; transform: scale(0.95); }

          .mobile-action-btn.primary { 
            display: flex; align-items: center; justify-content: center; 
            width: 100%; padding: 18px; font-size: 13px; font-weight: 900; 
            letter-spacing: 2px; text-decoration: none; border-radius: 8px; 
            background: var(--text); color: var(--bg); text-transform: uppercase; 
          }

          :global(.overlay-split-body) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.desktop-only-text) { display: none !important; }
        }

        @media (max-width: 600px) {
          :global(.brand-logo) { height: 36px !important; width: auto !important; object-fit: contain !important; }
          .mobile-sidebar { padding: 25px 20px 20px 20px; }
          .mobile-nav-links a, .mobile-premium-trigger { padding: 18px 0; }
        }
      `}</style>
    </>
  );
}