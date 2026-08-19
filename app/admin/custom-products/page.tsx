"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus, Loader2, PackageSearch, Palette } from "lucide-react"

interface Color {
  name: string
  hex: string
}

interface CustomProduct {
  _id: string
  name: string
  price: number
  stock: number
  featuredImage: string
  colors: Color[]
  rank?: number
}

export default function AdminCustomProducts() {
  const [products, setProducts] = useState<CustomProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/custom-products")
      const data = await res.json()
      
      if (data.success) {
        const sortedProducts = (data.products || []).sort((a: CustomProduct, b: CustomProduct) => {
          const rankA = a.rank ?? 9999;
          const rankB = b.rank ?? 9999;
          return rankA - rankB;
        });
        setProducts(sortedProducts)
      } else {
        setError("Failed to load custom products.")
      }
    } catch (err) {
      setError("An error occurred while fetching data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this custom product?")) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/custom-products/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (data.success) {
        setProducts(prev => prev.filter(product => product._id !== id))
      } else {
        alert(data.message || "Failed to delete product.")
      }
    } catch (err) {
      alert("An error occurred while deleting.")
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#FF3E00]" size={40} />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto bg-white min-h-screen">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 uppercase">
            Custom T-Shirts
          </h1>
          <p className="text-gray-500 font-medium mt-1.5 text-sm">
            Manage customizable products, available colors, and base pricing.
          </p>
        </div>

        <Link 
          href="/admin/custom-products/add" 
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} strokeWidth={3} /> Add Custom Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200 font-bold">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-6 py-4 text-[11px] font-black text-[#6366f1] uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Image</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Base Price</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Colors</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Palette size={48} className="mb-4 text-gray-300" />
                      <p className="text-lg font-bold text-gray-900 mb-1">No Custom Products</p>
                      <p className="text-sm font-medium">Add a customizable product base to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-indigo-50 border border-indigo-200 text-[#6366f1] font-black text-[13px] rounded-md shadow-sm">
                        {product.rank ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-24">
                      <div className="h-16 w-16 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-200 flex items-center justify-center">
                        {product.featuredImage ? (
                          <Image src={product.featuredImage} alt={product.name} fill className="object-cover" />
                        ) : (
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 text-[15px] group-hover:text-[#6366f1] transition-colors">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-mono font-bold text-[15px]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {product.colors && product.colors.map((c, i) => (
                           <div key={i} title={c.name} style={{ backgroundColor: c.hex }} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-900 font-mono font-bold text-[15px]">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/custom-products/edit/${product._id}`} className="p-2 bg-white text-gray-500 hover:text-black border border-gray-200 hover:border-gray-400 rounded-lg shadow-sm transition-all" title="Edit Product">
                          <Edit size={18} strokeWidth={2.5} />
                        </Link>
                        <button onClick={() => handleDelete(product._id)} disabled={isDeleting === product._id} className="p-2 bg-white text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition-all disabled:opacity-50" title="Delete Product">
                          {isDeleting === product._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
