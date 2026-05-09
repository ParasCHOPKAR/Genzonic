"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// 🔥 Added new icons for the Order tab
import { Package, Heart, Settings, LogOut, Truck, FileText, ExternalLink } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext"; 

export default function ProfilePage() {
  const { data: session } = useSession();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("saved");

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="profile-sidebar">
          {/* User ID Card */}
          <div className="user-card">
            <div className="brand-badge">GENZONIC</div>
            <h2 className="user-title">GENZONIC VIP</h2>
            <p className="user-email">{session?.user?.email || "GUEST_USER@SYS.COM"}</p>
          </div>

          {/* Navigation Menu */}
          <nav className="profile-nav">
            <button 
              className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} /> ORDER ARCHIVE
            </button>
            <button 
              className={`nav-btn ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <Heart size={18} /> SAVED STYLES <span className="count-badge">{wishlist.length}</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={18} /> ACCOUNT SETTINGS
            </button>
            
            <div className="divider"></div>
            
            <button className="nav-btn signout-btn" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut size={18} /> SIGN OUT
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="profile-content">
          
          {/* ================= SAVED TAB ================= */}
          {activeTab === "saved" && (
            <div className="tab-section">
              <h1 className="section-title">SAVED STYLES</h1>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <p>YOUR VAULT IS EMPTY.</p>
                  <Link href="/shop/men" className="explore-btn">EXPLORE ARCHIVE</Link>
                </div>
              ) : (
                <div className="saved-grid">
                  {wishlist.map((item) => (
                    <div key={item.id} className="mini-product-card">
                      <div className="image-box">
                         <Image src={item.image} alt={item.name} fill style={{objectFit: "cover"}} />
                      </div>
                      <div className="info-box">
                        <h3>{item.name}</h3>
                        <p>₹{item.price}</p>
                        <Link href={`/cart`} className="add-btn">VIEW IN VAULT</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="tab-section">
              <h1 className="section-title">ORDER ARCHIVE</h1>
              
              <div className="orders-list">
                {/* START OF ORDER CARD (You will eventually wrap this in a .map() function) */}
                <div className="order-card">
                  <div className="order-header">
                    <div className="order-meta">
                      <span className="order-id">ID: #GZ-88902-X</span>
                      <span className="order-date">Placed: May 04, 2026</span>
                    </div>
                    {/* Status Badge: Change class to 'status-processing' or 'status-delivered' based on DB */}
                    <div className="status-badge status-delivered">
                      <Truck size={14} /> DELIVERED
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-items-preview">
                      <div className="mini-item">
                        <div className="mini-item-img">
                          <Image src="/fallback.png" alt="Shirt" fill style={{objectFit: "cover"}} />
                        </div>
                        <div className="mini-item-info">
                          <h4>GENZONIC TSHIRT TESTING 2</h4>
                          <p>Size: M | Qty: 1</p>
                        </div>
                        <div className="mini-item-price">₹399</div>
                      </div>
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="payment-info">
                      <span className="label">TOTAL PAID:</span>
                      <span className="amount">₹399</span>
                      <span className="method">(PAID VIA UPI)</span>
                    </div>
                    <div className="order-actions">
                      <Link href={`/invoice/GZ-88902-X`} className="action-btn outline">
                        <FileText size={14} /> INVOICE
                      </Link>
                      <button className="action-btn solid">
                        TRACKING <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* END OF ORDER CARD */}
              </div>

            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === "settings" && (
            <div className="tab-section">
              <h1 className="section-title">SYSTEM SETTINGS</h1>
              <div className="empty-state">
                <p>ACCOUNT CONFIGURATION LOCKED.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        /* PROFILE BASE */
        .profile-wrapper { 
          padding: 220px 5% 100px; 
          background: var(--bg); 
          color: var(--text); 
          min-height: 100vh; 
        }

        .profile-container { 
          max-width: 1400px; 
          margin: 0 auto; 
          display: grid; 
          grid-template-columns: 300px 1fr; 
          gap: 50px; 
          align-items: start;
        }

        /* SIDEBAR STYLING */
        .user-card { 
          background: #0a0a0a; 
          color: white; 
          padding: 40px 20px; 
          border-radius: 12px; 
          text-align: center; 
          margin-bottom: 30px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        :global(.dark) .user-card { background: #111; border: 1px solid rgba(255,255,255,0.05); }

        .brand-badge { font-size: 24px; font-weight: 900; font-style: italic; letter-spacing: -1px; margin-bottom: 15px; }
        .user-title { font-size: 16px; font-weight: 900; letter-spacing: 2px; margin: 0 0 5px 0; }
        .user-email { font-size: 12px; opacity: 0.6; margin: 0; word-break: break-all; }

        .profile-nav { display: flex; flex-direction: column; gap: 5px; }
        .nav-btn { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          width: 100%; 
          padding: 16px 20px; 
          background: transparent; 
          border: none; 
          color: var(--text); 
          font-weight: 800; 
          font-size: 13px; 
          letter-spacing: 1px; 
          cursor: pointer; 
          text-align: left; 
          border-radius: 8px; 
          transition: 0.2s;
        }
        .nav-btn:hover { background: rgba(128,128,128,0.1); }
        .nav-btn.active { background: var(--text); color: var(--bg); }
        
        .count-badge { margin-left: auto; background: rgba(128,128,128,0.2); padding: 2px 8px; border-radius: 10px; font-size: 11px; }
        .nav-btn.active .count-badge { background: var(--bg); color: var(--text); }
        
        .divider { height: 1px; background: rgba(128,128,128,0.2); margin: 15px 0; }
        .signout-btn { color: #ff3e00; }
        .signout-btn:hover { background: rgba(255, 62, 0, 0.1); color: #ff3e00; }

        /* CONTENT AREA */
        .section-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0 0 30px 0; border-bottom: 2px solid var(--text); padding-bottom: 15px;}
        
        .empty-state { padding: 60px 20px; text-align: center; background: rgba(128,128,128,0.02); border: 1px dashed rgba(128,128,128,0.2); border-radius: 8px; }
        .empty-state p { font-weight: 800; letter-spacing: 2px; font-size: 14px; opacity: 0.5; margin-bottom: 20px;}
        .explore-btn { display: inline-block; padding: 12px 24px; background: var(--text); color: var(--bg); font-weight: 900; font-size: 12px; letter-spacing: 2px; text-decoration: none; border-radius: 4px; }

        /* SAVED GRID */
        .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .mini-product-card { border: 1px solid rgba(128,128,128,0.2); border-radius: 8px; overflow: hidden; }
        .image-box { position: relative; width: 100%; aspect-ratio: 4/5; background: #f5f5f5; }
        .info-box { padding: 15px; }
        .info-box h3 { font-size: 12px; font-weight: 900; margin: 0 0 5px 0; }
        .info-box p { font-size: 14px; font-weight: 700; margin: 0 0 15px 0; opacity: 0.8; }
        .add-btn { display: block; text-align: center; padding: 10px; background: var(--text); color: var(--bg); font-size: 11px; font-weight: 900; text-decoration: none; border-radius: 4px; }

        /* ================= ORDER ARCHIVE STYLES ================= */
        .orders-list { display: flex; flex-direction: column; gap: 25px; }
        
        .order-card { 
          border: 1px solid rgba(128,128,128,0.2); 
          border-radius: 8px; 
          background: rgba(128,128,128,0.02);
          overflow: hidden;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px dashed rgba(128,128,128,0.2);
          background: rgba(128,128,128,0.03);
        }

        .order-meta { display: flex; flex-direction: column; gap: 5px; }
        .order-id { font-weight: 900; font-size: 16px; letter-spacing: 1px; }
        .order-date { font-size: 12px; font-weight: 700; opacity: 0.6; }

        /* Status Badges */
        .status-badge { 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          padding: 6px 12px; 
          border-radius: 4px; 
          font-size: 11px; 
          font-weight: 900; 
          letter-spacing: 1px; 
        }
        .status-processing { background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid rgba(255, 193, 7, 0.3); }
        .status-dispatched { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
        .status-delivered { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }

        .order-body { padding: 20px; }
        .mini-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .mini-item:last-child { margin-bottom: 0; }
        
        .mini-item-img { position: relative; width: 60px; height: 80px; background: #111; border-radius: 4px; overflow: hidden; }
        .mini-item-info { flex: 1; }
        .mini-item-info h4 { margin: 0 0 5px 0; font-size: 13px; font-weight: 900; text-transform: uppercase; }
        .mini-item-info p { margin: 0; font-size: 12px; font-weight: 700; opacity: 0.6; }
        .mini-item-price { font-weight: 900; font-size: 14px; }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-top: 1px dashed rgba(128,128,128,0.2);
        }

        .payment-info { display: flex; align-items: center; gap: 10px; }
        .payment-info .label { font-size: 11px; font-weight: 800; opacity: 0.6; letter-spacing: 1px; }
        .payment-info .amount { font-size: 18px; font-weight: 900; }
        .payment-info .method { font-size: 11px; font-weight: 700; opacity: 0.5; }

        .order-actions { display: flex; gap: 10px; }
        .action-btn { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          padding: 10px 16px; 
          font-size: 11px; 
          font-weight: 900; 
          letter-spacing: 1px; 
          border-radius: 4px; 
          cursor: pointer; 
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .action-btn.outline { background: transparent; border: 1px solid var(--text); color: var(--text); }
        .action-btn.outline:hover { background: var(--text); color: var(--bg); }
        
        .action-btn.solid { background: var(--text); border: 1px solid var(--text); color: var(--bg); }
        .action-btn.solid:hover { opacity: 0.8; transform: translateY(-2px); }

        /* MOBILE FIXES */
        @media (max-width: 900px) {
          .profile-container { grid-template-columns: 1fr; gap: 30px; }
          .profile-wrapper { padding: 180px 5% 80px; }
        }

        @media (max-width: 600px) {
          .order-header, .order-footer { flex-direction: column; align-items: flex-start; gap: 15px; }
          .order-actions { width: 100%; }
          .action-btn { width: 100%; justify-content: center; }
          .status-badge { align-self: flex-start; }
        }
      `}</style>
    </div>
  );
}