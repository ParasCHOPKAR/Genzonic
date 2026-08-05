"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import {
  Check, ChevronLeft, ChevronRight, ShoppingBag, CheckCircle,
  RotateCcw, Type, Upload, Trash2, X, Ruler, ImageIcon, Info, Sparkles, ZoomIn,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Color { name: string; hex: string; previewBg: string; light: boolean }
interface DesignEl { id: string; type: "text" | "image"; content: string; x: number; y: number; scale: number; rotation: number; }

// ─── Config ─────────────────────────────────────────────────────────────────
const COLORS: Color[] = [
  { name: "White",    hex: "#FFFFFF", previewBg: "#d4d4d4", light: true  },
  { name: "Black",    hex: "#111111", previewBg: "#1a1a1a", light: false },
  { name: "Gray",     hex: "#808080", previewBg: "#737373", light: false },
  { name: "Olive",    hex: "#558B2F", previewBg: "#4a7a29", light: false },
  { name: "Red",      hex: "#C62828", previewBg: "#b71c1c", light: false },
];

const SIZES = ["S", "M", "L", "XL", "2XL"];
const GUIDE: Record<string, { chest: string; length: string; sleeve: string }> = {
  S:    { chest: "38", length: "27.5", sleeve: "9"   },
  M:    { chest: "40", length: "28.5", sleeve: "9.5" },
  L:    { chest: "42", length: "29.5", sleeve: "10"  },
  XL:   { chest: "44", length: "30.5", sleeve: "10.5"},
  "2XL":{ chest: "46", length: "31.5", sleeve: "11"  },
};

const COLOR_IMAGE: Record<string, { front: string; back: string }> = {
  White: { front: "/white-front.png", back: "/white-back.png" },
  Black: { front: "/black-front.png", back: "/black-back.png" },
  Gray:  { front: "/gray-front.png",  back: "/gray-back.png"  },
  Olive: { front: "/olive-front.png", back: "/olive-back.png" },
  Red:   { front: "/red-front.png",   back: "/red-back.png"   },
};

