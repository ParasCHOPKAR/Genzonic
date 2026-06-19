"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import styles from "../../admin.module.css"; // Ensure this path matches your structure

export default function AddProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Manage all text/select form state (Added 'featured' here)
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "men", 
    color: "",
    stock: "",
    description: "",
    featured: false, // 🔥 Default is false
  });

  // MULTI-SIZE SELECTOR STATE
  const [sizes, setSizes] = useState<string[]>([]);
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // MULTI-IMAGE UPLOAD STATE
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // MULTI-IMAGE UPLOAD LOGIC
  const handleMultiImageUpload = async (e: any) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingImage(true);

    try {
      const uploadPromises = files.map((file: any) => {
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
      });

      // Wait for all images to upload to Cloudinary
      const urls: any = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]); // Add them to our gallery array
    } catch (error) {
      console.error(error);
      alert("Error uploading images");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedImages.length === 0) return alert("Please upload at least one image.");
    if (sizes.length === 0) return alert("Please select at least one size.");

    setLoading(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          sizes: sizes, 
          image: uploadedImages[0], // Set the first image as the main thumbnail
          images: uploadedImages    // Send the whole array for the gallery
        }),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        alert("Failed to save product.");
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
        <h2 className={styles.title}>ADD NEW ARTIFACT</h2>
        <p className={styles.subtitle}>Deploy new inventory with multiple sizes and gallery images.</p>
      </div>

      <div className={styles.chartBox} style={{ padding: "40px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>PRODUCT NAME</label>
              <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>PRICE (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>CATEGORY</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="men">MENS</option>  {/* value MUST be "men" */}
                <option value="women">WOMENS</option>
                <option value="kids">KIDS</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>COLOR</label>
              <input name="color" value={form.color} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* SIZES - MULTI SELECT */}
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
                    border: sizes.includes(size) ? "2px solid #ff3e00" : "1px solid #e2e8f0",
                    background: sizes.includes(size) ? "rgba(255, 62, 0, 0.1)" : "transparent",
                    color: sizes.includes(size) ? "#ff3e00" : "inherit"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>STOCK QUANTITY</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* MULTI-IMAGE UPLOAD INPUT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
              PRODUCT IMAGES (SELECT MULTIPLE)
              {uploadingImage && <span style={{ color: "#ff3e00", marginLeft: "10px" }}>UPLOADING...</span>}
            </label>
            
            <input type="file" multiple accept="image/*" onChange={handleMultiImageUpload} style={inputStyle} disabled={uploadingImage} />
            
            {/* Preview Grid for Multiple Images */}
            {uploadedImages.length > 0 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap", padding: "10px", background: "rgba(128,128,128,0.05)", borderRadius: "8px" }}>
                {uploadedImages.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", border: idx === 0 ? "2px solid #ff3e00" : "none", borderRadius: "6px" }}>
                    <img src={img} alt={`Preview ${idx}`} style={{ width: "80px", height: "100px", objectFit: "cover", borderRadius: "4px", display: "block" }} />
                    {idx === 0 && <span style={{ position: "absolute", bottom: "5px", left: "5px", background: "#ff3e00", color: "white", fontSize: "8px", padding: "2px 4px", borderRadius: "2px", fontWeight: 800 }}>MAIN</span>}
                    
                    <button 
                      type="button"
                      onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                      style={{ position: "absolute", top: "-8px", right: "-8px", background: "black", color: "white", border: "1px solid white", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>DESCRIPTION</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* 🔥 NEW PREMIUM VAULT CHECKBOX 🔥 */}
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px", marginBottom: "5px" }}>
            <input 
              type="checkbox" 
              id="featured" 
              checked={form.featured} 
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: "20px", height: "20px", accentColor: "#FF3E00", cursor: "pointer" }}
            />
            <label htmlFor="featured" style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#64748b", cursor: "pointer" }}>
              Add to Premium Vault (Featured)
            </label>
          </div>

          <button type="submit" disabled={loading || uploadingImage} style={{ background: "#ff3e00", color: "white", padding: "15px", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer", marginTop: "10px", transition: "0.2s", opacity: (loading || uploadingImage) ? 0.7 : 1 }}>
            {loading ? "DEPLOYING ARTIFACT..." : "PUBLISH ARTIFACT"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "transparent", color: "inherit", width: "100%"
};