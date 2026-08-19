"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import styles from "../../admin.module.css";

export default function AddCustomProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    featuredImage: "",
    rank: "",
  });

  const availableSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
  const [sizes, setSizes] = useState<string[]>(["M", "L", "XL"]);

  const [colors, setColors] = useState([{ name: "White", hex: "#FFFFFF", frontImage: "", backImage: "" }]);
  const [designs, setDesigns] = useState([{ name: "Design 1", category: "Trending", imageUrl: "" }]);

  const toggleSize = (size: string) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: reader.result }),
          });
          const data = await res.json();
          if (data.url) resolve(data.url);
          else reject("Upload failed");
        } catch (err) { reject(err); }
      };
    });
  };

  const handleImageUpload = async (e: any, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setter(url);
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.featuredImage) return alert("Please upload a featured image.");
    if (sizes.length === 0) return alert("Please select at least one size.");
    if (colors.length === 0) return alert("Please add at least one color.");

    setLoading(true);
    try {
      const response = await fetch("/api/admin/custom-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          rank: Number(form.rank || 9999),
          sizes: sizes,
          colors: colors,
          designs: designs
        }),
      });

      if (response.ok) {
        router.push("/admin/custom-products");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save product.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>ADD CUSTOM T-SHIRT</h2>
        <p className={styles.subtitle}>Configure colors, sizes, and trendy designs for the customization studio.</p>
      </div>

      <div className={styles.chartBox} style={{ padding: "30px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>PRODUCT NAME (BASE)</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. Premium DTF T-Shirt" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>BASE PRICE (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>STOCK QUANTITY</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>RANK (Sort Order)</label>
              <input name="rank" type="number" value={form.rank} onChange={handleChange} style={inputStyle} placeholder="1 = Highest" />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>FEATURED THUMBNAIL (For Selection Page)</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setForm({ ...form, featuredImage: url }))} style={inputStyle} disabled={uploadingImage} />
            {form.featuredImage && <img src={form.featuredImage} alt="Featured" style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>AVAILABLE SIZES</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {availableSizes.map(size => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  style={{
                    width: "45px", height: "45px", borderRadius: "6px", fontWeight: 800, cursor: "pointer",
                    border: sizes.includes(size) ? "2px solid #6366f1" : "1px solid #e2e8f0",
                    background: sizes.includes(size) ? "rgba(99, 102, 241, 0.1)" : "transparent",
                    color: sizes.includes(size) ? "#6366f1" : "inherit"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS SECTION */}
          <div style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: "#1e293b" }}>COLORS & SHIRT IMAGES</h3>
              <button type="button" onClick={() => setColors([...colors, { name: "", hex: "#000000", frontImage: "", backImage: "" }])} style={{ display: "flex", alignItems: "center", gap: 4, background: "#6366f1", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                <Plus size={14} /> Add Color
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {colors.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 1fr auto", gap: 12, alignItems: "end", background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>COLOR NAME</label>
                    <input value={c.name} onChange={(e) => setColors(colors.map((color, idx) => idx === i ? { ...color, name: e.target.value } : color))} style={inputStyle} placeholder="e.g. White" required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>HEX CODE</label>
                    <input type="color" value={c.hex} onChange={(e) => setColors(colors.map((color, idx) => idx === i ? { ...color, hex: e.target.value } : color))} style={{ ...inputStyle, padding: 4, height: 46 }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>FRONT IMAGE</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setColors(colors.map((color, idx) => idx === i ? { ...color, frontImage: url } : color)))} style={{ ...inputStyle, padding: 10 }} disabled={uploadingImage} />
                    {c.frontImage && <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>✓ Uploaded</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>BACK IMAGE</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setColors(colors.map((color, idx) => idx === i ? { ...color, backImage: url } : color)))} style={{ ...inputStyle, padding: 10 }} disabled={uploadingImage} />
                    {c.backImage && <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>✓ Uploaded</span>}
                  </div>
                  <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} style={{ background: "#fee2e2", color: "#ef4444", border: "none", width: 46, height: 46, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DESIGNS SECTION */}
          <div style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#fdf4ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: "#4a044e" }}>TRENDY DESIGNS (Artwork Gallery)</h3>
              <button type="button" onClick={() => setDesigns([...designs, { name: "", category: "Trending", imageUrl: "" }])} style={{ display: "flex", alignItems: "center", gap: 4, background: "#d946ef", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                <Plus size={14} /> Add Design
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {designs.map((d, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr auto", gap: 12, alignItems: "end", background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #fbcfe8" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>DESIGN NAME</label>
                    <input value={d.name} onChange={(e) => setDesigns(designs.map((design, idx) => idx === i ? { ...design, name: e.target.value } : design))} style={inputStyle} placeholder="e.g. Birthday Vibes" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>CATEGORY</label>
                    <input value={d.category} onChange={(e) => setDesigns(designs.map((design, idx) => idx === i ? { ...design, category: e.target.value } : design))} style={inputStyle} placeholder="e.g. Trending" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>ARTWORK IMAGE (.SVG or .PNG)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setDesigns(designs.map((design, idx) => idx === i ? { ...design, imageUrl: url } : design)))} style={{ ...inputStyle, padding: 10 }} disabled={uploadingImage} />
                    {d.imageUrl && <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>✓ Uploaded</span>}
                  </div>
                  <button type="button" onClick={() => setDesigns(designs.filter((_, idx) => idx !== i))} style={{ background: "#fee2e2", color: "#ef4444", border: "none", width: 46, height: 46, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading || uploadingImage} style={{ background: "#6366f1", color: "white", padding: "16px", border: "none", borderRadius: "8px", fontWeight: 800, fontSize: "14px", letterSpacing: "1px", cursor: "pointer", marginTop: "10px", transition: "0.2s", opacity: (loading || uploadingImage) ? 0.7 : 1 }}>
            {loading ? "DEPLOYING PRODUCT..." : uploadingImage ? "UPLOADING MEDIA..." : "PUBLISH CUSTOM T-SHIRT"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "transparent", color: "inherit", width: "100%", fontSize: 13, fontWeight: 500
};
