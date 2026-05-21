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
  ShieldAlert,
  Crown,
  Settings,
  HelpCircle,
  Gift,
  Link as LinkIcon
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

      {/* ================= TRUE MOBILE SIDEBAR (LUXURY DRAWER) ================= */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`mobile-sidebar-luxury ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-scroll-wrapper">
          
          {/* CLOSE BUTTON */}
          <div className="lux-close-row">
            <button className="lux-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} strokeWidth={1.5} color="#888" />
            </button>
          </div>

          {/* BRAND LOGO */}
          <div className="lux-logo-row">
            <Image 
              src="/bg-remove-black-text.png" 
              width={140} 
              height={45} 
              alt="GenZonic" 
              className="lux-logo" 
            />
          </div>

          {/* PROFILE SECTION */}
          <div className="lux-profile-section">
            <div className="lux-avatar">
              <User size={28} strokeWidth={2} color="#666" />
            </div>
            <div className="lux-profile-info">
              {isAuthenticated ? (
                <>
                  <span className="lux-greeting">Hi, {getDisplayName()}</span>
                  <Link href="/profile" className="lux-account-link" onClick={() => setMobileMenuOpen(false)}>
                    My Account <LinkIcon size={12} style={{marginLeft: '4px'}}/>
                  </Link>
                </>
              ) : (
                <>
                  <span className="lux-greeting">Welcome</span>
                  <Link href="/login" className="lux-account-link" onClick={() => setMobileMenuOpen(false)}>
                    Sign In / Register <LinkIcon size={12} style={{marginLeft: '4px'}}/>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MAIN NAVIGATION */}
          <div className="lux-main-nav">
            <Link href="/shop/men" onClick={() => setMobileMenuOpen(false)}>MEN <ChevronRight size={20} strokeWidth={1.5}/></Link>
            <Link href="/shop/women" onClick={() => setMobileMenuOpen(false)}>WOMEN <ChevronRight size={20} strokeWidth={1.5}/></Link>
            <Link href="/shop/kids" onClick={() => setMobileMenuOpen(false)}>KIDS <ChevronRight size={20} strokeWidth={1.5}/></Link>
            
            <button 
              className="lux-premium-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoryOpen(true);
              }}
            >
              PREMIUM COLLECTION <Crown size={20} strokeWidth={2} />
            </button>
          </div>

          {/* SECONDARY NAVIGATION */}
          <div className="lux-secondary-nav">
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}><Heart size={18} strokeWidth={1.5}/> WISHLIST</Link>
            <Link href="/orders" onClick={() => setMobileMenuOpen(false)}><Box size={18} strokeWidth={1.5}/> MY ORDERS</Link>
            <button onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}><Search size={18} strokeWidth={1.5}/> SEARCH</button>
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)}><Settings size={18} strokeWidth={1.5}/> SETTINGS</Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)}><HelpCircle size={18} strokeWidth={1.5}/> HELP & SUPPORT</Link>
            {isAuthenticated && (
              <button onClick={() => signOut({ callbackUrl: "/" })}><LogOut size={18} strokeWidth={1.5}/> LOG OUT</button>
            )}
          </div>

          {/* PROMO BANNER */}
          <div className="lux-promo-banner">
            <div className="lux-gift-icon">
              <Gift size={28} strokeWidth={1.5} color="#fff" />
            </div>
            <div className="lux-promo-text">
              <strong>GET EXTRA 10% OFF</strong>
              <span>YOUR FIRST ORDER</span>
            </div>
          </div>

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

        .mobile-backdrop, .mobile-sidebar-luxury, .mobile-menu-btn { display: none !important; }

        @media (max-width: 1024px) {
          .desktop-only, .nav-links, .search-wrapper, .collections-btn, .auth-group { display: none !important; }
          .nav-actions { width: auto !important; justify-content: flex-end; gap: 10px; }
          .mobile-menu-btn { display: grid !important; cursor: pointer; margin-left: 5px; }

          /* 1. BACKDROP */
          .mobile-backdrop { display: block !important; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); z-index: 99998 !important; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
          .mobile-backdrop.open { opacity: 1; pointer-events: auto; }

          /* 2. SIDEBAR LUXURY DRAWER */
          .mobile-sidebar-luxury {
            display: flex !important; position: fixed; top: 0; left: 0; 
            width: 85%; max-width: 360px; height: 100dvh; 
            background: #fdfcf9 !important; color: #111 !important;
            z-index: 99999 !important; 
            transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 20px 0 60px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }
          .mobile-sidebar-luxury.open { transform: translateX(0); }

          .sidebar-scroll-wrapper { width: 100%; height: 100%; overflow-y: auto; display: flex; flex-direction: column; -ms-overflow-style: none; scrollbar-width: none; }
          .sidebar-scroll-wrapper::-webkit-scrollbar { display: none; }

          /* CLOSE BUTTON */
          .lux-close-row { padding: 15px 20px 5px; }
          .lux-close-btn { 
            background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; 
            width: 34px; height: 34px; display: grid; place-items: center; 
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: 0.2s;
          }
          .lux-close-btn:active { transform: scale(0.9); }
          
          /* LOGO */
          .lux-logo-row { padding: 5px 20px 20px; border-bottom: 1px solid #eaeaea; }
          .lux-logo { height: 35px !important; width: auto !important; object-fit: contain; }

          /* PROFILE */
          .lux-profile-section { display: flex; align-items: center; gap: 15px; padding: 20px; border-bottom: 1px solid #eaeaea; background: #fff; }
          .lux-avatar { 
            width: 48px; height: 48px; border-radius: 50%; background: #dcdcdc;
            display: grid; place-items: center; border: 2px solid #b8903c;
            box-shadow: 0 4px 10px rgba(184, 144, 60, 0.3);
          }
          .lux-profile-info { display: flex; flex-direction: column; gap: 2px; }
          .lux-greeting { font-size: 15px; font-weight: 600; color: #111; }
          .lux-account-link { display: flex; align-items: center; font-size: 12px; color: #1a4f8b; text-decoration: underline; font-weight: 500;}

          /* MAIN NAV */
          .lux-main-nav { display: flex; flex-direction: column; background: #fff;}
          .lux-main-nav > a {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 20px; font-size: 15px; font-weight: 800; color: #111; text-decoration: none;
            border-bottom: 1px solid #eaeaea; letter-spacing: 0.5px; transition: 0.2s;
          }
          .lux-main-nav > a:active { background: #f9f9f9; }
          .lux-main-nav > a svg { color: #888; }
          
          .lux-premium-btn {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 20px; font-size: 15px; font-weight: 800; color: #785a28;
            background: linear-gradient(90deg, #f7ebb0 0%, #e6c875 100%);
            border: none; text-align: left; cursor: pointer; letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-bottom: 1px solid #d4af37; transition: 0.2s;
          }
          .lux-premium-btn:active { opacity: 0.9; }

          /* SECONDARY NAV */
          .lux-secondary-nav { padding: 15px 0; display: flex; flex-direction: column; background: #fdfcf9;}
          .lux-secondary-nav a, .lux-secondary-nav button {
            display: flex; align-items: center; gap: 12px; padding: 12px 20px;
            font-size: 13px; font-weight: 500; color: #333; text-decoration: none;
            background: none; border: none; text-align: left; cursor: pointer;
            letter-spacing: 0.5px; transition: 0.2s;
          }
          .lux-secondary-nav a:active, .lux-secondary-nav button:active { background: rgba(0,0,0,0.03); }
          .lux-secondary-nav svg { color: #b8903c; } 

          /* PROMO BANNER */
          .lux-promo-banner {
            margin: auto 20px 20px; padding: 15px 20px; display: flex; align-items: center; gap: 15px;
            background: linear-gradient(to bottom, #d6b35d, #a88231);
            border-radius: 4px; color: #fff; box-shadow: 0 4px 15px rgba(168, 130, 49, 0.4);
            cursor: pointer; transition: 0.3s;
          }
          .lux-promo-banner:active { transform: scale(0.98); }
          .lux-promo-text { display: flex; flex-direction: column; }
          .lux-promo-text strong { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; }
          .lux-promo-text span { font-size: 11px; font-weight: 500; opacity: 0.9; }

          :global(.overlay-split-body) { grid-template-columns: 1fr !important; gap: 40px !important; }
          :global(.desktop-only-text) { display: none !important; }
        }

        @media (max-width: 600px) {
          :global(.brand-logo) { height: 36px !important; width: auto !important; object-fit: contain !important; }
          .mobile-sidebar-luxury { max-width: 100%; }
        }
      `}</style>
    </>
  );
}