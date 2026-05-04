"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle, Save } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "men", 
    color: "",
    size: "S",
    stock: "",
    description: "",
    image: "" 
  });

  // 🔥 Fetch Existing Product Data
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // THE FIX: We make sure to target data.product, and provide fallback empty strings
        if (data.success && data.product) {
          setForm({
            name: data.product.name || "",
            price: data.product.price || "",
            category: data.product.category || "men",
            color: data.product.color || "",
            size: data.product.size || "S",
            stock: data.product.stock || "",
            description: data.product.description || "",
            image: data.product.image || "",
          });
        }
      })
      .catch((err) => console.error("Failed to fetch product", err))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image Upload Logic
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
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
        
        if (data.url) {
          setForm({ ...form, image: data.url });
        } else {
          alert("Upload failed: No URL returned.");
        }
      } catch (err) {
        console.error(err);
        alert("Image upload failed.");
      } finally {
        setUploadingImage(false);
      }
    };
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        }),
      });

      if (response.ok) {
        alert("✅ Artifact updated successfully!");
        router.push("/admin/products"); 
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during update.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-wrapper">
        <Loader2 className="spin" size={32} />
        <p>DECRYPTING ARTIFACT DATA...</p>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        
        <div className="admin-header">
          <h2 className="title">UPDATE ARTIFACT</h2>
          <p className="subtitle">Modify existing inventory data. ID: {id}</p>
        </div>

        <form onSubmit={handleUpdate} className="admin-form">

          <div className="form-grid">
            <div className="input-group">
              <label>Product Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Category (Target Audience)</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="men">MENS COLLECTION</option>
                <option value="women">WOMENS COLLECTION</option>
                <option value="kids">KIDS COLLECTION</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Color</label>
              <input name="color" type="text" value={form.color} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label>Size</label>
              <select name="size" value={form.size} onChange={handleChange} required>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">Double XL (XXL)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Stock Quantity</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Product Image</label>
            <div className="upload-container">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                className="file-input" 
                id="file-upload"
              />
              <label htmlFor="file-upload" className={`upload-box ${form.image ? 'success' : ''}`}>
                {uploadingImage ? (
                  <><Loader2 className="spin" size={20} /> REPLACING IMAGE...</>
                ) : (
                  <><UploadCloud size={20} /> CLICK TO REPLACE IMAGE</>
                )}
              </label>
            </div>
            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="input-group full-width">
            <label>Description / Lore</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading || uploadingImage} className="submit-button">
            {loading ? <Loader2 className="spin" size={18} /> : <><Save size={18} /> SAVE CHANGES</>}
          </button>

        </form>
      </div>

      <style jsx>{`
        .loading-wrapper {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 12px;
          letter-spacing: 2px;
          gap: 15px;
          font-family: 'Inter', sans-serif;
        }

        .admin-wrapper {
          padding: 40px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          max-width: 900px;
          margin: 0 auto;
        }

        .admin-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .admin-header {
          margin-bottom: 40px;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #f8fafc;
          margin: 0 0 8px 0;
        }

        .subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          font-family: monospace;
        }

        .admin-form { display: flex; flex-direction: column; gap: 25px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .full-width { grid-column: 1 / -1; }

        label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #94a3b8;
          text-transform: uppercase;
        }

        input[type="text"], input[type="number"], select, textarea {
          padding: 14px 16px;
          background: #020617;
          border: 1px solid #1e293b;
          color: #f8fafc;
          font-size: 14px;
          border-radius: 6px;
          transition: all 0.3s ease;
          outline: none;
        }

        input:focus, select:focus, textarea:focus {
          border-color: #ff3e00;
          box-shadow: 0 0 0 2px rgba(255, 62, 0, 0.2);
        }

        select option { background: #0f172a; color: white; }

        .upload-container { position: relative; width: 100%; }
        .file-input { display: none; }

        .upload-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background: #020617;
          border: 1px dashed #334155;
          border-radius: 6px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.3s;
        }

        .upload-box:hover { border-color: #ff3e00; color: #ff3e00; }
        .upload-box.success { border-color: #50e3c2; color: #50e3c2; border-style: solid; }

        .image-preview {
          margin-top: 15px;
          width: 100px;
          height: 120px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #1e293b;
        }

        .image-preview img { width: 100%; height: 100%; object-fit: cover; }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px;
          background: #ff3e00;
          color: white;
          border: none;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 2px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .submit-button:hover:not(:disabled) { background: #e63800; transform: translateY(-2px); }
        .submit-button:disabled { opacity: 0.5; cursor: not-allowed; background: #334155; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .admin-card { padding: 20px; }
        }
      `}</style>
    </div>
  );
}