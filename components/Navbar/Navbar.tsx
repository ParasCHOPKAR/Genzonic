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
  
  // HYDRATION FIX STATE
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

            {/* WISHLIST BUTTON */}
            <Link href="/wishlist" className="icon-grid-btn hover-scale" style={{ position: "relative" }}>
              <Heart size={24} strokeWidth={1.5} />
              {mounted && wishlist.length > 0 && (
                <span className="badge-pop">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* CART BUTTON */}
            <Link href="/cart" className="icon-grid-btn hover-scale" style={{ position: "relative" }}>
              <ShoppingCart size={24} strokeWidth={1.5} />
              {mounted && cartCount > 0 && (
                <span className="badge-pop">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* AUTH */}
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

            {/* MOBILE MENU BUTTON */}
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
        <div className="sidebar-scroll-container">
          
          {/* HEADER */}
          <div className="sidebar-header">
            <div className="sidebar-brand-box">
              <span className="sidebar-sys-text">SYS.NAV // 01</span>
              <Image 
                src={theme === "dark" ? "/bg-remove-white-text.png" : "/bg-remove-black-text.png"} 
                width={110} 
                height={40} 
                alt="GenZonic" 
                className="sidebar-logo" 
              />
            </div>
            <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={28} strokeWidth={1.5} />
            </button>
          </div>

          {/* SEARCH PILL */}
          <div className="mobile-search-box reveal-item-drawer" style={{ '--delay': '0.05s' } as React.CSSProperties}>
            <Search size={18} opacity={0.6} />
            <input type="text" placeholder="Search the archive..." />
          </div>

          {/* MAIN CATEGORIES */}
          <nav className="mobile-main-nav">
            <Link href="/shop/men" className="reveal-item-drawer" style={{ '--delay': '0.1s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>Men</span> <ChevronRight size={24} className="nav-arrow" />
            </Link>
            <Link href="/shop/women" className="reveal-item-drawer" style={{ '--delay': '0.15s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>Women</span> <ChevronRight size={24} className="nav-arrow" />
            </Link>
            <Link href="/shop/kids" className="reveal-item-drawer" style={{ '--delay': '0.2s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
              <span>Kids</span> <ChevronRight size={24} className="nav-arrow" />
            </Link>
            
            <button 
              className="mobile-premium-trigger reveal-item-drawer"
              style={{ '--delay': '0.25s' } as React.CSSProperties}
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoryOpen(true);
              }}
            >
              <span className="premium-text">Premium Vault</span> <ChevronDown size={24} />
            </button>
          </nav>

          {/* UTILITY GRID */}
          <div className="mobile-utilities reveal-item-drawer" style={{ '--delay': '0.3s' } as React.CSSProperties}>
            {!isAuthenticated ? (
              <Link href="/login" className="mobile-auth-prompt" onClick={() => setMobileMenuOpen(false)}>
                <Key size={18} />
                <span>AUTHORIZE // SIGN IN</span>
              </Link>
            ) : (
              <div className="utility-grid">
                <Link href="/profile" className="utility-card" onClick={() => setMobileMenuOpen(false)}>
                  <User size={22} strokeWidth={1.5} />
                  <span>Profile</span>
                </Link>
                <Link href="/cart" className="utility-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-with-badge">
                    <ShoppingCart size={22} strokeWidth={1.5} />
                    {mounted && cartCount > 0 && <span className="util-badge">{cartCount}</span>}
                  </div>
                  <span>Cart</span>
                </Link>
                <Link href="/wishlist" className="utility-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-with-badge">
                    <Heart size={22} strokeWidth={1.5} />
                    {mounted && wishlist.length > 0 && <span className="util-badge">{wishlist.length}</span>}
                  </div>
                  <span>Saved</span>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="utility-card admin-card" onClick={() => setMobileMenuOpen(false)}>
                    <ShieldAlert size={22} strokeWidth={1.5} />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM ANCHORED VIP CARD */}
          {isAuthenticated && (
            <div className="mobile-footer reveal-item-drawer" style={{ '--delay': '0.4s' } as React.CSSProperties}>
              <div className="vip-card">
                <div className="vip-info">
                  <span className="vip-label">VIP ACCESS DETECTED</span>
                  <span className="vip-email truncate">{user?.email}</span>
                </div>
                <button className="vip-logout" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut size={20} strokeWidth={2} />
                </button>
              </div>
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
        /* CSS GRID LAYOUT - FORCES PERFECT ALIGNMENT */
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
          .mobile-backdrop { display: block !important; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 99998 !important; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
          .mobile-backdrop.open { opacity: 1; pointer-events: auto; }

          /* 2. SIDEBAR DRAWER */
          .mobile-sidebar { 
            display: flex !important; position: fixed; top: 0; right: 0; 
            width: 100%; max-width: 420px; height: 100dvh; 
            background: var(--bg, #050505) !important; color: var(--text, #ffffff);
            z-index: 99999 !important; 
            transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid rgba(128,128,128,0.15); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
            overflow: hidden;
          }
          .mobile-sidebar.open { transform: translateX(0); }

          /* 3. SCROLL CONTAINER - HIDES SCROLLBARS */
          .sidebar-scroll-container {
            width: 100%; height: 100%; overflow-y: auto; padding: 30px 25px;
            display: flex; flex-direction: column;
            -ms-overflow-style: none; scrollbar-width: none;
          }
          .sidebar-scroll-container::-webkit-scrollbar { display: none; }

          /* 4. HEADER */
          .sidebar-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; }
          .sidebar-brand-box { display: flex; flex-direction: column; gap: 8px; }
          .sidebar-sys-text { font-size: 10px; font-weight: 900; letter-spacing: 4px; opacity: 0.4; font-family: monospace; }
          .sidebar-close-btn { background: rgba(128,128,128,0.05); border: 1px solid rgba(128,128,128,0.1); color: inherit; cursor: pointer; padding: 8px; border-radius: 50%; transition: 0.3s; display: grid; place-items: center;}
          .sidebar-close-btn:active { transform: scale(0.9); background: var(--text); color: var(--bg); }

          /* 5. ANIMATIONS */
          .reveal-item-drawer { opacity: 0; transform: translateY(15px); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .mobile-sidebar.open .reveal-item-drawer { opacity: 1; transform: translateY(0); transition-delay: var(--delay); }

          /* 6. SEARCH PILL */
          .mobile-search-box { 
            display: flex; align-items: center; gap: 12px; background: rgba(128,128,128,0.06); 
            padding: 16px 20px; border-radius: 12px; margin-bottom: 35px; 
            border: 1px solid rgba(128,128,128,0.1); transition: 0.3s; flex-shrink: 0;
          }
          .mobile-search-box:focus-within { background: rgba(128,128,128,0.1); border-color: rgba(128,128,128,0.3); }
          .mobile-search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 14px; color: inherit; font-weight: 600; letter-spacing: 0.5px;}

          /* 7. MAIN NAVIGATION */
          .mobile-main-nav { display: flex; flex-direction: column; gap: 5px; margin-bottom: 40px; }
          .mobile-main-nav a, .mobile-premium-trigger { 
            display: flex; align-items: center; justify-content: space-between;
            width: 100%; font-size: clamp(24px, 7vw, 32px); font-weight: 800; letter-spacing: -0.5px; 
            color: inherit; text-decoration: none; padding: 15px 0; border: none; background: transparent; 
            cursor: pointer; border-bottom: 1px solid rgba(128,128,128,0.1);
          }
          .mobile-premium-trigger { color: var(--text); border-bottom: none; padding-bottom: 0; }
          .nav-arrow { opacity: 0.2; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); flex-shrink: 0; }
          .mobile-main-nav a:active .nav-arrow { transform: translateX(8px); opacity: 1; }

          /* 8. UTILITY GRID */
          .mobile-utilities { margin-bottom: auto; }
          .utility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .utility-card {
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
            background: rgba(128,128,128,0.04); border: 1px solid rgba(128,128,128,0.08); 
            padding: 20px 10px; border-radius: 12px; text-decoration: none; color: inherit;
            transition: 0.3s;
          }
          .utility-card:active { background: rgba(128,128,128,0.1); transform: scale(0.97); }
          .utility-card span { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
          .admin-card { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; }
          
          .icon-with-badge { position: relative; display: flex; align-items: center; justify-content: center; }
          .util-badge { position: absolute; top: -8px; right: -12px; background: var(--text); color: var(--bg); font-size: 10px; font-weight: 900; width: 18px; height: 18px; display: grid; place-items: center; border-radius: 50%; }

          /* 9. VIP FOOTER CARD */
          .mobile-footer { margin-top: 40px; padding-top: 20px; flex-shrink: 0; }
          .vip-card { display: flex; align-items: center; justify-content: space-between; background: var(--text); color: var(--bg); border-radius: 12px; padding: 18px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
          .vip-info { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
          .vip-label { font-size: 9px; font-weight: 900; letter-spacing: 2px; opacity: 0.6; }
          .vip-email { font-size: 13px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px;}
          .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
          .vip-logout { background: rgba(128,128,128,0.2); color: inherit; border: none; width: 44px; height: 44px; border-radius: 8px; display: grid; place-items: center; cursor: pointer; flex-shrink: 0; transition: 0.2s; }
          .vip-logout:active { background: #ef4444; color: white; transform: scale(0.95); }

          /* 10. AUTH PROMPT (If logged out) */
          .mobile-auth-prompt { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; padding: 20px; font-size: 13px; font-weight: 900; letter-spacing: 2px; text-decoration: none; border-radius: 12px; background: var(--text); color: var(--bg); text-transform: uppercase; box-shadow: 0 10px 30px rgba(0,0,0,0.15); transition: 0.3s;}
          .mobile-auth-prompt:active { transform: scale(0.98); }

          :global(.overlay-split-body) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.desktop-only-text) { display: none !important; }
        }

        @media (max-width: 600px) {
          :global(.brand-logo) { height: 36px !important; width: auto !important; object-fit: contain !important; }
          .mobile-sidebar { max-width: 100%; border-left: none; }
        }
      `}</style>
    </>
  );
}