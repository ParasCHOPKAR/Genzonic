"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ArrowRight, Sparkles, Palette, Shirt, Loader2 } from "lucide-react";

// --- Types ---
interface CustomProduct {
  _id: string;
  name: string;
  slug: string;
  featuredImage: string;
  tag?: string;
}

export default function CustomDesignPage() {
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/custom-products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch custom products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fa]" style={{ paddingTop: "80px" }}>

      {/* ===== BREADCRUMBS ===== */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eef0f3" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9b9fa8", fontWeight: 500 }}>
            <Link href="/" style={{ color: "#9b9fa8", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/shop" style={{ color: "#9b9fa8", textDecoration: "none" }}>Clothing</Link>
            <span>›</span>
            <span style={{ color: "#1a1a1a", fontWeight: 700 }}>Custom T-Shirts</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px" }}>

        {/* ===== MAIN CONTENT ===== */}
        <main style={{ paddingTop: "28px", paddingBottom: "60px" }}>

          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.5px", margin: 0, lineHeight: 1.2 }}>
                Customized T-Shirts
              </h1>
              <p style={{ color: "#9b9fa8", fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>
                {isLoading ? "Loading designs..." : `${products.length} designs available to personalise`}
              </p>
            </div>

            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", flexShrink: 0 }}>
              <SlidersHorizontal size={15} />
              <span className="cd-sort-text">Sort by: <strong style={{ color: "#1a1a1a" }}>Popularity</strong></span>
            </button>
          </div>

          {/* ===== HERO BANNER ===== */}
          <div className="cd-hero">
            {/* Glowing orbs */}
            <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", top: "-100px", right: "200px", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(168,85,247,0.15)", bottom: "-80px", right: "100px", filter: "blur(50px)", pointerEvents: "none" }} />

            {/* Text Content */}
            <div style={{ position: "relative", zIndex: 2, maxWidth: "480px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", padding: "6px 14px", marginBottom: "18px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Sparkles size={14} color="#f4c753" />
                <span style={{ color: "#f4c753", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>BULK ORDERS AVAILABLE</span>
              </div>

              <h2 style={{ fontSize: "clamp(20px, 3vw, 34px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.5px" }}>
                Design It Your Way.<br />
                <span style={{ color: "#a5b4fc" }}>We&apos;ll Print It For You.</span>
              </h2>
              <p className="cd-hero-sub">
                Min. 30 units order &nbsp;•&nbsp; Premium print quality &nbsp;•&nbsp; Fast delivery
              </p>

              <button
                onClick={() => document.getElementById("designs")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  background: "#f4c753", color: "#0f0c29",
                  padding: "14px 28px", borderRadius: "10px",
                  fontWeight: 900, fontSize: "15px", border: "none",
                  cursor: "pointer", letterSpacing: "0.3px",
                  boxShadow: "0 8px 24px rgba(244,199,83,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                Select T-Shirt
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Floating T-Shirts */}
            <div className="cd-hero-shirts">
              <div style={{ position: "relative", width: "100px", height: "140px", transform: "rotate(-8deg) translateY(10px)", opacity: 0.7, borderRadius: "10px", overflow: "hidden" }}>
                <Image src="/regular-black-01.jpeg" alt="" fill style={{ objectFit: "cover", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }} />
              </div>
              <div style={{ position: "relative", width: "120px", height: "160px", transform: "rotate(3deg)", zIndex: 2, borderRadius: "12px", overflow: "hidden" }}>
                <Image src="/regular-white-01.jpeg" alt="" fill style={{ objectFit: "cover", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))" }} />
              </div>
              <div style={{ position: "relative", width: "100px", height: "140px", transform: "rotate(10deg) translateY(10px)", opacity: 0.7, borderRadius: "10px", overflow: "hidden" }}>
                <Image src="/oversized-black-01.jpeg" alt="" fill style={{ objectFit: "cover", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }} />
              </div>
            </div>
          </div>

          {/* ===== HOW IT WORKS STRIP ===== */}
          <div className="cd-how-it-works">
            {[
              { icon: <Shirt size={22} color="#6366f1" />, title: "Pick Your Base", desc: "Choose color, size, and fit" },
              { icon: <Palette size={22} color="#6366f1" />, title: "Add Your Design", desc: "Upload art or add custom text" },
              { icon: <Sparkles size={22} color="#6366f1" />, title: "We Handle The Rest", desc: "Premium print, fast delivery" },
            ].map((step, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #eef0f3", display: "flex", alignItems: "flex-start", gap: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#f0f0ff", borderRadius: "10px", padding: "10px", flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#1a1a1a", marginBottom: "3px" }}>
                    <span style={{ color: "#6366f1", marginRight: "6px" }}>{i + 1}.</span>{step.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9b9fa8", fontWeight: 500 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== PRODUCT GRID ===== */}
          <div id="designs" className="cd-product-grid">
            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>
                <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto" />
                <p style={{ marginTop: 16, color: "#6b7280", fontWeight: 500 }}>Loading custom products...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", width: "100%", gridColumn: "1 / -1", color: "#6b7280", fontWeight: 500 }}>
                No custom products available yet. Check back soon!
              </div>
            ) : (
            products.map((product) => (
              <Link
                href={`/customizer?id=${product._id}`}
                key={product._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #eef0f3",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Image Area */}
                  <div style={{
                    position: "relative",
                    background: "#f0f2f5",
                    aspectRatio: "4/5",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>

                    {/* Tag Badge */}
                    {product.tag && (
                      <div style={{
                        position: "absolute", top: "14px", left: "14px", zIndex: 30,
                        background: product.tag === "NEW" ? "#10b981" : product.tag === "BEST SELLER" ? "#f59e0b" : "#6366f1",
                        color: "#fff", fontSize: "10px", fontWeight: 800,
                        padding: "5px 10px", borderRadius: "100px", letterSpacing: "0.8px",
                      }}>
                        {product.tag}
                      </div>
                    )}

                    {/* T-Shirt Image */}
                    <Image
                      src={product.featuredImage || "/placeholder.png"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />

                    {/* "YOUR DESIGN HERE" Overlay */}
                    <div style={{
                      position: "absolute", zIndex: 20, inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      paddingTop: "30%",
                    }}>
                      <div style={{
                        width: "42%", height: "35%",
                        border: "2px solid rgba(255,255,255,0.7)",
                        background: "rgba(0,0,0,0.25)",
                        backdropFilter: "blur(2px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "4px",
                        position: "relative",
                      }}>
                        {/* Corner accents */}
                        <div style={{ position: "absolute", top: -2, left: -2, width: 16, height: 16, borderTop: "3px solid #ff3e6c", borderLeft: "3px solid #ff3e6c" }} />
                        <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderTop: "3px solid #ff3e6c", borderRight: "3px solid #ff3e6c" }} />
                        <div style={{ position: "absolute", bottom: -2, left: -2, width: 16, height: 16, borderBottom: "3px solid #ff3e6c", borderLeft: "3px solid #ff3e6c" }} />
                        <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderBottom: "3px solid #ff3e6c", borderRight: "3px solid #ff3e6c" }} />

                        <div style={{
                          textAlign: "center", fontWeight: 900,
                          fontSize: "clamp(13px, 1.5vw, 18px)", lineHeight: 1.3,
                          color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                          letterSpacing: "1px",
                        }}>
                          YOUR<br />DESIGN<br />HERE
                        </div>
                      </div>
                    </div>


                    {/* Customize CTA (appears on hover via CSS) */}
                    <div className="card-cta-hover" style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30,
                      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                      display: "flex", alignItems: "flex-end", justifyContent: "center",
                      padding: "24px 16px 18px",
                      opacity: 0, transition: "opacity 0.3s ease",
                    }}>
                      <div style={{
                        background: "#fff", color: "#1a1a1a",
                        fontWeight: 800, fontSize: "13px",
                        padding: "10px 24px", borderRadius: "100px",
                        display: "flex", alignItems: "center", gap: "8px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                      }}>
                        Start Designing <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#9b9fa8", letterSpacing: "0.5px", marginBottom: "4px", textTransform: "uppercase" }}>
                      GenZonic®
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: "12px" }}>
                      {product.name}
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "flex-end",
                      paddingTop: "12px", borderTop: "1px solid #f0f2f5",
                    }}>
                      <div style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                        padding: "6px 14px", borderRadius: "100px",
                        display: "flex", alignItems: "center", gap: "5px",
                        letterSpacing: "0.3px",
                      }}>
                        Customise <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            )}
          </div>
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        .card-cta-hover { opacity: 0; transition: opacity 0.3s ease; }
        a:hover .card-cta-hover { opacity: 1 !important; }

        /* Hero banner */
        .cd-hero {
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          border-radius: 20px;
          padding: 48px 56px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 220px;
        }
        .cd-hero-sub {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .cd-hero-shirts {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          height: 180px;
        }

        /* How it works */
        .cd-how-it-works {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        /* Product grid */
        .cd-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* Page header row */
        .cd-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cd-sort-text { display: inline; }

        /* ── Mobile ─────────────────────────────────────────── */
        @media (max-width: 640px) {
          .cd-hero {
            padding: 32px 24px;
            min-height: auto;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            border-radius: 16px;
          }
          .cd-hero-shirts { display: none; }
          .cd-hero-sub { font-size: 13px; margin-bottom: 20px; }
          .cd-how-it-works { grid-template-columns: 1fr; gap: 10px; }
          .cd-product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .cd-sort-text { display: none; }
        }

        @media (max-width: 380px) {
          .cd-product-grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .cd-hero { padding: 36px 36px; }
          .cd-how-it-works { grid-template-columns: repeat(2, 1fr); }
          .cd-product-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
