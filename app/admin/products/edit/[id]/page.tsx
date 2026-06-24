"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, X, Loader2 } from "lucide-react"

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
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#FF3E00]" size={40} /></div>
  }

  return (
    <div className="w-full max-w-5xl p-6 md:p-10">
      
      {/* Header aligned with your clean design */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="hover:opacity-70 transition-opacity">
          <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Edit Artifact</h1>
          <p className="text-gray-500 text-sm mt-1">Update inventory, descriptions, and media.</p>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW 1: Name & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white transition-all" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Price (₹)</label>
            <input 
              type="number" 
              required 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white transition-all" 
            />
          </div>
        </div>

        {/* ROW 2: Category & Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white transition-all"
            >
              <option value="MEN">MENS</option>
              <option value="WOMEN">WOMENS</option>
              <option value="KIDS">KIDS</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Color</label>
            <input 
              type="text" 
              value={formData.color} 
              onChange={e => setFormData({...formData, color: e.target.value})} 
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white transition-all" 
            />
          </div>
        </div>

        {/* ROW 3: Sizes */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">Available Sizes</label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`w-12 h-12 rounded font-bold text-sm border transition-all ${formData.sizes.includes(size) ? 'bg-[#FF3E00] border-[#FF3E00] text-white' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 4: Stock */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
          <input 
            type="number" 
            required 
            value={formData.stock} 
            onChange={e => setFormData({...formData, stock: e.target.value})} 
            className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white transition-all" 
          />
        </div>

        {/* ROW 5: Images */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Product Images (Select Multiple)</label>
          
          {/* Simple file input mirroring your Add page */}
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageSelect} 
            className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 cursor-pointer transition-all" 
          />

          {/* Clean thumbnail previews for edit mode */}
          {(existingImages.length > 0 || newImagesBase64.length > 0) && (
            <div className="flex flex-wrap gap-4 mt-6">
              
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative w-24 h-24 rounded border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900">
                  <Image src={url} alt="Existing" fill className="object-contain p-1" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-white dark:bg-black rounded-full p-1 shadow hover:text-red-500 transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                  <div className="absolute bottom-0 w-full bg-black/70 text-[8px] text-white text-center font-bold uppercase py-0.5">Current</div>
                </div>
              ))}
              
              {/* New Images */}
              {newImagesBase64.map((url, index) => (
                <div key={`new-${index}`} className="relative w-24 h-24 rounded border-2 border-[#FF3E00] overflow-hidden bg-gray-50 dark:bg-gray-900">
                  <Image src={url} alt="New Preview" fill className="object-contain p-1" />
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-white dark:bg-black rounded-full p-1 shadow hover:text-red-500 transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                  <div className="absolute bottom-0 w-full bg-[#FF3E00] text-[8px] text-white text-center font-bold uppercase py-0.5">New</div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ROW 6: Description */}
        <div>
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
          <textarea 
            rows={5} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white resize-none transition-all" 
          />
        </div>

        {/* ROW 7: Premium Toggle */}
        <label className="flex items-center gap-3 mt-4 cursor-pointer w-fit">
          <input 
            type="checkbox" 
            checked={formData.isPremium} 
            onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
            className="w-4 h-4 accent-[#FF3E00] rounded cursor-pointer" 
          />
          <span className="font-bold text-gray-500 text-xs uppercase tracking-widest">Add to Premium Vault (Featured)</span>
        </label>

        {/* FULL WIDTH BUTTON */}
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full mt-8 py-4 bg-[#FF3E00] hover:bg-[#E63E00] text-white rounded font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : null}
          {isSaving ? "UPDATING ARTIFACT..." : "UPDATE ARTIFACT"}
        </button>

      </form>
    </div>
  )
}