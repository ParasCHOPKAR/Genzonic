"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Package, Heart, Settings, LogOut, Truck, FileText, 
  ExternalLink, Loader2, XCircle, RefreshCw, RotateCcw 
} from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext"; 

export default function ProfilePage() {
  const { data: session } = useSession();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch Orders
  const fetchOrders = () => {
    if (session?.user?.email) {
      setIsLoadingOrders(true);
      fetch(`/api/orders?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.orders) {
            setOrders(data.orders);
          } else if (Array.isArray(data)) {
            setOrders(data);
          }
        })
        .catch((err) => console.error("Error fetching orders:", err))
        .finally(() => setIsLoadingOrders(false));
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, session?.user?.email]);

  const getStatusClass = (status: string) => {
    const s = (status || "processing").toLowerCase();
    if (s === "delivered") return "status-delivered";
    if (s === "dispatched" || s === "shipped") return "status-dispatched";
    if (s === "cancelled") return "status-cancelled";
    return "status-processing";
  };

  // 🔥 HELPER: Format dates to look professional
  const formatDate = (dateString: string) => {
    if (!dateString) return "Processing";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  // 🔥 HELPER: Check if a date is within X days from today
  const isWithinDays = (dateString: string, daysLimit: number) => {
    if (!dateString) return false;
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysLimit;
  };

  // 🔥 ACTION HANDLERS
  const handleOrderAction = async (orderId: string, action: "cancel" | "return" | "replace") => {
    const confirmMessage = 
      action === "cancel" ? "Are you sure you want to cancel this dispatch?" :
      action === "return" ? "Initiate return and refund process for this artifact?" :
      "Initiate replacement process for this artifact?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Successfully requested: ${action}`);
        fetchOrders(); 
      } else {
        alert(data.message || "Failed to process request. Contact Support.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="brand-badge">GenZonic</div>
            <h2 className="user-title">VIP Access</h2>
            <p className="user-email">{session?.user?.email || "guest@sys.com"}</p>
            <div className="scan-line"></div>
          </div>

          <nav className="profile-nav">
            <button className={`nav-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              <Package size={18} /> Order Archive
            </button>
            <button className={`nav-btn ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
              <Heart size={18} /> Saved Styles <span className="count-badge">{wishlist.length}</span>
            </button>
            <button className={`nav-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
              <Settings size={18} /> Account Settings
            </button>
            <div className="divider"></div>
            <button className="nav-btn signout-btn" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="profile-content">
          
          {/* ================= SAVED TAB ================= */}
          {activeTab === "saved" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">Saved Styles</h1>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <Heart size={40} className="empty-icon" />
                  <p>Your vault is currently empty.</p>
                  <Link href="/shop/men" className="premium-btn">Explore Archive</Link>
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
                        <Link href={`/cart`} className="premium-btn small">View in Vault</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">Order Archive</h1>
              
              {isLoadingOrders ? (
                <div className="empty-state">
                  <Loader2 className="spinner" size={40} />
                  <p>Decrypting secured artifacts...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={40} className="empty-icon" />
                  <p>No past transactions detected.</p>
                  <Link href="/shop/men" className="premium-btn">Browse Collection</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const statusStr = (order.status || "Processing").toLowerCase();
                    const timeReferenceDate = order.deliveredAt || order.updatedAt || order.createdAt;

                    return (
                      <div key={order._id || order.id} className="order-card">
                        
                        {/* HEADER */}
                        <div className="order-header">
                          <div className="order-meta">
                            <span className="order-id">
                              Manifest ID: <span className="mono">{order.manifestId || order.shortId || order.rzpOrderId || order._id?.slice(-8).toUpperCase() || order._id}</span>
                            </span>
                            <span className="order-date">
                              Authorized: {formatDate(order.createdAt || Date.now().toString())}
                            </span>
                          </div>
                          <div className={`status-badge ${getStatusClass(statusStr)}`}>
                            <Truck size={14} /> {statusStr.charAt(0).toUpperCase() + statusStr.slice(1)}
                          </div>
                        </div>

                        {/* BODY: SPLIT LAYOUT */}
                        <div className="order-body">
                          
                          {/* LEFT: Items */}
                          <div className="order-items-preview">
                            {(order.items || order.orderItems || order.products || []).map((item: any, index: number) => (
                              <div key={index} className="mini-item">
                                <div className="mini-item-img">
                                  <Image src={item.image || "/fallback.png"} alt={item.name || "Product"} fill style={{objectFit: "cover"}} />
                                </div>
                                <div className="mini-item-info">
                                  <h4>{item.name}</h4>
                                  <p>Size: {item.size || "M"} <span className="separator">|</span> Qty: {item.quantity || 1}</p>
                                </div>
                                <div className="mini-item-price">₹{item.price}</div>
                              </div>
                            ))}
                          </div>

                          {/* RIGHT: Summary & Actions */}
                          <div className="order-summary-panel">
                            <div className="payment-info">
                              <span className="label">Total Secured</span>
                              {/* 🔥 FIX: Added totalAmount to the fallback chain so the price renders 🔥 */}
                              <span className="amount">₹{order.totalAmount || order.total || order.totalPrice || 0}</span>
                            </div>
                            
                            <div className="order-actions">
                              <Link href={`/invoice/${order.orderId || order._id}`} className="premium-btn outline small">
                                <FileText size={14} /> Invoice
                              </Link>
                              
                              {order.trackingLink && (
                                <a href={order.trackingLink} target="_blank" rel="noreferrer" className="premium-btn highlight small">
                                  Track <ExternalLink size={14} />
                                </a>
                              )}

                              {statusStr === "processing" && (
                                <button onClick={() => handleOrderAction(order._id, "cancel")} className="premium-btn danger small">
                                  <XCircle size={14} /> Cancel
                                </button>
                              )}

                              {statusStr === "delivered" && (
                                <>
                                  {isWithinDays(timeReferenceDate, 3) && (
                                    <button onClick={() => handleOrderAction(order._id, "return")} className="premium-btn warning small">
                                      <RotateCcw size={14} /> Return
                                    </button>
                                  )}
                                  {isWithinDays(timeReferenceDate, 7) && (
                                    <button onClick={() => handleOrderAction(order._id, "replace")} className="premium-btn warning small">
                                      <RefreshCw size={14} /> Replace
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === "settings" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">Account Settings</h1>
              <div className="empty-state">
                <Settings size={40} className="empty-icon" />
                <p>Account configuration currently locked.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        /* PROFILE BASE */
        .profile-wrapper { padding: 180px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; font-family: 'Inter', sans-serif; }
        .profile-container { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 280px 1fr; gap: 50px; align-items: start;}
        .mono { font-family: monospace; letter-spacing: 0.5px; }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* VIP SIDEBAR STYLING - Upgraded Cyber Glassmorphism */
        .user-card { 
          position: relative; 
          background: linear-gradient(135deg, #111 0%, #000 100%); 
          color: white; padding: 40px 20px; border-radius: 12px; 
          text-align: center; margin-bottom: 30px; overflow: hidden; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.15); 
          border: 1px solid rgba(128,128,128,0.15);
        }
        :global(.dark) .user-card { background: linear-gradient(135deg, #1a1a1a 0%, #050505 100%); }
        .brand-badge { font-size: 20px; font-weight: 900; font-style: italic; letter-spacing: -0.5px; margin-bottom: 12px; color: #fff; }
        .user-title { font-size: 13px; font-weight: 800; letter-spacing: 3px; margin: 0 0 8px 0; color: #ffc107; text-transform: uppercase; }
        .user-email { font-size: 12px; opacity: 0.6; margin: 0; word-break: break-all; font-family: monospace; }
        .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: rgba(255, 193, 7, 0.4); box-shadow: 0 0 10px rgba(255, 193, 7, 0.8); opacity: 0.5; animation: scan 3s infinite linear; }
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

        /* NAVIGATION BAR */
        .profile-nav { display: flex; flex-direction: column; gap: 6px; }
        .nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 18px; background: transparent; border: none; color: var(--text); font-weight: 700; font-size: 14px; cursor: pointer; text-align: left; border-radius: 8px; transition: all 0.2s ease; opacity: 0.7;}
        .nav-btn:hover { background: rgba(128,128,128,0.05); opacity: 1; }
        .nav-btn.active { background: rgba(128,128,128,0.08); color: var(--text); opacity: 1; font-weight: 800; border-left: 3px solid var(--text); border-radius: 4px 8px 8px 4px; }
        .count-badge { margin-left: auto; background: rgba(128,128,128,0.15); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 900;}
        .divider { height: 1px; background: rgba(128,128,128,0.1); margin: 15px 0; }
        .signout-btn { color: #ef4444; opacity: 0.9; }
        .signout-btn:hover { background: rgba(239, 68, 68, 0.05); color: #ef4444; opacity: 1; }

        /* CONTENT AREA */
        .section-title { font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0 0 30px 0; border-bottom: 1px solid rgba(128,128,128,0.15); padding-bottom: 15px;}
        .empty-state { padding: 80px 20px; text-align: center; background: rgba(128,128,128,0.02); border: 1px dashed rgba(128,128,128,0.2); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;}
        .empty-icon { color: rgba(128,128,128,0.3); margin-bottom: 20px; }
        .empty-state p { font-weight: 700; font-size: 14px; opacity: 0.6; margin-bottom: 30px;}

        /* PREMIUM BUTTON STYLES */
        .premium-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; background: var(--text); color: var(--bg); font-weight: 800; font-size: 13px; text-decoration: none; border: 1px solid var(--text); border-radius: 6px; cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .premium-btn:active { transform: translateY(0); box-shadow: none; }
        .premium-btn.small { padding: 10px 14px; font-size: 12px; width: 100%; }
        .premium-btn.outline { background: transparent; color: var(--text); border-color: rgba(128,128,128,0.3); }
        .premium-btn.outline:hover { border-color: var(--text); background: rgba(128,128,128,0.05); }
        .premium-btn.highlight { background: #22c55e; border-color: #22c55e; color: #fff; }
        .premium-btn.highlight:hover { background: #16a34a; }

        .premium-btn.danger { background: transparent; border-color: #ef4444; color: #ef4444; }
        .premium-btn.danger:hover { background: #ef4444; color: #fff; }
        .premium-btn.warning { background: transparent; border-color: #f59e0b; color: #f59e0b; }
        .premium-btn.warning:hover { background: #f59e0b; color: #fff; }

        /* SAVED GRID */
        .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        .mini-product-card { border: 1px solid rgba(128,128,128,0.1); border-radius: 8px; overflow: hidden; transition: 0.3s; background: rgba(128,128,128,0.01);}
        .mini-product-card:hover { border-color: rgba(128,128,128,0.3); transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .image-box { position: relative; width: 100%; aspect-ratio: 4/5; background: rgba(128,128,128,0.05); }
        .info-box { padding: 15px; display: flex; flex-direction: column; gap: 8px;}
        .info-box h3 { font-size: 13px; font-weight: 800; margin: 0; line-height: 1.3;}
        .info-box p { font-size: 14px; font-weight: 700; margin: 0; opacity: 0.8;}
        .info-box .premium-btn { margin-top: 10px; }

        /* ================= REDESIGNED ORDER ARCHIVE ================= */
        .orders-list { display: flex; flex-direction: column; gap: 25px; }
        .order-card { border: 1px solid rgba(128,128,128,0.15); border-radius: 12px; background: rgba(128,128,128,0.02); overflow: hidden; transition: 0.3s;}
        .order-card:hover { border-color: rgba(128,128,128,0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.04); }
        
        .order-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 25px; border-bottom: 1px solid rgba(128,128,128,0.1); background: rgba(128,128,128,0.03); }
        .order-meta { display: flex; flex-direction: column; gap: 4px; }
        .order-id { font-weight: 700; font-size: 12px; color: #888;}
        .order-id .mono { color: var(--text); font-size: 14px; font-weight: 800; margin-left: 5px;}
        .order-date { font-size: 12px; font-weight: 600; opacity: 0.6; }

        /* Clean Status Badges */
        .status-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .status-processing { background: rgba(245, 158, 11, 0.1); color: #d97706; }
        :global(.dark) .status-processing { color: #fbbf24; }
        .status-dispatched { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
        :global(.dark) .status-dispatched { color: #60a5fa; }
        .status-delivered { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
        :global(.dark) .status-delivered { color: #4ade80; }
        .status-cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .order-body { display: grid; grid-template-columns: 2fr 1fr; }
        
        /* Items List (Left) */
        .order-items-preview { padding: 25px; display: flex; flex-direction: column; gap: 20px; border-right: 1px solid rgba(128,128,128,0.1); }
        .mini-item { display: flex; align-items: center; gap: 15px; }
        .mini-item-img { position: relative; width: 60px; height: 80px; background: rgba(128,128,128,0.1); border-radius: 6px; overflow: hidden; }
        .mini-item-info { flex: 1; }
        .mini-item-info h4 { margin: 0 0 6px 0; font-size: 13px; font-weight: 800; line-height: 1.3;}
        .mini-item-info p { margin: 0; font-size: 12px; font-weight: 600; color: #888; }
        .separator { margin: 0 8px; opacity: 0.3; }
        .mini-item-price { font-weight: 800; font-size: 14px; }

        /* Summary Panel (Right) */
        .order-summary-panel { padding: 25px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; background: rgba(128,128,128,0.01); }
        .payment-info { display: flex; flex-direction: column; gap: 5px; }
        .payment-info .label { font-size: 12px; font-weight: 700; color: #888; }
        .payment-info .amount { font-size: 24px; font-weight: 900; }
        .order-actions { display: flex; flex-direction: column; gap: 10px; }

        .spinner { animation: spin 1s linear infinite; margin: 0 auto 20px; color: var(--text);}
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* MOBILE FIXES */
        @media (max-width: 900px) {
          .profile-container { grid-template-columns: 1fr; gap: 30px; }
          .profile-wrapper { padding: 140px 5% 60px; }
          .profile-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; border-bottom: 1px solid rgba(128,128,128,0.1); }
          .profile-nav::-webkit-scrollbar { display: none; }
          .nav-btn { width: auto; white-space: nowrap; border-left: none; border-radius: 6px; padding: 10px 16px; }
          .nav-btn.active { border-bottom: 2px solid var(--text); border-radius: 6px 6px 0 0; }
          .divider { display: none; }
          
          .order-body { grid-template-columns: 1fr; }
          .order-items-preview { border-right: none; border-bottom: 1px solid rgba(128,128,128,0.1); padding: 20px; }
          .order-summary-panel { padding: 20px; flex-direction: row; align-items: flex-end; }
          .payment-info .amount { font-size: 20px; }
        }

        @media (max-width: 600px) {
          .order-header { flex-direction: column; align-items: flex-start; gap: 15px; }
          .order-summary-panel { flex-direction: column; align-items: flex-start; }
          .order-actions { width: 100%; }
        }
      `}</style>
    </div>
  );
}