const TRENDY_IMAGES = [
  { id: 't1', category: 'Birthday', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-family="sans-serif" font-weight="900" font-size="28" fill="%23111111" text-anchor="middle" dominant-baseline="middle">HBD</text><text x="50" y="70" font-family="sans-serif" font-weight="700" font-size="12" fill="%23ef4444" text-anchor="middle" dominant-baseline="middle">VIBES</text></svg>' },
  { id: 't2', category: 'Pride', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="40" font-family="sans-serif" font-weight="900" font-size="24" fill="%238b5cf6" text-anchor="middle" dominant-baseline="middle">LOVE IS</text><text x="50" y="65" font-family="sans-serif" font-weight="900" font-size="24" fill="%23ec4899" text-anchor="middle" dominant-baseline="middle">LOVE</text></svg>' },
  { id: 't3', category: 'WorldCup', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%233b82f6"/><text x="50" y="50" font-family="sans-serif" font-weight="900" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">INDIA</text></svg>' },
  { id: 't4', category: 'Reactions', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-family="sans-serif" font-weight="900" font-size="32" fill="%2310b981" text-anchor="middle" dominant-baseline="middle">MOOD</text></svg>' },
  { id: 't5', category: 'WorldCup', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="30" font-family="sans-serif" font-weight="900" font-size="18" fill="%23f97316" text-anchor="middle" dominant-baseline="middle">WORLD</text><text x="50" y="50" font-family="sans-serif" font-weight="900" font-size="18" fill="%23f97316" text-anchor="middle" dominant-baseline="middle">CHAMPIONS</text><text x="50" y="70" font-family="sans-serif" font-weight="900" font-size="14" fill="%233b82f6" text-anchor="middle" dominant-baseline="middle">2024</text></svg>' },
  { id: 't6', category: 'Favourites', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 15 L60 40 L85 40 L65 55 L75 80 L50 65 L25 80 L35 55 L15 40 L40 40 Z" fill="%23eab308"/></svg>' },
];

const STEPS = [
  { label: "Color & Size", short: "Color" },
  { label: "Add Design",   short: "Design" },
  { label: "Review",       short: "Review" },
];

// ─── Stepper ────────────────────────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <div className="cz-stepper">
      {STEPS.map(({ label, short }, i) => {
        const n = i + 1, done = n < current, active = n === current;
        return (
          <div key={label} className="cz-step-row">
            <div className="cz-step-item">
              <div className="cz-step-circle" data-done={done} data-active={active}>
                {done ? <Check size={13} strokeWidth={3} /> : n}
              </div>
              <span className="cz-step-label" data-active={active} data-done={done}>
                <span className="cz-step-full">{label}</span>
                <span className="cz-step-short">{short}</span>
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="cz-step-line" data-done={done} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function CustomizerPage() {
  const [step,      setStep]     = useState(1);
  const [color,     setColor]    = useState(COLORS[0]);
  const [size,      setSize]     = useState("M");
  const [designsFront, setDesignsFront] = useState<DesignEl[]>([]);
  const [designsBack,  setDesignsBack]  = useState<DesignEl[]>([]);
  const [viewSide,  setViewSide] = useState<"front" | "back">("front");
  const [textVal,   setTextVal]  = useState("");
  const [showText,  setShowText] = useState(false);
  const [isAdding,  setIsAdding] = useState(false);
  const [showGuide, setShowGuide]= useState(false);
  const [activeElId, setActiveElId] = useState<string | null>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const addToCart  = useCartStore((s) => s.addToCart);

  const designs = viewSide === "front" ? designsFront : designsBack;
  const setDesigns = viewSide === "front" ? setDesignsFront : setDesignsBack;

  useEffect(() => {
    if (step === 1) setViewSide("front");
  }, [step]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("color");
    if (p) { const f = COLORS.find(c => c.name.toLowerCase() === p.toLowerCase()); if (f) setColor(f); }
  }, []);

  const addText = () => {
    if (!textVal.trim()) return;
    setDesigns(d => [...d, { id: `t${Date.now()}`, type: "text", content: textVal, x: 20, y: 20, scale: 1, rotation: 0 }]);
    setTextVal(""); setShowText(false);
  };

  const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (typeof ev.target?.result === "string")
        setDesigns(d => [...d, { id: `i${Date.now()}`, type: "image", content: ev.target!.result as string, x: 20, y: 20, scale: 1, rotation: 0 }]);
    };
    reader.readAsDataURL(file);
  };

  const removeEl = (id: string) => setDesigns(d => d.filter(x => x.id !== id));

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({ id: `custom-${Date.now()}`, name: `Custom T-Shirt (${color.name}, ${size})`, price: 999, image: COLOR_IMAGE[color.name]?.front || "/white-front.png", size, stock: 100 });
    setTimeout(() => setIsAdding(false), 1800);
  };

  const tshirtImage = COLOR_IMAGE[color.name] ? COLOR_IMAGE[color.name][viewSide] : "/white-front.png";
  const textOnShirt = color.light ? "#1a1a1a" : "#ffffff";

  // ── Shirt Canvas ───────────────────────────────────────────────────────────
  const ShirtCanvas = ({ interactive }: { interactive?: boolean }) => (
    <div 
      onClick={() => setActiveElId(null)}
      style={{
        position: "relative", height: "100%", aspectRatio: "4/5", margin: "0 auto",
        background: "#f7f8fa",
        borderRadius: 16, overflow: "hidden",
      }}
    >
      <Image src={tshirtImage} alt={`${color.name} T-Shirt`} fill style={{ objectFit: "cover", zIndex: 10 }} priority unoptimized />
      
      {/* Flip Button overlay on Canvas */}
      {interactive && (
        <button 
          onClick={(e) => { e.stopPropagation(); setViewSide(s => s === "front" ? "back" : "front"); }}
          style={{ position: "absolute", top: 16, right: 16, zIndex: 40, background: "rgba(0,0,0,0.15)", backdropFilter: "blur(4px)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.15)"}
        >
          <RotateCcw size={20} strokeWidth={2.5} />
          <span style={{ fontSize: 10, fontWeight: 700 }}>Flip</span>
        </button>
      )}

      {/* Interactive Canvas Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        {interactive && (
          <div ref={canvasRef} style={{ position: "absolute", top: "28%", left: "22%", width: "56%", height: "40%", border: `2px dashed rgba(255,255,255,0.5)`, borderRadius: 4 }}>
          {designs.map(d => {
            const isActive = activeElId === d.id;
            return (
              <motion.div 
                key={d.id} drag dragConstraints={canvasRef} dragElastic={0} dragMomentum={false} 
                initial={{ x: d.x, y: d.y }} 
                onPointerDown={(e) => { e.stopPropagation(); setActiveElId(d.id); }}
                style={{ position: "absolute", cursor: "grab", zIndex: isActive ? 35 : 30 }} 
                whileDrag={{ cursor: "grabbing" }}
              >
                <div style={{ 
                  position: "relative",
                  border: isActive ? "1.5px dashed #111" : "1.5px dashed transparent",
                  padding: 4, margin: -4 // offset padding so content doesn't shift
                }}>
                  {/* Delete Button (visible when active) */}
                  {isActive && (
                    <button onClick={(e) => { e.stopPropagation(); removeEl(d.id); }} style={{ position: "absolute", top: -10, right: -10, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 50, boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                      <X size={11} strokeWidth={3} />
                    </button>
                  )}
                  
                  {/* Resize Handle (bottom-right) */}
                  {isActive && (
                    <motion.div 
                      drag dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} dragElastic={1} dragMomentum={false}
                      onPointerDown={e => e.stopPropagation()} // stop parent from dragging
                      onDrag={(e, info) => {
                         // increase scale based on diagonal drag (offset x + y)
                         const delta = (info.delta.x + info.delta.y) * 0.005;
                         setDesigns(ds => ds.map(x => x.id === d.id ? { ...x, scale: Math.max(0.2, (x.scale || 1) + delta) } : x));
                      }}
                      style={{
                        position: "absolute", bottom: -6, right: -6, width: 14, height: 14,
                        background: "#fff", border: "1.5px solid #111", cursor: "nwse-resize", zIndex: 50
                      }}
                    />
                  )}

                  {d.type === "text"
                    ? <div style={{ color: textOnShirt, fontWeight: 900, fontSize: 18, whiteSpace: "nowrap", textShadow: color.light ? "none" : "0 2px 6px rgba(0,0,0,0.5)", userSelect: "none", transform: `scale(${d.scale || 1}) rotate(${d.rotation || 0}deg)`, transformOrigin: "top left" }}>{d.content}</div>
                    : <div style={{ position: "relative", width: 80 * (d.scale || 1), height: 80 * (d.scale || 1), transform: `rotate(${d.rotation || 0}deg)` }}><Image src={d.content} alt="" fill style={{ objectFit: "contain" }} draggable={false} /></div>
                  }
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );

  // ── Step 1 ────────────────────────────────────────────────────────────────
  const Step1 = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Color */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: "#6b7280", textTransform: "uppercase" }}>Shirt Color</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#111", background: "#f4f5f7", padding: "4px 12px", borderRadius: 100, border: "1px solid #e5e7eb" }}>{color.name}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {COLORS.map(c => {
            const sel = c.name === color.name;
            return (
              <button key={c.name} onClick={() => setColor(c)} title={c.name}
                style={{ width: 42, height: 42, borderRadius: 12, background: c.hex, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", border: sel ? "3px solid #111" : "2px solid #e5e7eb", boxShadow: sel ? "0 0 0 3px #fff, 0 0 0 5.5px #111" : "0 2px 8px rgba(0,0,0,0.1)", transform: sel ? "scale(1.15)" : "scale(1)" }}
              >
                {sel && <Check size={14} strokeWidth={3} color={c.light ? "#111" : "#fff"} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: "#6b7280", textTransform: "uppercase" }}>Select Size</span>
          <button onClick={() => setShowGuide(g => !g)} style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Ruler size={12} /> Size Guide
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SIZES.map(s => {
            const sel = s === size;
            return (
              <button key={s} onClick={() => setSize(s)}
                style={{ width: 48, height: 48, borderRadius: 12, fontWeight: 800, fontSize: 13, border: sel ? "2px solid #111" : "2px solid #e5e7eb", background: sel ? "#111" : "#fff", color: sel ? "#fff" : "#6b7280", cursor: "pointer", transition: "all 0.2s", boxShadow: sel ? "0 4px 14px rgba(0,0,0,0.2)" : "none", transform: sel ? "scale(1.05)" : "scale(1)", fontFamily: "inherit" }}
              >{s}</button>
            );
          })}
        </div>

        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
              <div style={{ marginTop: 12, padding: "12px 16px", background: "#f9fafb", borderRadius: 12, border: "1px solid #f0f2f5" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.8px", color: "#9ca3af", textTransform: "uppercase", marginBottom: 10 }}>Measurements (inches)</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ color: "#6b7280", fontWeight: 700 }}><td style={{ padding: "4px 6px" }}>Size</td><td>Chest</td><td>Length</td><td>Sleeve</td></tr></thead>
                  <tbody>
                    {SIZES.map(s => (
                      <tr key={s} style={{ background: s === size ? "#f0f0ff" : "transparent" }}>
                        <td style={{ padding: "5px 6px", borderRadius: "6px 0 0 6px", color: s === size ? "#6366f1" : "#374151", fontWeight: 800 }}>{s}</td>
                        <td style={{ padding: "5px 0", color: "#374151" }}>{GUIDE[s].chest}&quot;</td>
                        <td style={{ color: "#374151" }}>{GUIDE[s].length}&quot;</td>
                        <td style={{ padding: "5px 6px", color: "#374151" }}>{GUIDE[s].sleeve}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showGuide && (
          <div style={{ marginTop: 10, display: "flex", gap: 16, fontSize: 12, color: "#6b7280", fontWeight: 600, padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f0f2f5", flexWrap: "wrap" }}>
            <span>Chest: <strong style={{ color: "#111" }}>{GUIDE[size].chest}&quot;</strong></span>
            <span>Length: <strong style={{ color: "#111" }}>{GUIDE[size].length}&quot;</strong></span>
            <span>Sleeve: <strong style={{ color: "#111" }}>{GUIDE[size].sleeve}&quot;</strong></span>
          </div>
        )}
      </div>

      {/* Print Info */}
      <div style={{ background: "linear-gradient(135deg, #f0f0ff, #faf5ff)", borderRadius: 14, padding: "14px 18px", border: "1px solid #e0e0ff" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ background: "#6366f1", borderRadius: 10, padding: 8, flexShrink: 0 }}><Sparkles size={15} color="#fff" /></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#3730a3", marginBottom: 3 }}>Premium DTF Print</div>
            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 500, lineHeight: 1.5 }}>Vibrant, wash-resistant · 50+ washes · Full-colour</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Step 2 ────────────────────────────────────────────────────────────────
  const Step2 = () => {
    const [category, setCategory] = useState("WorldCup");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {showText ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "#6b7280", textTransform: "uppercase", marginBottom: 12 }}>Add Text</div>
            
            {/* Input mimicking Bewakoof's screenshot */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input 
                  autoFocus 
                  value={textVal} 
                  onChange={e => setTextVal(e.target.value.substring(0, 60))} 
                  onKeyDown={e => e.key === "Enter" && addText()} 
                  placeholder="Tap to enter text"
                  style={{ 
                    flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "14px 16px", 
                    fontSize: 14, fontWeight: 500, outline: "none", color: "#111", transition: "border 0.2s" 
                  }}
                  onFocus={e => (e.currentTarget.style.border = "1px solid #111")} 
                  onBlur={e => (e.currentTarget.style.border = "1px solid #d1d5db")}
                />
                <button onClick={addText} style={{ background: "#4ca899", color: "#fff", border: "none", borderRadius: 8, width: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#3c8879"} onMouseLeave={e => e.currentTarget.style.background = "#4ca899"}>
                  <Check size={20} strokeWidth={3} />
                </button>
              </div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6, fontWeight: 500 }}>Max. 60 Characters</div>
            </div>

            {/* Bottom Toolbar Mimic */}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
              <button style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", color: "#eab308", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                <Type size={20} />
                Edit
              </button>
              <button onClick={() => setShowText(false)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", color: "#9ca3af", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setShowText(true)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ background: "#f0f0ff", borderRadius: 8, padding: 6 }}><Type size={15} color="#6366f1" /></div>
                Add Text
              </button>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 10px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ background: "#fff0f5", borderRadius: 8, padding: 6 }}><Upload size={15} color="#ec4899" /></div>
                Upload Art
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={uploadImg} />
              </label>
            </div>

            {/* Trendy Images Gallery */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
              <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 16 }}>
                Pick from These Trendy Images
              </div>

              {/* Categories */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 12, scrollbarWidth: "none" }}>
                {["WorldCup", "Birthday", "Pride", "Reactions", "Favourites"].map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{
                      padding: "6px 14px", borderRadius: 100, border: category === cat ? "1px solid #111" : "1px solid #d1d5db",
                      background: category === cat ? "#111" : "#fff", color: category === cat ? "#fff" : "#374151",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all 0.2s"
                    }}
                  >{cat}</button>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, borderTop: "1px dashed #e5e7eb", borderLeft: "1px dashed #e5e7eb" }}>
                {TRENDY_IMAGES.filter(img => img.category === category).map((img, i) => (
                  <button key={i} 
                    onClick={() => setDesigns(d => [...d, { id: `img${Date.now()}`, type: "image", content: img.src, x: 20, y: 20, scale: 1, rotation: 0 }])}
                    style={{ background: "#fff", borderBottom: "1px dashed #e5e7eb", borderRight: "1px dashed #e5e7eb", borderTop: "none", borderLeft: "none", height: 80, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", padding: 8 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <Image src={img.src} alt="" width={60} height={60} style={{ objectFit: "contain" }} />
                  </button>
                ))}
                {/* Fill empty cells to maintain grid layout */}
                {Array.from({ length: Math.max(0, 6 - TRENDY_IMAGES.filter(img => img.category === category).length) }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ background: "#f9fafb", borderBottom: "1px dashed #e5e7eb", borderRight: "1px dashed #e5e7eb", height: 80 }} />
                ))}
              </div>
            </div>
          </div>
        )}

      {designs.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.8px", color: "#9ca3af", textTransform: "uppercase", marginBottom: 10 }}>Added Elements ({designs.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {designs.map(d => (
              <div key={d.id} style={{ display: "flex", flexDirection: "column", gap: 10, background: "#f9fafb", borderRadius: 10, padding: "10px 14px", border: "1px solid #f0f2f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: d.type === "text" ? "#f0f0ff" : "#fff0f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {d.type === "text" ? <Type size={13} color="#6366f1" /> : <ImageIcon size={13} color="#ec4899" />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {d.type === "text" ? d.content : "Uploaded Artwork"}
                  </span>
                  <button onClick={() => removeEl(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#d1d5db")}
                  ><Trash2 size={14} /></button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 42 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", width: 24 }}>Size</span>
                  <input type="range" min="0.5" max="3" step="0.1" value={d.scale || 1} 
                    onChange={e => setDesigns(ds => ds.map(x => x.id === d.id ? { ...x, scale: parseFloat(e.target.value) } : x))}
                    style={{ flex: 1, accentColor: "#111", cursor: "ew-resize" }} 
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", width: 28, textAlign: "right" }}>{Math.round((d.scale || 1) * 100)}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 42 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", width: 24 }}>Turn</span>
                  <input type="range" min="-180" max="180" step="1" value={d.rotation || 0} 
                    onChange={e => setDesigns(ds => ds.map(x => x.id === d.id ? { ...x, rotation: parseInt(e.target.value) } : x))}
                    style={{ flex: 1, accentColor: "#111", cursor: "ew-resize" }} 
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", width: 28, textAlign: "right" }}>{d.rotation || 0}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {designs.length === 0 && !showText && (
        <div style={{ textAlign: "center", padding: "20px 16px", background: "#f9fafb", borderRadius: 14, border: "1.5px dashed #e5e7eb" }}>
          <ZoomIn size={20} color="#d1d5db" style={{ marginBottom: 8 }} />
          <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>Add text or upload your artwork,<br />then drag it into position on the shirt.</p>
        </div>
      )}

      {designs.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "11px 14px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", alignItems: "flex-start" }}>
          <Info size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: "#92400e", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>Drag elements within the dashed print area on the shirt.</p>
        </div>
      )}
    </div>
  );
};

  // ── Step 3 ────────────────────────────────────────────────────────────────
  const Step3 = () => {
    const totalDesigns = designsFront.length + designsBack.length;
    return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "#6b7280", textTransform: "uppercase", marginBottom: 20 }}>Order Summary</div>
      {[
        { label: "Product",  value: "Custom T-Shirt" },
        { label: "Color",    value: color.name, swatch: color.hex },
        { label: "Size",     value: size, sub: `Chest ${GUIDE[size].chest}″ · Length ${GUIDE[size].length}″` },
        { label: "Print",    value: `${totalDesigns} element${totalDesigns !== 1 ? "s" : ""}`, sub: "Premium DTF" },
      ].map(({ label, value, sub, swatch }: { label: string; value: string; sub?: string; swatch?: string }, i) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}>
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
            {sub && <div style={{ fontSize: 10, color: "#c4c9d4", fontWeight: 500, marginTop: 2 }}>{sub}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {swatch && <div style={{ width: 14, height: 14, borderRadius: "50%", background: swatch, border: "1.5px solid #e5e7eb" }} />}
            <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>{value}</span>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20, background: "linear-gradient(135deg, #111, #2d2d2d)", borderRadius: 16, padding: "18px 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Custom Print · incl. taxes</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}>₹999</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, lineHeight: 1.8 }}>
            🚚 Free delivery<br />📦 7–10 business days
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 12, paddingTop: 10, fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
          100% secure checkout · Easy returns within 7 days
        </div>
      </div>
    </div>
  )};

  const panels = [<Step1 key={1} />, <Step2 key={2} />, <Step3 key={3} />];

  // ── Bottom Action Bar (shared) ─────────────────────────────────────────────
  const BottomBar = () => (
    <div className="cz-bottom-bar">
      {/* Selection summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <div className="cz-thumb" style={{ background: color.previewBg }}>
          <Image src={tshirtImage} alt="" fill style={{ objectFit: "contain", padding: 3 }} unoptimized />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.4px", textTransform: "uppercase" }}>Your Design</div>
          <div className="cz-summary-text">{color.name} · {size} · Custom Print</div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="cz-btn-back">
            <ChevronLeft size={15} /> Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} className="cz-btn-next">
            {step === 2 ? "Review" : "Add Design"} <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={handleAddToCart} disabled={isAdding} className="cz-btn-cart" data-adding={isAdding}>
            <AnimatePresence mode="wait">
              {isAdding
                ? <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} /> Added!</motion.span>
                : <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: 6 }}><ShoppingBag size={14} /> Add to Cart</motion.span>
              }
            </AnimatePresence>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Page Shell ─────────────────────────────────────────────────── */}
      <div className="cz-root">

        {/* ── Studio Header ──────────────────────────────────────────────── */}
        <div className="cz-header">
          <div className="cz-header-row1">
            <nav className="cz-breadcrumb">
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={11} />
              <Link href="/custom-design" style={{ color: "inherit", textDecoration: "none" }}>Custom T-Shirts</Link>
              <ChevronRight size={11} />
              <span style={{ color: "#374151", fontWeight: 700 }}>Design Studio</span>
            </nav>
            <div className="cz-mode-badge">
              <div className="cz-mode-dot" />
              <span>Design Mode Active</span>
            </div>
          </div>
          <div className="cz-header-row2">
            <Stepper current={step} />
          </div>
        </div>

        {/* ── Two-column body ────────────────────────────────────────────── */}
        <div className="cz-body">

          {/* LEFT: Preview */}
          <div className="cz-preview-col">
            <div className="cz-preview-label">
              <span>Live Preview · {color.name} ({viewSide === "front" ? "Front" : "Back"})</span>
              {step === 2 && <div className="cz-drag-hint">✦ Drag to position</div>}
            </div>
            <div className="cz-canvas-wrap">
              <ShirtCanvas interactive={step === 2} />
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="cz-controls-col">
            <div className="cz-controls-scroll">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                  {panels[step - 1]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop bottom bar (inside right panel) */}
            <div className="cz-bottom-bar-desktop">
              <BottomBar />
            </div>
          </div>
        </div>

        {/* Mobile bottom bar (outside columns, fixed) */}
        <div className="cz-bottom-bar-mobile">
          <BottomBar />
        </div>
      </div>

      <style>{`
        /* ── Root ─────────────────────────────────────────────────────── */
        .cz-root {
          display: flex;
          flex-direction: column;
          /* Account for top-bar (40px) + absolute navbar (110px) */
          padding-top: 150px;
          height: 100dvh;
          overflow: hidden;
          background: #f7f8fa;
          font-family: Inter, sans-serif;
          box-sizing: border-box;
        }

        /* ── Header ───────────────────────────────────────────────────── */
        .cz-header {
          background: #fff;
          border-bottom: 1px solid #eef0f3;
          flex-shrink: 0;
        }
        .cz-header-row1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 24px;
          border-bottom: 1px solid #f4f5f7;
        }
        .cz-breadcrumb {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
        }
        .cz-mode-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #10b981;
        }
        .cz-mode-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 3px #d1fae5;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #d1fae5; }
          50% { box-shadow: 0 0 0 5px #a7f3d0; }
        }
        .cz-header-row2 {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px;
        }

        /* ── Stepper ──────────────────────────────────────────────────── */
        .cz-stepper { display: flex; align-items: center; gap: 0; }
        .cz-step-row { display: flex; align-items: center; }
        .cz-step-item { display: flex; align-items: center; gap: 8px; }
        .cz-step-circle {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 13px;
          background: #e9ecef; color: #adb5bd;
          transition: all 0.3s;
        }
        .cz-step-circle[data-done="true"] { background: #10b981; color: #fff; }
        .cz-step-circle[data-active="true"] { background: #111; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.2); }
        .cz-step-label {
          font-size: 12px; font-weight: 700; color: #adb5bd;
          display: none; flex-direction: column; white-space: nowrap;
        }
        .cz-step-label[data-active="true"],
        .cz-step-label[data-done="true"] { display: flex; }
        .cz-step-label[data-active="true"] { color: #111; }
        .cz-step-label[data-done="true"] { color: #10b981; }
        .cz-step-line { width: 36px; height: 2px; margin: 0 10px; background: #e9ecef; transition: background 0.4s; }
        .cz-step-line[data-done="true"] { background: #10b981; }
        .cz-step-full { display: block; }
        .cz-step-short { display: none; }

        /* ── Body ─────────────────────────────────────────────────────── */
        .cz-body {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(auto, 600px) 400px;
          justify-content: center;
          gap: 20px;
          min-height: 0;
          overflow: hidden;
          padding: 0 20px;
        }

        /* ── Preview column ───────────────────────────────────────────── */
        .cz-preview-col {
          padding: 16px 16px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }
        .cz-preview-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .cz-drag-hint {
          font-size: 11px; font-weight: 600; color: #6366f1;
          background: #f0f0ff; padding: 4px 10px;
          border-radius: 100px; border: 1px solid #e0e0ff;
        }
        .cz-canvas-wrap {
          flex: 1;
          min-height: 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 28px rgba(0,0,0,0.1);
        }
        .cz-flip-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          cursor: pointer;
          flex-shrink: 0;
          font-family: inherit;
          transition: background 0.2s;
        }
        .cz-flip-btn:hover { background: #f9fafb; }

        /* ── Controls column ──────────────────────────────────────────── */
        .cz-controls-col {
          background: #fff;
          border-left: 1px solid #eef0f3;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cz-controls-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 22px 12px;
          scrollbar-width: thin;
        }

        /* ── Bottom bar (desktop: inside panel) ───────────────────────── */
        .cz-bottom-bar-desktop {
          border-top: 1px solid #f0f2f5;
          background: #fff;
          flex-shrink: 0;
        }
        .cz-bottom-bar-mobile { display: none; }

        /* ── Bottom bar shared ────────────────────────────────────────── */
        .cz-bottom-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
        }
        .cz-thumb {
          width: 36px; height: 42px;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cz-summary-text {
          font-size: 13px;
          font-weight: 800;
          color: #111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cz-btn-back {
          display: flex; align-items: center; gap: 5px;
          padding: 12px 16px; border-radius: 12px;
          border: 2px solid #e5e7eb; background: #fff;
          font-weight: 800; font-size: 13px; cursor: pointer;
          color: #374151; font-family: inherit;
          transition: border-color 0.2s;
          white-space: nowrap;
        }
        .cz-btn-back:hover { border-color: #111; }
        .cz-btn-next {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 22px; border-radius: 12px; border: none;
          background: #f4c430; font-weight: 900; font-size: 14px;
          cursor: pointer; color: #111; font-family: inherit;
          box-shadow: 0 4px 14px rgba(244,196,48,0.35);
          transition: all 0.2s; white-space: nowrap;
        }
        .cz-btn-next:hover { background: #e6b800; transform: translateY(-1px); }
        .cz-btn-cart {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 22px; border-radius: 12px; border: none;
          background: #111; font-weight: 900; font-size: 14px;
          cursor: pointer; color: #fff; font-family: inherit;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          transition: all 0.3s; white-space: nowrap;
        }
        .cz-btn-cart[data-adding="true"] { background: #10b981; box-shadow: 0 4px 14px rgba(16,185,129,0.35); }

        /* ── Hover states ─────────────────────────────────────────────── */
        .print-el:hover .el-del { opacity: 1 !important; }

        /* ── Scrollbar ────────────────────────────────────────────────── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        /* ════════════════════════════════════════════════════════════════
           RESPONSIVE — Tablet (≤ 900px)
        ════════════════════════════════════════════════════════════════ */
        @media (max-width: 900px) {
          .cz-body { grid-template-columns: 1fr 340px; }
          .cz-step-label { display: none !important; }
        }

        /* ════════════════════════════════════════════════════════════════
           RESPONSIVE — Mobile (≤ 640px)
        ════════════════════════════════════════════════════════════════ */
        @media (max-width: 640px) {
          .cz-root {
            /* Mobile navbar is ~60px, top-bar is same */
            padding-top: 110px;
            height: auto;
            min-height: 100dvh;
            overflow: visible;
          }
          .cz-header-row1 { padding: 8px 16px; }
          .cz-mode-badge span { display: none; }
          .cz-header-row2 { padding: 8px 16px; }
          .cz-step-full { display: none; }
          .cz-step-short { display: block; }
          .cz-step-label { display: flex !important; }
          .cz-step-label[data-active="true"],
          .cz-step-label[data-done="true"] { display: flex !important; }
          .cz-step-line { width: 24px; margin: 0 6px; }

          /* Stack columns */
          .cz-body {
            display: flex;
            flex-direction: column;
            overflow: visible;
          }

          /* Preview: fixed height on mobile */
          .cz-preview-col {
            padding: 12px 16px 8px;
            height: 48vw;
            min-height: 220px;
            max-height: 320px;
            flex-shrink: 0;
          }
          .cz-preview-label { font-size: 10px; }
          .cz-flip-btn { padding: 8px 0; font-size: 11px; }

          /* Controls: scrollable */
          .cz-controls-col {
            border-left: none;
            border-top: 1px solid #eef0f3;
            flex: 1;
            overflow: visible;
          }
          .cz-controls-scroll {
            padding: 16px 16px 100px;
            overflow: visible;
          }

          /* Hide desktop bottom bar, show mobile fixed bar */
          .cz-bottom-bar-desktop { display: none; }
          .cz-bottom-bar-mobile {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(12px);
            border-top: 1px solid #eef0f3;
            box-shadow: 0 -6px 24px rgba(0,0,0,0.08);
            z-index: 500;
          }
          .cz-bottom-bar { padding: 10px 16px; }
          .cz-btn-next, .cz-btn-cart { padding: 12px 16px; font-size: 13px; }
          .cz-btn-back { padding: 12px 12px; }
          .cz-summary-text { font-size: 12px; }
          .cz-thumb { width: 30px; height: 36px; }
        }
      `}</style>
    </>
  );
}
