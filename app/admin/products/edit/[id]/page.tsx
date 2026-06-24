"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, UploadCloud, X, Save, Loader2 } from "lucide-react"

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

  // Image State
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setNewImages(prev => [...prev, ...filesArray])
      
      // Create local preview URLs for the new files
      const newUrls = filesArray.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newUrls])
    }
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      // Using FormData to handle both text and files
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("price", formData.price)
      submitData.append("category", formData.category)
      submitData.append("color", formData.color)
      submitData.append("stock", formData.stock)
      submitData.append("description", formData.description)
      submitData.append("isPremium", formData.isPremium.toString())
      submitData.append("sizes", JSON.stringify(formData.sizes))
      submitData.append("existingImages", JSON.stringify(existingImages))

      newImages.forEach(file => {
        submitData.append("newImages", file)
      })

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: submitData,
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Edit Artifact</h1>
            <p className="text-gray-500 text-sm mt-1">Update inventory, descriptions, and media.</p>
          </div>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-200 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-medium" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Price (₹)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-mono" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-semibold">
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="KIDS">KIDS</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Color</label>
                <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Available Sizes</label>
              <div className="flex gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-12 h-12 rounded-md font-bold text-sm border-2 transition-all ${formData.sizes.includes(size) ? 'bg-[#FF3E00] border-[#FF3E00] text-white' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-[#FF3E00] text-gray-900 dark:text-white font-medium resize-none" />
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
              <input type="checkbox" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} className="w-5 h-5 accent-[#FF3E00]" />
              <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Add to Premium Vault (Featured)</span>
            </label>
          </div>

          {/* Right Column: Images */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Product Images</label>
            
            {/* Image Upload Box */}
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors mb-6 group">
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud size={40} className="text-gray-400 group-hover:text-[#FF3E00] transition-colors mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Click or drag images to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-4">
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white">
                  <Image src={url} alt="Existing" fill className="object-cover" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold text-center py-1">CURRENT</span>
                </div>
              ))}
              
              {/* New Images */}
              {previewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-lg border-2 border-[#FF3E00] overflow-hidden bg-white">
                  <Image src={url} alt="New Preview" fill className="object-cover" />
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-[#FF3E00] text-white text-[10px] font-bold text-center py-1">NEW</span>
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
            className="flex items-center gap-2 px-8 py-3 bg-[#FF3E00] hover:bg-[#E63E00] text-white rounded-md font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Updating Artifact..." : "Update Artifact"}
          </button>
        </div>
      </form>
    </div>
  )
}