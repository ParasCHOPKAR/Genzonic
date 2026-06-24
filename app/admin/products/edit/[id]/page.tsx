"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, UploadCloud, X, Save, Loader2, Image as ImageIcon } from "lucide-react"

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

  // 🔥 NEW: Convert selected files to Base64 so they send perfectly to the backend
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
          newImages: newImagesBase64 // Sending the raw base64 strings
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Edit Artifact</h1>
          <p className="text-gray-500 text-sm mt-1">Update inventory, descriptions, and media.</p>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-semibold transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-mono transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-mono transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-semibold transition-all">
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="KIDS">KIDS</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Color</label>
                <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-semibold transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-12 h-12 rounded-lg font-black text-sm border-2 transition-all ${formData.sizes.includes(size) ? 'bg-[#FF3E00] border-[#FF3E00] text-white shadow-md shadow-orange-500/20' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] text-gray-900 dark:text-white font-medium resize-none transition-all" />
            </div>

            <label className="flex items-center gap-3 p-5 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
              <input type="checkbox" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} className="w-5 h-5 accent-[#FF3E00] rounded" />
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">Add to Premium Vault (Featured)</span>
            </label>
          </div>

          {/* Right Column: Images */}
          <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
            <label className="block text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Artifact Media
            </label>
            
            {/* Image Upload Box */}
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-white dark:bg-[#111] hover:border-[#FF3E00] hover:bg-orange-50 dark:hover:bg-[#FF3E00]/10 transition-all mb-6 group cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <UploadCloud size={48} className="text-gray-300 dark:text-gray-600 group-hover:text-[#FF3E00] transition-colors mb-4" />
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Click or drag new images here</p>
              <p className="text-xs text-gray-500 font-medium">PNG, JPG, WEBP (Auto-converts to Base64)</p>
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-2">
              
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white shadow-sm group">
                  <Image src={url} alt="Existing" fill className="object-contain p-2" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-10">
                    <X size={14} strokeWidth={3} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-black tracking-wider text-center py-1.5 uppercase">
                    Current
                  </div>
                </div>
              ))}
              
              {/* New Uploaded Images */}
              {newImagesBase64.map((url, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-xl border-2 border-[#FF3E00] overflow-hidden bg-white shadow-sm group">
                  <Image src={url} alt="New Preview" fill className="object-cover" />
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-10">
                    <X size={14} strokeWidth={3} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#FF3E00] text-white text-[10px] font-black tracking-wider text-center py-1.5 uppercase">
                    New Upload
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#FF3E00] dark:hover:bg-[#FF3E00] dark:hover:text-white rounded-lg font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Saving Changes..." : "Save Artifact"}
          </button>
        </div>
      </form>
    </div>
  )
}