"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
// Adjust this path if your admin.module.css is located somewhere else!
import styles from "@/app/admin/admin.module.css";

export default function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "men", 
    color: "",
    stock: "",
    description: "",
  });

  // Array States
  const [sizes, setSizes] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Fetch the existing product data when the page loads
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // We use your main products API to get all, then find the one we need.
        // Alternatively, if you have a GET route for /api/admin/products/[id], you can use that!
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        
        if (data.success) {
          const product = data.products.find((p: any) => p._id === id);
          if (product) {
            setForm({
              name: product.name || "",
              price: product.price || "",
              category: product.category || "men",
              color: product.color || "",
              stock: product.stock || "",
              description: product.description || "",
            });
            setSizes(product.sizes || []);
            
            // Load existing images
            if (product.images && product.images.length > 0) {
              setUploadedImages(product.images);
            } else if (product.image) {
              setUploadedImages([product.image]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const toggleSize = (size: string) => {
    setSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Multi-Image Upload Handler
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

      const urls: any = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]); 
    } catch (error) {
      console.error(error);
      alert("Error uploading images");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Updates to Database
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedImages.length === 0) return alert("Please upload at least one image.");
    if (sizes.length === 0) return alert("Please select at least one size.");

    setLoading(true);

    try {
      // Sending a PUT request to update the specific product
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          sizes: sizes, 
          image: uploadedImages[0], // Main thumbnail
          images: uploadedImages    // Full gallery array
        }),
      });

      if (response.ok) {
        router.push("/admin/products"); // Go back to products list on success
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.dashboardWrapper} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>EDIT ARTIFACT</h2>
        <p className={styles.subtitle}>Update inventory data, sizing, and media.</p>
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
                <option value="men">MENS</option>
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

          <button type="submit" disabled={loading || uploadingImage} style={{ background: "#ff3e00", color: "white", padding: "15px", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer", marginTop: "10px", transition: "0.2s", opacity: (loading || uploadingImage) ? 0.7 : 1 }}>
            {loading ? "SAVING CHANGES..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "transparent", color: "inherit", width: "100%"
};