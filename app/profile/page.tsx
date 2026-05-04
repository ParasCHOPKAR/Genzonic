"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// 🔥 Added RotateCcw for the Return button
import { Package, User, LogOut, Loader2, ArrowRight, Download, RefreshCw, XCircle, RotateCcw } from "lucide-react"; 

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ORDERS");

  // Fetch orders from the database using the logged-in user's email
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/orders?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching vault data:", err);
          setIsLoading(false);
        });
    }
  }, [status, session, router]);

  // Helper to format MongoDB dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
  };

  // 🔥 NEW: Helper to check if the order is within the 5-day window 🔥
  // We use updatedAt (when you marked it delivered) or fallback to createdAt
  const isWithinReturnWindow = (dateString: string) => {
    if (!dateString) return false;
    const deliveryDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    return (now - deliveryDate) <= fiveDaysInMs;
  };

  // Function to handle Order Cancellation with Fee Alert
  const handleCancelOrder = async (orderId: string) => {
    const confirmMessage = "ALERT: You will get your payment back on your account excluding the payment gateway fees (2% processing fee + 18% GST on that 2%).\n\nExample: If your payment was ₹1000, you will get ₹976.40 refunded.\n\nAre you sure you want to cancel this order?";
    
    const confirmCancel = window.confirm(confirmMessage);
    if (!confirmCancel) return;

    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        ));
      } else {
        alert("Error cancelling order: " + data.message);
      }
    } catch (error) {
      console.error("Cancel Request Failed", error);
      alert("Network error. Please try again.");
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="vault-loading">
        <Loader2 className="spinner" size={32} />
        <span>DECRYPTING VAULT...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="empty-profile">
        <h2>ACCESS RESTRICTED</h2>
        <p>You must be authenticated to view this sector.</p>
        <Link href="/login" className="login-btn">AUTHORIZE NOW</Link>
      </div>
    );
  }

  return (
    <div className="vault-page">
      <div className="vault-container">
        
        {/* HEADER */}
        <div className="vault-header">
          <div className="user-profile-info">
            <div className="avatar">{session.user?.name?.charAt(0).toUpperCase() || "G"}</div>
            <div className="user-text">
              <span className="label">AUTHORIZED USER</span>
              <h1 className="title">{session.user?.name || "VIP CLIENT"}</h1>
              <p className="email-tag">{session.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* SIDEBAR */}
          <div className="sidebar">
            <button className={activeTab === "ORDERS" ? "active" : ""} onClick={() => setActiveTab("ORDERS")}>
              <Package size={16}/> ORDER ARCHIVE
            </button>
            <button className={activeTab === "SETTINGS" ? "active" : ""} onClick={() => setActiveTab("SETTINGS")}>
              <User size={16}/> ACCOUNT SETTINGS
            </button>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="logout">
              <LogOut size={16}/> TERMINATE SESSION
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="content">
            {activeTab === "ORDERS" && (
              <div className="orders-section">
                <h2 className="section-title">ACQUIRED ARTIFACTS // ORDER HISTORY</h2>

                {orders.length === 0 ? (
                  <div className="empty-vault">
                    <Package size={48} strokeWidth={1} />
                    <h3>YOUR VAULT IS EMPTY</h3>
                    <p>No verified transactions found for this sector.</p>
                    <Link href="/shop/men" className="shop-link">
                      EXPLORE ARCHIVE <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order: any) => {
                      
                      // Check if this specific order is within the 5 day window
                      const canReturn = isWithinReturnWindow(order.updatedAt || order.createdAt);
                      const isDelivered = order.status?.toLowerCase() === 'delivered';

                      return (
                        <div key={order._id} className="order-card">
                          
                          {/* Order Meta Data */}
                          <div className="order-top">
                            <div className="order-id-block">
                              <span className="order-label">MANIFEST ID</span>
                              <span className="order-id">{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            
                            <div className="order-meta-grid">
                              <div className="meta-item">
                                <span className="meta-label">DATE</span>
                                <span className="meta-value">{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-label">TOTAL</span>
                                <span className="meta-value">₹{order.totalAmount}</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-label">STATUS</span>
                                <span className={`status-badge ${(order.status || 'Processing').toLowerCase()}`}>
                                  {(order.status || 'PROCESSING').toUpperCase()}
                                </span>
                                
                                {/* INVOICE DOWNLOAD BUTTON */}
                                <a 
                                  href={`/invoice/${order._id}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="invoice-btn"
                                >
                                  <Download size={12} strokeWidth={3} /> INVOICE
                                </a>

                                {/* 🔥 TIME-LIMITED RETURN & REPLACE LOGIC 🔥 */}
                                {isDelivered && canReturn && (
                                  <>
                                    <a 
                                      href={`https://wa.me/919823919814?text=Hello%20GenZonic%20Team%2C%0A%0AI%20would%20like%20to%20request%20a%20replacement.%0A%0A%2A%2AManifest%20ID%3A%2A%2A%20${order._id.slice(-8).toUpperCase()}%0A%2A%2AReason%3A%2A%2A%20`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="action-link-btn"
                                    >
                                      <RefreshCw size={12} strokeWidth={3} /> REQUEST REPLACE
                                    </a>

                                    <a 
                                      href={`https://wa.me/919823919814?text=Hello%20GenZonic%20Team%2C%0A%0AI%20would%20like%20to%20request%20a%20RETURN%20for%20a%20refund.%0A%0A%2A%2AManifest%20ID%3A%2A%2A%20${order._id.slice(-8).toUpperCase()}%0A%2A%2AReason%3A%2A%2A%20`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="action-link-btn"
                                    >
                                      <RotateCcw size={12} strokeWidth={3} /> REQUEST RETURN
                                    </a>
                                  </>
                                )}

                                {/* IF 5 DAYS HAVE PASSED */}
                                {isDelivered && !canReturn && (
                                  <span className="window-closed-msg">RETURN WINDOW CLOSED</span>
                                )}

                                {/* CANCEL BUTTON (ONLY SHOWS IF PROCESSING) */}
                                {order.status?.toLowerCase() === 'processing' && (
                                  <button 
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="action-link-btn"
                                  >
                                    <XCircle size={12} strokeWidth={3} /> CANCEL ORDER
                                  </button>
                                )}

                              </div>
                            </div>
                          </div>

                          <hr className="divider" />

                          {/* Order Items */}
                          <div className="order-items-scroll">
                           {(order.orderItems || []).map((item: any, index: number) => (
                              <div key={index} className="item-row">
                                <div className="item-image-wrapper">
                                  <Image 
                                    src={item.image || "/fallback.png"} 
                                    alt={item.name} 
                                    fill 
                                    style={{ objectFit: 'cover' }} 
                                  />
                                </div>
                                <div className="item-details">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-size-qty">
                                    SIZE: {item.size} &nbsp;|&nbsp; QTY: {item.quantity}
                                  </span>
                                </div>
                                <div className="item-price">₹{item.price * item.quantity}</div>
                              </div>
                            ))}
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "SETTINGS" && (
              <div className="settings-section">
                <h2 className="section-title">PROFILE LOGISTICS // SYSTEM SETTINGS</h2>
                <div className="empty-vault">
                  <User size={48} strokeWidth={1} />
                  <h3>V2.0 IN DEVELOPMENT</h3>
                  <p>Account address and credential management will be deployed shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        /* BASE LAYOUT */
        .vault-page { padding: 140px 6% 100px; background: var(--bg); color: var(--text); min-height: 100vh; font-family: 'Inter', sans-serif; transition: 0.3s; }
        .vault-container { max-width: 1200px; margin: 0 auto; }

        /* LOADING & RESTRICTED STATES */
        .vault-loading, .empty-profile { height: 80vh; display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center; background: var(--bg); color: var(--text); font-size: 14px; font-weight: 900; letter-spacing: 3px; }
        .empty-profile h2 { font-size: 32px; letter-spacing: -1px; margin: 0; }
        .empty-profile p { font-size: 12px; opacity: 0.6; letter-spacing: 1px; font-weight: 700; margin: 0; }
        .spinner { animation: spin 1s linear infinite; color: #ffc107; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .login-btn { padding: 18px 35px; background: #ffc107; color: #0f172a; text-decoration: none; font-weight: 900; letter-spacing: 2px; border-radius: 4px; transition: 0.2s; }
        .login-btn:hover { background: #ffb300; transform: translateY(-2px); }

        /* HEADER */
        .vault-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--text); padding-bottom: 40px; margin-bottom: 50px; }
        .user-profile-info { display: flex; align-items: center; gap: 25px; }
        .avatar { width: 80px; height: 80px; border-radius: 8px; background: #ffc107; color: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; box-shadow: 4px 4px 0px var(--text); }
        :global(.dark) .avatar { box-shadow: 4px 4px 0px rgba(255,255,255,0.2); }
        
        .label { font-size: 10px; font-weight: 800; letter-spacing: 4px; opacity: 0.5; display: block; margin-bottom: 5px; }
        .title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -1px; margin: 0 0 5px 0; line-height: 1; text-transform: uppercase; }
        .email-tag { font-size: 13px; font-weight: 700; opacity: 0.6; margin: 0; }

        /* GRID LAYOUT */
        .profile-grid { display: grid; grid-template-columns: 260px 1fr; gap: 60px; align-items: start; }
        
        /* SIDEBAR */
        .sidebar { display: flex; flex-direction: column; gap: 10px; position: sticky; top: 120px; }
        .sidebar button { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border: 1px solid transparent; background: transparent; color: var(--text); font-weight: 800; font-size: 13px; cursor: pointer; text-align: left; border-radius: 6px; transition: 0.2s; letter-spacing: 1px; }
        .sidebar button:hover { background: rgba(128,128,128,0.05); }
        .sidebar button.active { background: var(--text); color: var(--bg); border-color: var(--text); box-shadow: 4px 4px 0px rgba(128,128,128,0.2); }
        
        .sidebar button.logout { margin-top: 40px; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .sidebar button.logout:hover { background: #ef4444; color: white; border-color: #ef4444; }

        /* CONTENT AREA */
        .section-title { font-size: 14px; font-weight: 900; letter-spacing: 3px; opacity: 0.5; margin-bottom: 30px; }

        /* EMPTY STATE */
        .empty-vault { background: rgba(128,128,128,0.02); border: 2px dashed rgba(128,128,128,0.3); padding: 80px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; }
        .empty-vault svg { opacity: 0.3; margin-bottom: 20px; }
        .empty-vault h3 { font-size: 18px; font-weight: 900; letter-spacing: 2px; margin: 0 0 10px 0; }
        .empty-vault p { font-size: 13px; opacity: 0.6; font-weight: 600; margin: 0 0 30px 0; }
        .shop-link { display: flex; align-items: center; gap: 10px; background: #ffc107; color: #0f172a; padding: 18px 30px; font-size: 13px; font-weight: 900; letter-spacing: 2px; text-decoration: none; transition: 0.3s; border-radius: 4px; box-shadow: 0 4px 0px rgba(255, 193, 7, 0.4); }
        .shop-link:hover { transform: translateY(-2px); box-shadow: 0 6px 0px rgba(255, 193, 7, 0.4); background: #ffb300; }

        /* ORDERS LIST */
        .orders-list { display: flex; flex-direction: column; gap: 30px; }
        .order-card { background: rgba(128,128,128,0.02); border: 1px solid rgba(128,128,128,0.2); padding: 35px; border-radius: 12px; transition: 0.3s; }
        .order-card:hover { border-color: var(--text); box-shadow: 6px 6px 0px rgba(128,128,128,0.1); }
        
        .order-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; }
        .order-id-block { display: flex; flex-direction: column; gap: 5px; }
        .order-label { font-size: 10px; font-weight: 800; letter-spacing: 2px; opacity: 0.5; }
        .order-id { font-size: 20px; font-family: monospace; font-weight: 900; letter-spacing: 2px; }

        .order-meta-grid { display: flex; gap: 40px; flex-wrap: wrap; }
        .meta-item { display: flex; flex-direction: column; gap: 5px; }
        .meta-label { font-size: 10px; font-weight: 800; letter-spacing: 2px; opacity: 0.5; }
        .meta-value { font-size: 16px; font-weight: 800; }

        /* STATUS BADGES & LINKS */
        .status-badge { font-size: 11px; font-weight: 900; letter-spacing: 1px; padding: 6px 12px; border-radius: 4px; display: inline-block; background: var(--text); color: var(--bg); }
        .status-badge.processing { background: #ffc107; color: #0f172a; }
        .status-badge.shipped { background: #3b82f6; color: white; }
        .status-badge.delivered { background: #22c55e; color: white; }
        .status-badge.cancelled { background: #ef4444; color: white; }

        .invoice-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #888;
          text-decoration: none;
          transition: 0.2s;
        }
        .invoice-btn:hover { color: var(--text); }

        /* 🔥 UNIFIED ACTION BUTTON STYLES (Return, Replace, Cancel) 🔥 */
        .action-link-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
          transition: 0.2s;
        }
        .action-link-btn:hover { color: #dc2626; }

        .window-closed-msg {
          margin-top: 10px;
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #888;
          opacity: 0.7;
        }

        .divider { border: none; border-top: 1px dashed rgba(128,128,128,0.2); margin: 30px 0; }

        /* ORDER ITEMS */
        .order-items-scroll { display: flex; flex-direction: column; gap: 15px; }
        .item-row { display: flex; align-items: center; gap: 20px; padding: 15px; background: var(--bg); border: 1px solid rgba(128,128,128,0.1); border-radius: 8px; }
        .item-image-wrapper { position: relative; width: 60px; height: 80px; background: rgba(128,128,128,0.05); border-radius: 4px; overflow: hidden; }
        .item-details { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .item-name { font-size: 14px; font-weight: 900; text-transform: uppercase; }
        .item-size-qty { font-size: 11px; font-weight: 700; opacity: 0.6; letter-spacing: 1px; }
        .item-price { font-size: 16px; font-weight: 900; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
          .sidebar { position: relative; top: 0; flex-direction: row; flex-wrap: wrap; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 20px; }
          .sidebar button { flex: 1; min-width: 200px; justify-content: center; }
          .sidebar button.logout { margin-top: 0; }
          .order-meta-grid { gap: 20px; width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}