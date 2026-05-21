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
  Info,
  Mail,
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
    return "Guest";
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

          {/* ===== RIGHT SIDE ACTIONS ===== */}
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

      {/* ================= TRUE MOBILE SIDEBAR (BULLETPROOF LAYOUT) ================= */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`mobile-sidebar-luxury ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-scroll-wrapper">
          
          {/* HEADER (Close & Logo) */}
          <div className="lux-header-block" style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px 20px 20px" }}>
            <button 
              className="lux-close-btn" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}
            >
              <X size={20} strokeWidth={1} color="#666" style={{ display: "block" }} />
            </button>
            <div className="lux-logo-container" style={{ display: "flex" }}>
              <Image 
                src="/bg-remove-black-text.png" 
                width={150} 
                height={40} 
                alt="GenZonic" 
                className="lux-logo" 
              />
            </div>
          </div>

          {/* PROFILE SECTION */}
          <div className="lux-profile-section" style={{ display: "flex", alignItems: "center", gap: "15px", padding: "0 20px 25px" }}>
            <div className="lux-avatar-ring" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="lux-avatar-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={26} strokeWidth={1.5} color="#555" style={{ display: "block" }} />
              </div>
            </div>
            <div className="lux-profile-info" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {isAuthenticated ? (
                <>
                  <span className="lux-greeting" style={{ fontWeight: 600 }}>Hi, {getDisplayName()}</span>
                  <Link href="/profile" className="lux-account-link" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    My Account <LinkIcon size={12} strokeWidth={2} style={{ display: "block" }}/>
                  </Link>
                </>
              ) : (
                <>
                  <span className="lux-greeting" style={{ fontWeight: 600 }}>Welcome, Guest</span>
                  <Link href="/login" className="lux-account-link" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Sign In / Register <LinkIcon size={12} strokeWidth={2} style={{ display: "block" }}/>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MAIN NAVIGATION (Men, Women, Kids) */}
          <div className="lux-main-nav" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
            <Link href="/shop/men" className="lux-nav-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>MEN</span> <ChevronRight size={18} strokeWidth={1.5} color="#666" style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            <Link href="/shop/women" className="lux-nav-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>WOMEN</span> <ChevronRight size={18} strokeWidth={1.5} color="#666" style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            <Link href="/shop/kids" className="lux-nav-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>KIDS</span> <ChevronRight size={18} strokeWidth={1.5} color="#666" style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            
            {/* PREMIUM BUTTON */}
            <button 
              className="lux-nav-item lux-premium-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoryOpen(true);
              }}
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}
            >
              <span>PREMIUM COLLECTION</span> <Crown size={20} strokeWidth={1.5} color="#8a6c32" style={{ display: "block", flexShrink: 0 }} />
            </button>
          </div>

          {/* SECONDARY NAVIGATION */}
          <div className="lux-secondary-nav" style={{ display: "flex", flexDirection: "column", padding: "15px 0" }}>
            <Link href="/wishlist" className="lux-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Heart size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>WISHLIST</span>
            </Link>
            <Link href="/profile" className="lux-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Box size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>MY ORDERS</span>
            </Link>
            <button className="lux-sec-item" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Search size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>SEARCH</span>
            </button>
            <Link href="/about" className="lux-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Info size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>ABOUT</span>
            </Link>
            <Link href="/contact" className="lux-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Mail size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>CONTACT</span>
            </Link>
            {isAuthenticated && (
              <button className="lux-sec-item" onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
                <LogOut size={18} strokeWidth={1.5} color="#555" style={{ display: "block", flexShrink: 0 }}/> <span>LOG OUT</span>
              </button>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="lux-sec-item" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%", color: "#3b82f6" }} onClick={() => setMobileMenuOpen(false)}>
                <ShieldAlert size={18} strokeWidth={1.5} color="#3b82f6" style={{ display: "block", flexShrink: 0 }}/> <span>ADMIN PANEL</span>
              </Link>
            )}
          </div>

          {/* PROMO BANNER */}
          <div className="lux-promo-container" style={{ padding: "20px", marginTop: "auto" }}>
            <div className="lux-promo-banner" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px" }}>
              <Gift size={32} strokeWidth={1} color="#fff" style={{ display: "block", flexShrink: 0 }} />
              <div className="lux-promo-text" style={{ display: "flex", flexDirection: "column" }}>
                <strong>GET EXTRA 10% OFF</strong>
                <span>YOUR FIRST ORDER</span>
              </div>
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

          /* 2. SIDEBAR LUXURY DRAWER - Matches reference exact colors */
          .mobile-sidebar-luxury {
            display: flex !important; position: fixed; top: 0; left: 0; 
            width: 85%; max-width: 380px; height: 100dvh; 
            background: #faf9f6 !important; /* Subtle paper off-white */
            color: #111 !important;
            z-index: 99999 !important; 
            transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 20px 0 60px rgba(0, 0, 0, 0.5);
            font-family: 'Inter', sans-serif;
          }
          .mobile-sidebar-luxury.open { transform: translateX(0); }

          .sidebar-scroll-wrapper { width: 100%; height: 100%; overflow-y: auto; display: flex; flex-direction: column; -ms-overflow-style: none; scrollbar-width: none; }
          .sidebar-scroll-wrapper::-webkit-scrollbar { display: none; }

          /* HEADER - Close Button & Logo */
          .lux-close-btn { 
            border-radius: 8px;
            background: linear-gradient(to bottom, #ffffff, #e6e6e6);
            border: 1px solid #ccc; box-shadow: inset 0 1px 0 #fff;
            cursor: pointer;
          }
          .lux-logo { height: 32px !important; width: auto !important; object-fit: contain; margin-left: -5px; }

          /* PROFILE SECTION */
          .lux-avatar-ring {
            width: 52px; height: 52px; border-radius: 50%;
            border: 2px solid #d4af37; /* Gold ring */
            padding: 2px;
          }
          .lux-avatar-inner {
            width: 100%; height: 100%; border-radius: 50%;
            background: #d4d4d4; /* Inner grey */
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }
          .lux-greeting { font-size: 16px; color: #111; }
          .lux-account-link { font-size: 13px; color: #333; text-decoration: underline;}

          /* MAIN NAV */
          .lux-nav-item {
            padding: 16px 20px; font-size: 15px; font-weight: 700; color: #111; text-decoration: none;
            background: #f4f4f4; border-bottom: 1px solid #e0e0e0; text-transform: uppercase; cursor: pointer;
          }
          .lux-main-nav .lux-nav-item:last-child { border-bottom: none; }
          
          /* Premium Collection Button Specifics */
          .lux-premium-btn {
            background: linear-gradient(to right, #e2c77d, #d3ab55) !important;
            color: #333 !important; text-shadow: 0 1px 0 rgba(255,255,255,0.3); border: none !important;
          }

          /* SECONDARY NAV */
          .lux-sec-item {
            padding: 12px 20px; font-size: 14px; font-weight: 400; color: #111; text-decoration: none;
            background: transparent; border: none; text-align: left; cursor: pointer; text-transform: uppercase;
          }

          /* PROMO BANNER */
          .lux-promo-banner {
            padding: 15px 20px;
            background: linear-gradient(to bottom, #d4b05a, #a67c27);
            border-radius: 4px; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
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