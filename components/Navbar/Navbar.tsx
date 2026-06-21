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
  ShieldAlert,
  Box,
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

  // 🔥 NEW: VAULT FETCH STATES
  const [premiumProducts, setPremiumProducts] = useState<any[]>([]);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);

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

  // 🔥 UPDATED: FETCH ALL FEATURED PRODUCTS (UNLIMITED)
  useEffect(() => {
    if (categoryOpen && premiumProducts.length === 0) {
      setIsLoadingPremium(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          const productsArray = data.products || data || [];
          const premiumItems = productsArray.filter((item: any) => item.featured === true);
          setPremiumProducts(premiumItems);
        })
        .catch((err) => console.error("Vault fetch error:", err))
        .finally(() => setIsLoadingPremium(false));
    }
  }, [categoryOpen, premiumProducts.length]);

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

          {/* ===== NAV LINKS (Highlighted Desktop) ===== */}
          <nav className="nav-links desktop-only">
            <Link href="/shop/men" className="nav-item nav-highlight">Men</Link>
            <Link href="/shop/women" className="nav-item nav-highlight">Women</Link>
            <Link href="/shop/kids" className="nav-item nav-highlight">Kids</Link>
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

      {/* ================= TRUE MOBILE SIDEBAR ================= */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`mobile-sidebar-clean ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-scroll-wrapper">
          
          {/* HEADER (Close & Logo) */}
          <div className="clean-header-block" style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px 20px 20px" }}>
            <button 
              className="clean-close-btn" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}
            >
              <X size={20} strokeWidth={2} color="#000" style={{ display: "block" }} />
            </button>
            <div className="clean-logo-container" style={{ display: "flex" }}>
              <Image 
                src="/bg-remove-black-text.png" 
                width={150} 
                height={40} 
                alt="GenZonic" 
                className="clean-logo" 
              />
            </div>
          </div>

          {/* PROFILE SECTION */}
          <div className="clean-profile-section" style={{ display: "flex", alignItems: "center", gap: "15px", padding: "0 20px 25px" }}>
            <div className="clean-avatar-ring" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="clean-avatar-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={24} strokeWidth={2} color="#000" style={{ display: "block" }} />
              </div>
            </div>
            <div className="clean-profile-info" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {isAuthenticated ? (
                <>
                  <span className="clean-greeting" style={{ fontWeight: 800 }}>Hi, {getDisplayName()}</span>
                  <Link href="/profile" className="clean-account-link" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    My Account <LinkIcon size={12} strokeWidth={2} style={{ display: "block" }}/>
                  </Link>
                </>
              ) : (
                <>
                  <span className="clean-greeting" style={{ fontWeight: 800 }}>Welcome, Guest</span>
                  <Link href="/login" className="clean-account-link" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Sign In / Register <LinkIcon size={12} strokeWidth={2} style={{ display: "block" }}/>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MAIN NAVIGATION (Men, Women, Kids) */}
          <div className="clean-main-nav" style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #000", borderBottom: "2px solid #000", background: "#fff" }}>
            <Link href="/shop/men" className="clean-nav-item primary-highlight" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>MEN</span> <ChevronRight size={24} strokeWidth={2} style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            <Link href="/shop/women" className="clean-nav-item primary-highlight" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>WOMEN</span> <ChevronRight size={24} strokeWidth={2} style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            <Link href="/shop/kids" className="clean-nav-item primary-highlight" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>KIDS</span> <ChevronRight size={24} strokeWidth={2} style={{ display: "block", flexShrink: 0 }}/>
            </Link>
            
            {/* PREMIUM BUTTON */}
            <button 
              className="clean-nav-item clean-premium-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoryOpen(true);
              }}
              style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}
            >
              <span>PREMIUM VAULT</span> <Crown size={20} strokeWidth={2} color="#FF3E00" style={{ display: "block", flexShrink: 0 }} />
            </button>
          </div>

          {/* SECONDARY NAVIGATION */}
          <div className="clean-secondary-nav" style={{ display: "flex", flexDirection: "column", padding: "15px 0" }}>
            <Link href="/wishlist" className="clean-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Heart size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>WISHLIST</span>
            </Link>
            <Link href="/profile" className="clean-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Box size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>MY ORDERS</span>
            </Link>
            <button className="clean-sec-item" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Search size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>SEARCH</span>
            </button>
            <Link href="/about" className="clean-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Info size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>ABOUT</span>
            </Link>
            <Link href="/contact" className="clean-sec-item" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
              <Mail size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>CONTACT</span>
            </Link>
            {isAuthenticated && (
              <button className="clean-sec-item" onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%" }}>
                <LogOut size={18} strokeWidth={2} color="#000" style={{ display: "block", flexShrink: 0 }} className="sec-icon"/> <span>LOG OUT</span>
              </button>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="clean-sec-item" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", width: "100%", color: "#FF3E00" }} onClick={() => setMobileMenuOpen(false)}>
                <ShieldAlert size={18} strokeWidth={2} color="#FF3E00" style={{ display: "block", flexShrink: 0 }}/> <span style={{color: "#FF3E00"}}>ADMIN PANEL</span>
              </Link>
            )}
          </div>

          {/* PROMO BANNER */}
          <div className="clean-promo-container" style={{ padding: "20px", marginTop: "auto" }}>
            <div className="clean-promo-banner" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "15px" }}>
              <Gift size={32} strokeWidth={2} color="#fff" style={{ display: "block", flexShrink: 0 }} />
              <div className="clean-promo-text" style={{ display: "flex", flexDirection: "column" }}>
                <strong>GET EXTRA 10% OFF</strong>
                <span>YOUR FIRST ORDER</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= CATEGORY OVERLAY (FULL WIDTH PREMIUM VAULT) ================= */}
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

        {/* 🔥 CSS INJECTION TO HIDE SCROLLBAR BUT KEEP SCROLLING 🔥 */}
        <style dangerouslySetInnerHTML={{ __html: `
          .hide-scroll-vault::-webkit-scrollbar { display: none; }
        `}} />

        {/* 🔥 UPDATED: FULL WIDTH SCROLLABLE BODY WITH SMALLER GRID 🔥 */}
        <div className="hide-scroll-vault" style={{ padding: "40px 20px", height: "calc(100vh - 100px)", overflowY: "auto", width: "100%", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="showcase-intro reveal-item" style={{ '--i': 1, marginBottom: "40px", textAlign: "center", maxWidth: "800px", marginInline: "auto" } as React.CSSProperties}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>THE VAULT</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#a3b8cc", lineHeight: 1.6 }}>Exclusive drops and limited-run artifacts curated directly from the central design archives.</p>
          </div>
          
          <div className="premium-products-container reveal-item" style={{ '--i': 2, maxWidth: "1400px", marginInline: "auto" } as React.CSSProperties }>
            {isLoadingPremium ? (
              <div style={{ color: "#00b4d8", padding: "60px 0", textAlign: "center", letterSpacing: "4px", fontSize: "14px", fontWeight: "bold" }}>
                DECRYPTING SECURE VAULT...
              </div>
            ) : premiumProducts.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "20px", paddingBottom: "60px" }}>
                {premiumProducts.map((product) => {
                  const isInWishlist = wishlist.some((w: any) => w._id === product._id);
                  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

                  return (
                    <div key={product._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      
                      {/* Image Container with Wishlist Heart */}
                      <div style={{ 
                        position: "relative", 
                        width: "100%", 
                        aspectRatio: "3/4", 
                        backgroundColor: "#f4f4f4", 
                        borderRadius: "8px", 
                        overflow: "hidden"
                      }}>
                        <Link 
                          href={`/product/${product.slug}`} 
                          onClick={() => setCategoryOpen(false)}
                          style={{ display: "block", width: "100%", height: "100%" }}
                        >
                          <Image 
                            src={product.image || product.images?.[0] || "/placeholder.png"} 
                            alt={product.name} 
                            fill 
                            style={{ objectFit: "cover" }} 
                          />
                        </Link>
                        
                        {/* Heart Button Overlay */}
                        <button style={{ 
                          position: "absolute", 
                          top: "10px", 
                          right: "10px", 
                          backgroundColor: "#fff", 
                          border: "none", 
                          borderRadius: "50%", 
                          width: "32px", 
                          height: "32px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          cursor: "pointer", 
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          zIndex: 2
                        }}>
                          <Heart 
                            size={16} 
                            fill={isInWishlist ? "#FF3E00" : "none"} 
                            color={isInWishlist ? "#FF3E00" : "#000"} 
                          />
                        </button>
                      </div>
                      
                      {/* Product Details Area */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Link 
                          href={`/product/${product.slug}`} 
                          onClick={() => setCategoryOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <h5 style={{ 
                            color: theme === "dark" ? "#fff" : "#000", 
                            fontSize: "13px", 
                            fontWeight: 900, 
                            margin: 0, 
                            textTransform: "uppercase", 
                            letterSpacing: "0.5px" 
                          }}>
                            {product.name}
                          </h5>
                        </Link>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: 900, fontSize: "16px" }}>
                            ₹{product.price}
                          </span>
                          
                          {hasDiscount && (
                            <>
                              <span style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: "12px", fontWeight: 600 }}>
                                ₹{product.originalPrice}
                              </span>
                              <span style={{ 
                                backgroundColor: theme === "dark" ? "#fff" : "#000", 
                                color: theme === "dark" ? "#000" : "#fff", 
                                fontSize: "10px", 
                                fontWeight: 800, 
                                padding: "3px 6px", 
                                borderRadius: "4px" 
                              }}>
                                {discountPercent}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Buy Now Button */}
                      <Link 
                        href={`/product/${product.slug}`} 
                        onClick={() => setCategoryOpen(false)}
                        className="hover-scale"
                        style={{ 
                          display: "block", 
                          width: "100%", 
                          padding: "10px 0", 
                          textAlign: "center", 
                          backgroundColor: "transparent", 
                          border: `2px solid ${theme === "dark" ? "#fff" : "#000"}`, 
                          color: theme === "dark" ? "#fff" : "#000", 
                          fontWeight: 800, 
                          fontSize: "13px", 
                          textTransform: "uppercase", 
                          borderRadius: "4px", 
                          textDecoration: "none", 
                          marginTop: "auto" 
                        }}
                      >
                        BUY NOW
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "60px", border: "1px dashed #14282c", borderRadius: "8px", color: "#52667a", textAlign: "center", fontSize: "14px", letterSpacing: "2px" }}>
                THE VAULT IS CURRENTLY EMPTY.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}