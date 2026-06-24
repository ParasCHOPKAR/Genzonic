"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"

// Define the interface based on your MongoDB model
interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  images: string[]
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Fetch all products on load
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products")
      const data = await res.json()
      
      if (data.success) {
        setProducts(data.products || [])
      } else {
        setError("Failed to load artifacts.")
      }
    } catch (err) {
      setError("An error occurred while fetching data.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Product Deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this artifact?")) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (data.success) {
        // Remove the deleted product from the UI
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
      
      {/* HEADER SECTION - Fixed Invisible Text Issue */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          {/* Explicitly forcing text-black so it never vanishes on a white background */}
          <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight inline-block bg-blue-500/10 px-2 py-1">
            INVENTORY ARCHIVE
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-sm">
            Manage all active GenZonic artifacts.
          </p>
        </div>

        {/* Fixed Invisible "Add New Artifact" button */}
        <Link 
          href="/admin/products/add" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#FF3E00] transition-colors uppercase tracking-wider"
        >
          <Plus size={18} strokeWidth={3} /> ADD NEW ARTIFACT
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-200 font-bold">
          {error}
        </div>
      )}

      {/* TABLE SECTION - Matched to your dark blue/black aesthetic */}
      <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Headers */}
            <thead>
              <tr className="border-b border-slate-800 bg-[#0f172a]">
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No artifacts found in the archive.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Product Image */}
                    <td className="px-6 py-4">
                      <div className="h-14 w-14 rounded-md bg-white overflow-hidden relative border border-slate-700">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]">No Img</div>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-white text-sm">
                        {product.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-semibold text-sm uppercase tracking-wider text-[#60a5fa]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-white font-mono font-bold text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className="text-white font-mono font-bold text-sm">
                        {product.stock}
                      </span>
                    </td>

                    {/* Actions (Edit / Delete) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/admin/products/edit/${product._id}`}
                          className="p-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition-all"
                          title="Edit Artifact"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting === product._id}
                          className="p-2 text-slate-400 hover:text-red-500 border border-slate-700 hover:border-red-500/50 rounded-md transition-all disabled:opacity-50"
                          title="Delete Artifact"
                        >
                          {isDeleting === product._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
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