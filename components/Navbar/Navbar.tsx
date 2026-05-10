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
  Search,
  User,
  LogOut,
  ShieldAlert,
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
          <span className="sidebar-title">HQ NAVIGATION</span>
          <button className="sidebar-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={32} strokeWidth={1.5} />
          </button>
        </div>

        {/* SEARCH PILL */}
        <div className="mobile-search-box">
          <Search size={20} opacity={0.5} />
          <input type="text" placeholder="Search archives..." />
        </div>

        {/* MASSIVE NAV LINKS */}
        <div className="mobile-nav-links">
          <Link href="/shop/men" style={{ '--delay': '0.1s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
            <span>MEN'S</span> <span className="arrow">→</span>
          </Link>
          <Link href="/shop/women" style={{ '--delay': '0.15s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
            <span>WOMEN'S</span> <span className="arrow">→</span>
          </Link>
          <Link href="/shop/kids" style={{ '--delay': '0.2s' } as React.CSSProperties} onClick={() => setMobileMenuOpen(false)}>
            <span>KID'S</span> <span className="arrow">→</span>
          </Link>
          <button 
            className="mobile-premium-trigger"
            style={{ '--delay': '0.25s' } as React.CSSProperties}
            onClick={() => {
              setMobileMenuOpen(false);
              setCategoryOpen(true);
            }}
          >
            <span className="premium-text">PREMIUM VAULT</span> <ChevronDown size={28} />
          </button>
        </div>

        {/* BOTTOM ANCHORED ACTIONS */}
        <div className="mobile-bottom-actions">
          {!isAuthenticated ? (
            <Link href="/login" className="mobile-action-btn primary" onClick={() => setMobileMenuOpen(false)}>
              AUTHORIZE // SIGN IN
            </Link>
          ) : (
            <div className="mobile-user-section">
              <div className="mobile-user-tag">
                <User size={16} />
                <span className="truncate">{user?.email}</span>
              </div>
              
              <div className="mobile-action-grid">
                <Link href="/profile" className="mobile-action-btn solid" onClick={() => setMobileMenuOpen(false)}>
                  MY PROFILE
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="mobile-action-btn admin" onClick={() => setMobileMenuOpen(false)}>
                    <ShieldAlert size={16} /> ADMIN
                  </Link>
                )}
              </div>

              <button className="mobile-action-btn danger" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut size={16} /> SIGN OUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= CATEGORY OVERLAY ================= */}
      {/* ... (Category Overlay remains the same) ... */}
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
            {/* (Keep all the showcase cards exactly the same here...) */}
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

          /* 2. SIDEBAR DRAWER - REDESIGNED */
          .mobile-sidebar { 
            display: flex !important; flex-direction: column; position: fixed; top: 0; right: 0; 
            width: 100%; max-width: 420px; height: 100dvh; /* 100dvh fixes iOS Safari bottom bar issues */
            background: var(--bg, #050505) !important; color: var(--text, #ffffff);
            z-index: 99999 !important; padding: 25px 30px; 
            transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid rgba(128,128,128,0.15); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
          }
          .mobile-sidebar.open { transform: translateX(0); }

          /* HEADER */
          .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
          .sidebar-title { font-size: 11px; font-weight: 900; letter-spacing: 4px; opacity: 0.5; }
          .sidebar-close-btn { background: transparent; border: none; color: inherit; cursor: pointer; padding: 5px; margin-right: -5px; transition: 0.3s; }
          .sidebar-close-btn:active { transform: scale(0.8); }

          /* SEARCH PILL */
          .mobile-search-box { 
            display: flex; align-items: center; gap: 12px; background: rgba(128,128,128,0.06); 
            padding: 16px 20px; border-radius: 30px; margin-bottom: 40px; 
            border: 1px solid rgba(128,128,128,0.1); transition: 0.3s;
          }
          .mobile-search-box:focus-within { border-color: var(--text); background: transparent; }
          .mobile-search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 15px; color: inherit; font-weight: 600; }

          /* MASSIVE NAV LINKS */
          .mobile-nav-links { display: flex; flex-direction: column; gap: 15px; flex: 1; }
          .mobile-nav-links a, .mobile-premium-trigger { 
            font-size: clamp(28px, 8vw, 36px); font-weight: 900; letter-spacing: -1px; 
            color: inherit; text-decoration: none; padding: 15px 0; border-bottom: 2px solid rgba(128,128,128,0.1); 
            display: flex; align-items: center; justify-content: space-between; background: transparent; 
            border-top: none; border-left: none; border-right: none; width: 100%; cursor: pointer; text-align: left; 
            opacity: 0; transform: translateY(20px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          /* Trigger staggered animation when open */
          .mobile-sidebar.open .mobile-nav-links a, .mobile-sidebar.open .mobile-premium-trigger {
            opacity: 1; transform: translateY(0); transition-delay: var(--delay);
          }
          
          .mobile-premium-trigger { color: #ffc107; border-bottom: none; }
          .premium-text { background: linear-gradient(90deg, #ffc107, #ff8f00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .arrow { opacity: 0.2; font-size: 24px; transition: 0.3s; }
          .mobile-nav-links a:active .arrow { transform: translateX(10px); opacity: 1; }

          /* BOTTOM ANCHORED ACTIONS */
          .mobile-bottom-actions { margin-top: auto; padding-top: 30px; opacity: 0; transform: translateY(10px); transition: all 0.4s ease 0.4s; }
          .mobile-sidebar.open .mobile-bottom-actions { opacity: 1; transform: translateY(0); }

          .mobile-user-section { display: flex; flex-direction: column; gap: 12px; }
          .mobile-user-tag { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 13px; font-family: monospace; font-weight: 600; padding: 16px; background: rgba(128,128,128,0.05); border-radius: 8px; width: 100%; border: 1px solid rgba(128,128,128,0.1); }
          .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
          
          .mobile-action-grid { display: flex; gap: 12px; }
          .mobile-action-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 18px; font-size: 13px; font-weight: 900; letter-spacing: 2px; text-decoration: none; border-radius: 8px; border: none; cursor: pointer; text-transform: uppercase; transition: 0.2s; }
          
          .mobile-action-btn.primary { background: var(--text, #fff); color: var(--bg, #000); }
          .mobile-action-btn.solid { background: var(--text); color: var(--bg); } 
          .mobile-action-btn.admin { background: #3b82f6; color: white; }
          .mobile-action-btn.danger { background: rgba(239, 68, 68, 0.05); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

          :global(.overlay-split-body) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.desktop-only-text) { display: none !important; }
        }

        @media (max-width: 600px) {
          :global(.brand-logo) { height: 36px !important; width: auto !important; object-fit: contain !important; }
          .mobile-sidebar { padding: 20px 20px; }
          .mobile-nav-links a, .mobile-premium-trigger { font-size: clamp(24px, 8vw, 30px); padding: 12px 0; }
        }
      `}</style>
    </>
  );
}