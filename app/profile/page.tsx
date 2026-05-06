"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useWishlist } from "@/app/context/WishlistContext";
import ProductCard from "@/components/Product/ProductCard";
import Link from "next/link";
import { Heart, Package, LogOut, Settings } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { wishlist } = useWishlist();
  
  // State to manage which tab is currently visible in the main content area
  const [activeTab, setActiveTab] = useState("SAVED_STYLES");

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-2xl font-black uppercase tracking-widest animate-pulse text-black dark:text-white">
          Loading Vault...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (Not Logged In)
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white dark:bg-black">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter text-black dark:text-white">Access Denied</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          You must be logged into your GenZonic account to view your profile and access your saved vault.
        </p>
        <Link 
          href="/login" 
          className="bg-black text-white dark:bg-white dark:text-black px-10 py-4 font-bold uppercase rounded-md hover:scale-105 transition-transform"
        >
          Sign In / Authorize
        </Link>
      </div>
    );
  }

  // 3. Main Profile View (Sidebar + Content Layout)
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen flex flex-col md:flex-row gap-10">
      
      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-8">
        
        {/* User Identity Card */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black text-4xl font-black mb-4">
            {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "V"}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
            {session.user?.name || "VIP Member"}
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">{session.user?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("ORDER_ARCHIVE")}
            className={`flex items-center gap-3 px-5 py-4 font-bold uppercase rounded-xl transition-all ${
              activeTab === "ORDER_ARCHIVE" 
              ? "bg-black text-white dark:bg-white dark:text-black" 
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white"
            }`}
          >
            <Package size={20} strokeWidth={2.5} /> 
            Order Archive
          </button>

          <button 
            onClick={() => setActiveTab("SAVED_STYLES")}
            className={`flex items-center gap-3 px-5 py-4 font-bold uppercase rounded-xl transition-all ${
              activeTab === "SAVED_STYLES" 
              ? "bg-black text-white dark:bg-white dark:text-black" 
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white"
            }`}
          >
            <Heart size={20} strokeWidth={2.5} /> 
            Saved Styles
            <span className="ml-auto bg-gray-200 dark:bg-gray-800 text-xs px-2 py-1 rounded-full text-black dark:text-white">
              {wishlist.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab("ACCOUNT_SETTINGS")}
            className={`flex items-center gap-3 px-5 py-4 font-bold uppercase rounded-xl transition-all ${
              activeTab === "ACCOUNT_SETTINGS" 
              ? "bg-black text-white dark:bg-white dark:text-black" 
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white"
            }`}
          >
            <Settings size={20} strokeWidth={2.5} /> 
            Account Settings
          </button>

          <div className="pt-6 mt-2 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-5 py-4 font-bold uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
            >
              <LogOut size={20} strokeWidth={2.5} />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1">
        
        {/* --- TAB 1: SAVED STYLES (WISHLIST) --- */}
        {activeTab === "SAVED_STYLES" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
              Your Cyber-Vault
            </h2>
            
            {wishlist.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                <Heart size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">Vault is Empty</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                  You haven't added any premium streetwear to your wishlist yet. Explore the collection and click the heart to save your favorites.
                </p>
                <Link 
                  href="/shop/men" 
                  className="inline-block bg-black text-white dark:bg-white dark:text-black px-10 py-4 font-bold uppercase rounded-md hover:bg-[#f58220] dark:hover:bg-[#f58220] dark:hover:text-white transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: ORDER ARCHIVE --- */}
        {activeTab === "ORDER_ARCHIVE" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
              Order Archive
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-16 text-center">
               <Package size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
               <p className="text-gray-500">Your order history will appear here. (Component coming soon)</p>
            </div>
          </div>
        )}

        {/* --- TAB 3: ACCOUNT SETTINGS --- */}
        {activeTab === "ACCOUNT_SETTINGS" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
              Account Settings
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-16 text-center">
               <Settings size={56} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
               <p className="text-gray-500">Profile configuration and addresses will appear here. (Component coming soon)</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}