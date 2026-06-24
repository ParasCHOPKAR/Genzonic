"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, X } from "lucide-react"
// Import your exact CSS module used in the Add page
import styles from "../../products.module.css"

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "MEN",
    color: "",
    stock: "",
    description: "",
    isPremium: false,
    sizes: [] as string[],
  })

  // Image States
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImagesBase64, setNewImagesBase64] = useState<string[]>([])

  const availableSizes = ["S", "M", "L", "XL", "XXL"]

  // Fetch Existing Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`)
        const data = await res.json()

        if (data.success) {
          const p = data.product
          setFormData({
            name: p.name,
            price: p.price.toString(),
            category: p.category,
            color: p.color || "",
            stock: p.stock.toString(),
            description: p.description || "",
            isPremium: p.isPremium || false,
            sizes: p.sizes || [],
          })
          setExistingImages(p.images || [])
        } else {
          setError("Failed to load product.")
        }
      } catch (err) {
        setError("An error occurred while fetching.")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) fetchProduct()
  }, [productId])

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  // Convert selected files to Base64 to guarantee backend delivery
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      
      filesArray.forEach(file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          if (reader.result) {
            setNewImagesBase64(prev => [...prev, reader.result as string])
          }
        }
      })
    }
  }

  const removeNewImage = (index: number) => {
    setNewImagesBase64(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  // Submit via Standard JSON
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          existingImages,
          newImages: newImagesBase64 
        }),
      })

      const result = await res.json()

      if (result.success) {
        router.push("/admin/products")
        router.refresh()
      } else {
        setError(result.message || "Failed to update product")
      }
    } catch (err) {
      setError("Server error during update")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.wrapper} style={{ alignItems: 'center' }}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {/* Header matched to Add page */}
        <div className={styles.header} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '5px' }}>
            <ArrowLeft size={24} color="#000" />
          </button>
          <div>
            <h1 className={styles.title} style={{ textTransform: 'uppercase' }}>EDIT ARTIFACT</h1>
            <p className={styles.subtitle}>Update inventory, descriptions, and media.</p>
          </div>
        </div>

        {error && <div style={{ marginBottom: '20px', padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '1px solid #f87171' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          
          {/* Row 1: Name & Price */}
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label} style={{ textTransform: 'uppercase' }}>Product Name</label>
              <input 
                type="text" 
                required 
                className={styles.input} 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} style={{ textTransform: 'uppercase' }}>Price (₹)</label>
              <input 
                type="number" 
                required 
                className={styles.input} 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
              />
            </div>
          </div>

          {/* Row 2: Category & Color */}
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label} style={{ textTransform: 'uppercase' }}>Category</label>
              <select 
                className={styles.input} 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="MEN">MENS</option>
                <option value="WOMEN">WOMENS</option>
                <option value="KIDS">KIDS</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} style={{ textTransform: 'uppercase' }}>Color</label>
              <input 
                type="text" 
                className={styles.input} 
                value={formData.color} 
                onChange={e => setFormData({...formData, color: e.target.value})} 
              />
            </div>
          </div>

          {/* Row 3: Available Sizes */}
          <div className={styles.full}>
            <label className={styles.label} style={{ textTransform: 'uppercase' }}>Available Sizes</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: formData.sizes.includes(size) ? '2px solid #FF3E00' : '1px solid #d1d5db',
                    background: formData.sizes.includes(size) ? 'white' : 'transparent',
                    color: formData.sizes.includes(size) ? '#FF3E00' : '#374151',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Stock */}
          <div className={styles.full}>
            <label className="label" style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: 600, color: '#374151' }}>Stock Quantity</label>
            <input 
              type="number" 
              required 
              className={styles.input} 
              value={formData.stock} 
              onChange={e => setFormData({...formData, stock: e.target.value})} 
            />
          </div>

          {/* Row 5: Images */}
          <div className={styles.full}>
            <label className={styles.label} style={{ textTransform: 'uppercase' }}>Product Images (Select Multiple)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageSelect} 
              className={`${styles.input} ${styles.fileInput}`} 
            />

            {/* Clean Image Previews */}
            {(existingImages.length > 0 || newImagesBase64.length > 0) && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} style={{ position: 'relative', width: '120px', height: '120px', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb' }}>
                    <Image src={url} alt="Existing" fill style={{ objectFit: 'contain', padding: '5px' }} />
                    <button type="button" onClick={() => removeExistingImage(index)} style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', padding: '2px 0' }}>CURRENT</div>
                  </div>
                ))}
                
                {/* New Images */}
                {newImagesBase64.map((url, index) => (
                  <div key={`new-${index}`} style={{ position: 'relative', width: '120px', height: '120px', border: '2px solid #FF3E00', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb' }}>
                    <Image src={url} alt="New Preview" fill style={{ objectFit: 'contain', padding: '5px' }} />
                    <button type="button" onClick={() => removeNewImage(index)} style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', background: '#FF3E00', color: 'white', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', padding: '2px 0' }}>NEW</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 6: Description */}
          <div className={styles.full}>
            <label className={styles.label} style={{ textTransform: 'uppercase' }}>Description</label>
            <textarea 
              rows={5} 
              className={`${styles.input} ${styles.textarea}`} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* Premium Checkbox */}
          <div className={styles.full} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              checked={formData.isPremium} 
              onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
              style={{ width: '18px', height: '18px', accentColor: '#FF3E00', cursor: 'pointer' }}
            />
            <label className={styles.label} style={{ textTransform: 'uppercase', cursor: 'pointer' }}>Add to Premium Vault (Featured)</label>
          </div>

          {/* Submit Button matched to Add Page Orange */}
          <button 
            type="submit" 
            disabled={isSaving}
            className={styles.button}
            style={{ 
              background: '#FF3E00', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {isSaving ? <div className={styles.loader}></div> : null}
            {isSaving ? "UPDATING ARTIFACT..." : "UPDATE ARTIFACT"}
          </button>

        </form>
      </div>
    </div>
  )
}