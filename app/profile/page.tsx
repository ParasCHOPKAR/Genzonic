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

  // 🔥 HELPER: Check if a date is within X days from today
  const isWithinDays = (dateString: string, daysLimit: number) => {
    if (!dateString) return false;
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysLimit;
  };

  // 🔥 ACTION HANDLERS (Connect these to your backend APIs)
  const handleOrderAction = async (orderId: string, action: "cancel" | "return" | "replace") => {
    const confirmMessage = 
      action === "cancel" ? "Are you sure you want to cancel this dispatch?" :
      action === "return" ? "Initiate return and refund process for this artifact?" :
      "Initiate replacement process for this artifact?";

    if (!window.confirm(confirmMessage)) return;

    try {
      // Example API call - Update this to match your actual backend route!
      const res = await fetch(`/api/orders/${orderId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Successfully requested: ${action.toUpperCase()}`);
        fetchOrders(); // Refresh the list to show updated status
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
            <div className="brand-badge">GENZONIC</div>
            <h2 className="user-title">VIP ACCESS</h2>
            <p className="user-email">{session?.user?.email || "GUEST_USER@SYS.COM"}</p>
            <div className="scan-line"></div>
          </div>

          <nav className="profile-nav">
            <button className={`nav-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              <Package size={18} /> ORDER ARCHIVE
            </button>
            <button className={`nav-btn ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
              <Heart size={18} /> SAVED STYLES <span className="count-badge">{wishlist.length}</span>
            </button>
            <button className={`nav-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
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
            <div className="tab-section fade-in">
              <h1 className="section-title">SAVED STYLES</h1>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <Heart size={40} className="empty-icon" />
                  <p>YOUR VAULT IS CURRENTLY EMPTY.</p>
                  <Link href="/shop/men" className="premium-btn">EXPLORE ARCHIVE</Link>
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
                        <Link href={`/cart`} className="premium-btn small">VIEW IN VAULT</Link>
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
              <h1 className="section-title">ORDER ARCHIVE</h1>
              
              {isLoadingOrders ? (
                <div className="empty-state">
                  <Loader2 className="spinner" size={40} />
                  <p>DECRYPTING SECURED ARTIFACTS...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={40} className="empty-icon" />
                  <p>NO PAST TRANSACTIONS DETECTED IN MAINFRAME.</p>
                  <Link href="/shop/men" className="premium-btn">BROWSE COLLECTION</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const statusStr = (order.status || "PROCESSING").toLowerCase();
                    // Fallback to createdAt if deliveredAt or updatedAt is missing
                    const timeReferenceDate = order.deliveredAt || order.updatedAt || order.createdAt;

                    return (
                      <div key={order._id || order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-meta">
                            <span className="order-id">MANIFEST ID: <span className="mono">{order.orderId || order._id}</span></span>
                            <span className="order-date">
                              AUTHORIZED: {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={`status-badge ${getStatusClass(statusStr)}`}>
                            <Truck size={14} /> {statusStr.toUpperCase()}
                          </div>
                        </div>

                        <div className="order-body">
                          <div className="order-items-preview">
                            {(order.items || order.products || []).map((item: any, index: number) => (
                              <div key={index} className="mini-item">
                                <div className="mini-item-img">
                                  <Image src={item.image || "/fallback.png"} alt={item.name || "Product"} fill style={{objectFit: "cover"}} />
                                </div>
                                <div className="mini-item-info">
                                  <h4>{item.name}</h4>
                                  <p>SIZE: {item.size || "M"} <span className="separator">|</span> QTY: {item.quantity || 1}</p>
                                </div>
                                <div className="mini-item-price">₹{item.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="order-footer">
                          <div className="payment-info">
                            <span className="label">TOTAL SECURED:</span>
                            <span className="amount">₹{order.total || order.totalPrice}</span>
                          </div>
                          
                          <div className="order-actions">
                            {/* Standard Buttons */}
                            <Link href={`/invoice/${order.orderId || order._id}`} className="premium-btn outline small">
                              <FileText size={14} /> INVOICE
                            </Link>
                            {order.trackingLink && (
                              <a href={order.trackingLink} target="_blank" rel="noreferrer" className="premium-btn highlight small">
                                TRACKING <ExternalLink size={14} />
                              </a>
                            )}

                            {/* 🔥 CONDITIONAL ACTIONS: Cancel, Return, Replace 🔥 */}
                            
                            {/* CANCEL: Only if status is "processing" */}
                            {statusStr === "processing" && (
                              <button onClick={() => handleOrderAction(order._id, "cancel")} className="premium-btn danger small">
                                <XCircle size={14} /> CANCEL ORDER
                              </button>
                            )}

                            {/* RETURN & REPLACE: Only if status is "delivered" */}
                            {statusStr === "delivered" && (
                              <>
                                {/* RETURN: Within 3 Days */}
                                {isWithinDays(timeReferenceDate, 3) && (
                                  <button onClick={() => handleOrderAction(order._id, "return")} className="premium-btn warning small">
                                    <RotateCcw size={14} /> RETURN
                                  </button>
                                )}
                                
                                {/* REPLACE: Within 7 Days */}
                                {isWithinDays(timeReferenceDate, 7) && (
                                  <button onClick={() => handleOrderAction(order._id, "replace")} className="premium-btn warning small">
                                    <RefreshCw size={14} /> REPLACE
                                  </button>
                                )}
                              </>
                            )}

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
              <h1 className="section-title">SYSTEM SETTINGS</h1>
              <div className="empty-state">
                <Settings size={40} className="empty-icon" />
                <p>ACCOUNT CONFIGURATION CURRENTLY LOCKED.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        /* PROFILE BASE */
        .profile-wrapper { padding: 220px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; font-family: 'Inter', sans-serif; }
        .profile-container { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 280px 1fr; gap: 60px; align-items: start;}
        .mono { font-family: monospace; letter-spacing: 0px; }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* VIP SIDEBAR STYLING */
        .user-card { position: relative; background: #000; color: white; padding: 40px 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        :global(.dark) .user-card { background: #111; border: 1px solid rgba(255,255,255,0.1); }
        .brand-badge { font-size: 22px; font-weight: 900; font-style: italic; letter-spacing: -1px; margin-bottom: 15px; color: #fff; }
        .user-title { font-size: 14px; font-weight: 900; letter-spacing: 4px; margin: 0 0 8px 0; color: #ff3e00; }
        .user-email { font-size: 11px; opacity: 0.5; margin: 0; word-break: break-all; font-family: monospace; }
        .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255, 62, 0, 0.5); opacity: 0.5; animation: scan 3s infinite linear; }
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

        /* NAVIGATION BAR */
        .profile-nav { display: flex; flex-direction: column; gap: 8px; }
        .nav-btn { display: flex; align-items: center; gap: 15px; width: 100%; padding: 16px 20px; background: transparent; border: 2px solid transparent; color: var(--text); font-weight: 800; font-size: 12px; letter-spacing: 1px; cursor: pointer; text-align: left; border-radius: 6px; transition: all 0.3s ease; }
        .nav-btn:hover { background: rgba(128,128,128,0.05); transform: translateX(4px); }
        .nav-btn.active { background: var(--text); color: var(--bg); box-shadow: 4px 4px 0px rgba(128,128,128,0.2); transform: translateX(4px); }
        .count-badge { margin-left: auto; background: rgba(128,128,128,0.2); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 900;}
        .nav-btn.active .count-badge { background: var(--bg); color: var(--text); }
        .divider { height: 1px; background: rgba(128,128,128,0.2); margin: 10px 0; }
        .signout-btn { color: #ff3e00; }
        .signout-btn:hover { background: rgba(255, 62, 0, 0.05); color: #ff3e00; border-color: rgba(255, 62, 0, 0.2); }

        /* CONTENT AREA */
        .section-title { font-size: 36px; font-weight: 900; letter-spacing: -1.5px; margin: 0 0 40px 0; border-bottom: 3px solid var(--text); padding-bottom: 15px;}
        .empty-state { padding: 80px 20px; text-align: center; background: rgba(128,128,128,0.02); border: 2px dashed rgba(128,128,128,0.2); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center;}
        .empty-icon { color: rgba(128,128,128,0.3); margin-bottom: 20px; }
        .empty-state p { font-weight: 800; letter-spacing: 2px; font-size: 12px; opacity: 0.5; margin-bottom: 30px;}

        /* BUTTON STYLES */
        .premium-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; background: var(--text); color: var(--bg); font-weight: 900; font-size: 12px; letter-spacing: 2px; text-decoration: none; border: 2px solid var(--text); border-radius: 4px; cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 4px 4px 0px rgba(128,128,128,0.2); }
        .premium-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px rgba(128,128,128,0.3); }
        .premium-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px transparent; }
        .premium-btn.small { padding: 10px 16px; font-size: 11px; }
        .premium-btn.outline { background: transparent; color: var(--text); }
        .premium-btn.outline:hover { background: var(--text); color: var(--bg); }
        .premium-btn.highlight { background: #22c55e; border-color: #22c55e; color: #fff; box-shadow: 4px 4px 0px rgba(34, 197, 94, 0.3); }
        .premium-btn.highlight:hover { background: #16a34a; box-shadow: 6px 6px 0px rgba(34, 197, 94, 0.4); }

        /* 🔥 NEW DANGER & WARNING BUTTONS 🔥 */
        .premium-btn.danger { background: transparent; border-color: #ef4444; color: #ef4444; box-shadow: 4px 4px 0px rgba(239, 68, 68, 0.1); }
        .premium-btn.danger:hover { background: #ef4444; color: #fff; box-shadow: 6px 6px 0px rgba(239, 68, 68, 0.3); }
        .premium-btn.warning { background: transparent; border-color: #f59e0b; color: #f59e0b; box-shadow: 4px 4px 0px rgba(245, 158, 11, 0.1); }
        .premium-btn.warning:hover { background: #f59e0b; color: #fff; box-shadow: 6px 6px 0px rgba(245, 158, 11, 0.3); }

        /* SAVED GRID */
        .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; }
        .mini-product-card { border: 2px solid rgba(128,128,128,0.1); border-radius: 6px; overflow: hidden; transition: 0.3s; background: rgba(128,128,128,0.02);}
        .mini-product-card:hover { border-color: var(--text); transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .image-box { position: relative; width: 100%; aspect-ratio: 4/5; background: rgba(128,128,128,0.05); }
        .info-box { padding: 20px; display: flex; flex-direction: column; gap: 10px;}
        .info-box h3 { font-size: 13px; font-weight: 900; margin: 0; line-height: 1.3; text-transform: uppercase;}
        .info-box p { font-size: 15px; font-weight: 800; margin: 0; }
        .info-box .premium-btn { width: 100%; margin-top: 10px; }

        /* ================= ORDER ARCHIVE STYLES ================= */
        .orders-list { display: flex; flex-direction: column; gap: 30px; }
        .order-card { border: 2px solid rgba(128,128,128,0.15); border-radius: 8px; background: rgba(128,128,128,0.01); overflow: hidden; transition: 0.3s;}
        .order-card:hover { border-color: rgba(128,128,128,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        
        .order-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; border-bottom: 2px solid rgba(128,128,128,0.1); background: rgba(128,128,128,0.03); }
        .order-meta { display: flex; flex-direction: column; gap: 6px; }
        .order-id { font-weight: 900; font-size: 13px; letter-spacing: 1px; color: #888;}
        .order-id .mono { color: var(--text); font-size: 15px;}
        .order-date { font-size: 11px; font-weight: 800; letter-spacing: 1px; opacity: 0.6; }

        /* Status Badges */
        .status-badge { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 4px; font-size: 11px; font-weight: 900; letter-spacing: 1px; }
        .status-processing { background: rgba(255, 193, 7, 0.1); color: #d97706; border: 1px solid rgba(255, 193, 7, 0.3); }
        :global(.dark) .status-processing { color: #ffc107; }
        .status-dispatched { background: rgba(59, 130, 246, 0.1); color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.3); }
        :global(.dark) .status-dispatched { color: #3b82f6; }
        .status-delivered { background: rgba(34, 197, 94, 0.1); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.3); }
        :global(.dark) .status-delivered { color: #22c55e; }
        .status-cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }

        .order-body { padding: 25px; }
        .mini-item { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
        .mini-item:last-child { margin-bottom: 0; }
        .mini-item-img { position: relative; width: 70px; height: 90px; background: rgba(128,128,128,0.1); border-radius: 4px; overflow: hidden; }
        .mini-item-info { flex: 1; }
        .mini-item-info h4 { margin: 0 0 8px 0; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;}
        .mini-item-info p { margin: 0; font-size: 11px; font-weight: 800; color: #888; letter-spacing: 1px;}
        .separator { margin: 0 8px; opacity: 0.3; }
        .mini-item-price { font-weight: 900; font-size: 16px; }

        .order-footer { display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; border-top: 2px solid rgba(128,128,128,0.1); background: rgba(128,128,128,0.01);}
        .payment-info { display: flex; align-items: center; gap: 12px; }
        .payment-info .label { font-size: 11px; font-weight: 800; color: #888; letter-spacing: 1px; }
        .payment-info .amount { font-size: 20px; font-weight: 900; }

        .order-actions { display: flex; flex-wrap: wrap; gap: 15px; }

        .spinner { animation: spin 1s linear infinite; margin: 0 auto 20px; color: var(--text);}
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* MOBILE FIXES */
        @media (max-width: 900px) {
          .profile-container { grid-template-columns: 1fr; gap: 40px; }
          .profile-wrapper { padding: 180px 5% 80px; }
          .nav-btn { justify-content: center; text-align: center; }
          .nav-btn:hover, .nav-btn.active { transform: translateY(-4px) translateX(0); }
        }

        @media (max-width: 600px) {
          .order-header, .order-footer { flex-direction: column; align-items: flex-start; gap: 20px; }
          .order-actions { width: 100%; flex-direction: column; gap: 10px;}
          .premium-btn { width: 100%; }
          .status-badge { align-self: flex-start; }
          .mini-item { align-items: flex-start; }
          .mini-item-price { margin-top: 5px; }
        }
      `}</style>
    </div>
  );
}