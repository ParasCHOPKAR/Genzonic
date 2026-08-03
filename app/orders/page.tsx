"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, Clock, CheckCircle2, Loader2, ArrowRight, Receipt, XCircle, Download } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type OrderItem = { _id: string; id: string; name: string; price: number; quantity: number; image: string; size: string; };
type Order = { _id: string; paymentResult?: { razorpay_order_id?: string }; status: string; createdAt: string; orderItems: OrderItem[]; totalAmount: number; };

export default function OrdersPage() {
  const { data: session, status: authStatus } = useSession();
  const { theme } = useTheme();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?email=${session?.user?.email}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        setError(`Failed to load orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authStatus, session?.user?.email]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    // Optimistic UI Update
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: "Cancelled" } : o));

    try {
      // In Genzonic, if the API doesn't exist yet, we handle gracefully
      const res = await fetch("/api/orders/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      
      if (!data.success && data.message !== "Not Found") {
        alert(data.message);
        window.location.reload(); 
      }
    } catch (error) {
      alert("Failed to cancel order.");
      window.location.reload();
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || "Processing");
    
    if (s === "Paid" || s === "Delivered") {
      return <span className="status-badge badge-success"><CheckCircle2 size={14} /> {s}</span>;
    }
    if (s === "Processing" || s === "Shipped") {
      return <span className="status-badge badge-info"><Clock size={14} /> {s}</span>;
    }
    if (s === "Cancelled") {
      return <span className="status-badge badge-danger"><XCircle size={14} /> {s}</span>;
    }
    return <span className="status-badge badge-default"><Clock size={14} /> {s}</span>;
  };

  const isDark = theme === "dark";

  return (
    <div className={`orders-page ${isDark ? 'dark-mode' : ''}`}>
      <div className="orders-container">
        
        <div className="header-section">
          <h1 className="main-title">Order History</h1>
          <p className="sub-title">View and track your previous purchases.</p>
        </div>

        {loading && (
          <div className="orders-loading">
            <Loader2 size={40} className="spinner" />
          </div>
        )}

        {!loading && authStatus === "unauthenticated" && (
          <div className="empty-state">
            <h2 className="empty-title">Please log in</h2>
            <p className="sub-title">You need to log in to view your orders.</p>
            <Link href="/login" className="btn-primary" style={{ marginTop: '20px' }}>
              Sign In
            </Link>
          </div>
        )}

        {!loading && error && <div className="error-message">{error}</div>}

        {!loading && !error && authStatus === "authenticated" && orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon-wrapper"><Package size={40} /></div>
            <h2 className="empty-title">No orders found</h2>
            <Link href="/shop/men" className="btn-primary" style={{ marginTop: '24px' }}>
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                
                {/* Order Header */}
                <div className="order-header">
                  <div>
                    <div className="order-placed-label">
                      <Receipt size={14} className="receipt-icon" /> Order Placed
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="order-id">ID: {order.paymentResult?.razorpay_order_id || order._id}</div>
                  </div>
                  
                  <div className="order-header-right">
                    {renderStatusBadge(order.status)}
                    <div className="order-total">₹{order.totalAmount?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image-wrapper">
                        <Image src={item.image} alt={item.name} fill className="item-image" />
                      </div>
                      <div className="item-details">
                        <Link href={`/product/${item.id}`} className="item-name">
                          {item.name}
                        </Link>
                        <div className="item-meta">Qty: {item.quantity} × ₹{item.price?.toLocaleString()} | Size: {item.size}</div>
                      </div>
                      <div className="item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons Footer */}
                <div className="order-footer">
                  <Link 
                    href={`/invoice/${order._id}`} 
                    target="_blank" 
                    className="btn-secondary"
                  >
                    <Download size={16} className="receipt-icon" /> Download Invoice
                  </Link>

                  {/* ONLY show cancel button if status is Pending, Paid, or Processing */}
                  {["Pending", "Paid", "Processing"].includes(order.status || "Processing") && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)} 
                      className="btn-danger"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 60px 0;
          color: #0f1b2e;
          font-family: inherit;
        }
        
        .orders-page.dark-mode {
          background: #0a0a0a;
          color: #fff;
        }

        .orders-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header-section { margin-bottom: 40px; }
        .main-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
        .sub-title { color: #888; font-weight: 500; }

        .orders-loading { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; border-radius: 32px; border: 1px solid #eaeaea; }
        .dark-mode .orders-loading { background: #111; border-color: #333; }
        .spinner { animation: spin 1s linear infinite; color: #FF3E00; margin-bottom: 16px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .error-message { background: #fef2f2; color: #dc2626; padding: 24px; border-radius: 16px; border: 1px solid #fee2e2; font-weight: 500; text-align: center; }
        .dark-mode .error-message { background: rgba(220, 38, 38, 0.1); border-color: rgba(220, 38, 38, 0.3); color: #ef4444; }

        .empty-state {
          background: #fff; border-radius: 40px; padding: 48px; text-align: center; 
          border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          display: flex; flex-direction: column; align-items: center;
        }
        .dark-mode .empty-state { background: #111; border-color: #333; box-shadow: none; }
        
        .empty-icon-wrapper { width: 96px; height: 96px; background: #f9f9f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ccc; margin-bottom: 24px; }
        .dark-mode .empty-icon-wrapper { background: #222; color: #555; }
        .empty-title { font-size: 24px; font-weight: bold; margin-bottom: 12px; }

        .btn-primary { background: #000; color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: bold; display: flex; align-items: center; gap: 8px; text-decoration: none; transition: opacity 0.2s; }
        .dark-mode .btn-primary { background: #fff; color: #000; }
        .btn-primary:hover { opacity: 0.8; }

        .orders-list { display: flex; flex-direction: column; gap: 24px; }

        .order-card {
          background: #fff; border-radius: 32px; border: 1px solid #eaeaea;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden;
        }
        .dark-mode .order-card { background: #111; border-color: #333; box-shadow: none; }

        .order-header {
          background: rgba(0,0,0,0.02); padding: 24px; border-bottom: 1px solid #eaeaea;
          display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .dark-mode .order-header { background: rgba(255,255,255,0.02); border-color: #333; }
        
        .order-placed-label { display: flex; align-items: center; gap: 8px; color: #888; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .receipt-icon { color: #FF3E00; }
        .order-date { font-weight: 800; font-size: 16px; }
        .order-id { color: #aaa; font-size: 12px; margin-top: 4px; font-family: monospace; }
        
        .order-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        @media (max-width: 600px) { .order-header-right { align-items: flex-start; } }
        
        .order-total { font-size: 20px; font-weight: 800; color: #FF3E00; }

        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border: 1px solid; }
        .badge-success { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
        .dark-mode .badge-success { background: rgba(21, 128, 61, 0.1); color: #4ade80; border-color: rgba(21, 128, 61, 0.3); }
        .badge-info { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .dark-mode .badge-info { background: rgba(29, 78, 216, 0.1); color: #60a5fa; border-color: rgba(29, 78, 216, 0.3); }
        .badge-danger { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .dark-mode .badge-danger { background: rgba(220, 38, 38, 0.1); color: #f87171; border-color: rgba(220, 38, 38, 0.3); }
        .badge-default { background: #f9f9f9; color: #666; border-color: #eaeaea; }
        .dark-mode .badge-default { background: #222; color: #aaa; border-color: #333; }

        .order-items { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .order-item { display: flex; gap: 16px; align-items: center; }
        .item-image-wrapper { position: relative; width: 80px; height: 80px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; flex-shrink: 0; }
        .dark-mode .item-image-wrapper { background: #222; border-color: #333; }
        .item-image { object-fit: cover; }
        .item-details { flex: 1; min-width: 0; }
        .item-name { font-weight: 800; font-size: 15px; color: inherit; text-decoration: none; transition: color 0.2s; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .item-name:hover { color: #FF3E00; }
        .item-meta { color: #888; font-size: 14px; font-weight: 500; margin-top: 4px; }
        .item-subtotal { font-weight: 800; }
        @media (max-width: 600px) { .item-subtotal { display: none; } }

        .order-footer {
          background: rgba(0,0,0,0.02); padding: 16px; border-top: 1px solid #eaeaea;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 12px;
        }
        .dark-mode .order-footer { background: rgba(255,255,255,0.02); border-color: #333; }

        .btn-secondary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fff; border: 1px solid #eaeaea; border-radius: 12px; font-size: 14px; font-weight: bold; color: inherit; text-decoration: none; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .dark-mode .btn-secondary { background: #111; border-color: #333; }
        .btn-secondary:hover { background: #f9f9f9; border-color: #ddd; }
        .dark-mode .btn-secondary:hover { background: #222; border-color: #444; }

        .btn-danger { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fef2f2; color: #dc2626; border: none; border-radius: 12px; font-size: 14px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        .dark-mode .btn-danger { background: rgba(220, 38, 38, 0.1); color: #ef4444; }
        .btn-danger:hover { background: #fee2e2; }
        .dark-mode .btn-danger:hover { background: rgba(220, 38, 38, 0.2); }
      `}</style>
    </div>
  );
}
