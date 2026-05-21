"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Package,
  Heart,
  Settings,
  LogOut,
  Truck,
  FileText,
  ExternalLink,
  Loader2,
  XCircle,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import { useWishlist } from "@/app/context/WishlistContext";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoadingOrders(true);

      const res = await fetch(
        `/api/orders?email=${session.user.email}`
      );

      const data = await res.json();

      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, session?.user?.email]);

  // ================= HELPERS =================
  const getStatusClass = (status: string) => {
    const s = (status || "processing").toLowerCase();

    if (s === "delivered") return "status-delivered";
    if (s === "dispatched" || s === "shipped")
      return "status-dispatched";
    if (s === "cancelled") return "status-cancelled";

    return "status-processing";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Processing";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isWithinDays = (
    dateString: string,
    daysLimit: number
  ) => {
    if (!dateString) return false;

    const targetDate = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(
      now.getTime() - targetDate.getTime()
    );

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return diffDays <= daysLimit;
  };

  // ================= ACTION HANDLER =================
  const handleOrderAction = async (
    orderId: string,
    action: "cancel" | "return" | "replace"
  ) => {
    const confirmMessage =
      action === "cancel"
        ? "Are you sure you want to cancel this order?"
        : action === "return"
        ? "Do you want to initiate a return request?"
        : "Do you want to request a replacement?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(
        `/api/orders/${orderId}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(`${action} request submitted successfully`);
        fetchOrders();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* ================= SIDEBAR ================= */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="brand-badge">GenZonic</div>

            <h2 className="user-title">VIP ACCESS</h2>

            <p className="user-email">
              {session?.user?.email || "guest@sys.com"}
            </p>

            <div className="scan-line"></div>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-btn ${
                activeTab === "orders" ? "active" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} />
              Orders
            </button>

            <button
              className={`nav-btn ${
                activeTab === "saved" ? "active" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              <Heart size={18} />
              Wishlist

              <span className="count-badge">
                {wishlist.length}
              </span>
            </button>

            <button
              className={`nav-btn ${
                activeTab === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={18} />
              Settings
            </button>

            <div className="divider"></div>

            <button
              className="nav-btn signout-btn"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="profile-content">
          {/* ================= WISHLIST ================= */}
          {activeTab === "saved" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">
                Saved Styles
              </h1>

              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <Heart
                    size={40}
                    className="empty-icon"
                  />

                  <p>Your wishlist is empty.</p>

                  <Link
                    href="/shop/men"
                    className="premium-btn"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="saved-grid">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="mini-product-card"
                    >
                      <div className="image-box">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div className="info-box">
                        <h3>{item.name}</h3>

                        <p>₹{item.price}</p>

                        <Link
                          href="/cart"
                          className="premium-btn small"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= ORDERS ================= */}
          {activeTab === "orders" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">
                Order Archive
              </h1>

              {isLoadingOrders ? (
                <div className="empty-state">
                  <Loader2
                    className="spinner"
                    size={40}
                  />

                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package
                    size={40}
                    className="empty-icon"
                  />

                  <p>No orders found.</p>

                  <Link
                    href="/shop/men"
                    className="premium-btn"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const statusStr = (
                      order.status || "Processing"
                    ).toLowerCase();

                    const timeReferenceDate =
                      order.deliveredAt ||
                      order.updatedAt ||
                      order.createdAt;

                    return (
                      <div
                        key={order._id || order.id}
                        className="order-card"
                      >
                        {/* HEADER */}
                        <div className="order-header">
                          <div className="order-meta">
                            <span className="order-id">
                              Order ID :
                              <span className="mono">
                                {order.manifestId ||
                                  order.shortId ||
                                  order.rzpOrderId ||
                                  order._id
                                    ?.slice(-8)
                                    .toUpperCase() ||
                                  order._id}
                              </span>
                            </span>

                            <span className="order-date">
                              Ordered :
                              {" "}
                              {formatDate(
                                order.createdAt
                              )}
                            </span>
                          </div>

                          <div
                            className={`status-badge ${getStatusClass(
                              statusStr
                            )}`}
                          >
                            <Truck size={14} />

                            {statusStr
                              .charAt(0)
                              .toUpperCase() +
                              statusStr.slice(1)}
                          </div>
                        </div>

                        {/* BODY */}
                        <div className="order-body">
                          {/* LEFT */}
                          <div className="order-items-preview">
                            {(
                              order.items ||
                              order.orderItems ||
                              order.products ||
                              []
                            ).map(
                              (
                                item: any,
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  className="mini-item"
                                >
                                  <div className="mini-item-img">
                                    <Image
                                      src={
                                        item.image ||
                                        "/fallback.png"
                                      }
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      fill
                                      style={{
                                        objectFit:
                                          "cover",
                                      }}
                                    />
                                  </div>

                                  <div className="mini-item-info">
                                    <h4>
                                      {item.name}
                                    </h4>

                                    <p>
                                      Size :
                                      {" "}
                                      {item.size ||
                                        "M"}

                                      <span className="separator">
                                        |
                                      </span>

                                      Qty :
                                      {" "}
                                      {item.quantity ||
                                        1}
                                    </p>
                                  </div>

                                  <div className="mini-item-price">
                                    ₹{item.price}
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          {/* RIGHT */}
                          <div className="order-summary-panel">
                            <div className="payment-info">
                              <span className="label">
                                Total Amount
                              </span>

                              <span className="amount">
                                ₹
                                {order.totalAmount ||
                                  order.total ||
                                  order.totalPrice ||
                                  0}
                              </span>
                            </div>

                            <div className="order-actions">
                              <Link
                                href={`/invoice/${
                                  order.orderId ||
                                  order._id
                                }`}
                                className="premium-btn outline small"
                              >
                                <FileText size={14} />
                                Invoice
                              </Link>

                              {order.trackingLink && (
                                <a
                                  href={
                                    order.trackingLink
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="premium-btn highlight small"
                                >
                                  Track
                                  <ExternalLink
                                    size={14}
                                  />
                                </a>
                              )}

                              {statusStr ===
                                "processing" && (
                                <button
                                  onClick={() =>
                                    handleOrderAction(
                                      order._id,
                                      "cancel"
                                    )
                                  }
                                  className="premium-btn danger small"
                                >
                                  <XCircle
                                    size={14}
                                  />
                                  Cancel
                                </button>
                              )}

                              {statusStr ===
                                "delivered" && (
                                <>
                                  {isWithinDays(
                                    timeReferenceDate,
                                    3
                                  ) && (
                                    <button
                                      onClick={() =>
                                        handleOrderAction(
                                          order._id,
                                          "return"
                                        )
                                      }
                                      className="premium-btn warning small"
                                    >
                                      <RotateCcw
                                        size={14}
                                      />
                                      Return
                                    </button>
                                  )}

                                  {isWithinDays(
                                    timeReferenceDate,
                                    7
                                  ) && (
                                    <button
                                      onClick={() =>
                                        handleOrderAction(
                                          order._id,
                                          "replace"
                                        )
                                      }
                                      className="premium-btn warning small"
                                    >
                                      <RefreshCw
                                        size={14}
                                      />
                                      Replace
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

          {/* ================= SETTINGS ================= */}
          {activeTab === "settings" && (
            <div className="tab-section fade-in">
              <h1 className="section-title">
                Account Settings
              </h1>

              <div className="empty-state">
                <Settings
                  size={40}
                  className="empty-icon"
                />

                <p>
                  Account settings coming soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .profile-wrapper {
          min-height: 100vh;
          padding: 140px 5% 80px;
          background: var(--bg);
          color: var(--text);
          font-family: "Inter", sans-serif;
        }

        .profile-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          align-items: flex-start;
        }

        .mono {
          font-family: monospace;
        }

        .fade-in {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================= SIDEBAR ================= */
        .profile-sidebar {
          position: sticky;
          top: 120px;
        }

        .user-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #111,
            #000
          );

          color: white;
          padding: 35px 22px;
          border-radius: 20px;
          margin-bottom: 25px;

          border: 1px solid
            rgba(255, 255, 255, 0.08);

          box-shadow: 0 20px 50px
            rgba(0, 0, 0, 0.2);
        }

        .brand-badge {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .user-title {
          font-size: 13px;
          letter-spacing: 3px;
          color: #ffc107;
          margin-bottom: 10px;
        }

        .user-email {
          font-size: 12px;
          opacity: 0.7;
          word-break: break-word;
        }

        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 193, 7, 0.6);
          box-shadow: 0 0 10px
            rgba(255, 193, 7, 0.8);

          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% {
            top: -10%;
          }

          100% {
            top: 110%;
          }
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-btn {
          width: 100%;
          border: none;
          background: transparent;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 14px 16px;

          border-radius: 12px;

          color: var(--text);

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.3s;
        }

        .nav-btn:hover {
          background: rgba(128, 128, 128, 0.08);
        }

        .nav-btn.active {
          background: rgba(128, 128, 128, 0.12);
          border-left: 4px solid var(--text);
        }

        .count-badge {
          margin-left: auto;
          background: rgba(128, 128, 128, 0.2);
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11px;
        }

        .divider {
          height: 1px;
          background: rgba(128, 128, 128, 0.15);
          margin: 10px 0;
        }

        .signout-btn {
          color: #ef4444;
        }

        /* ================= CONTENT ================= */
        .section-title {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 28px;
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          border-radius: 20px;
          border: 1px dashed
            rgba(128, 128, 128, 0.2);

          background: rgba(128, 128, 128, 0.03);
        }

        .empty-icon {
          opacity: 0.3;
          margin-bottom: 20px;
        }

        .empty-state p {
          margin-bottom: 25px;
          opacity: 0.7;
          font-weight: 600;
        }

        /* ================= BUTTONS ================= */
        .premium-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 12px 18px;

          border-radius: 12px;

          border: 1px solid var(--text);

          background: var(--text);
          color: var(--bg);

          font-size: 13px;
          font-weight: 800;

          text-decoration: none;
          cursor: pointer;

          transition: 0.3s;
        }

        .premium-btn:hover {
          transform: translateY(-2px);
        }

        .premium-btn.small {
          width: 100%;
          padding: 11px 14px;
        }

        .premium-btn.outline {
          background: transparent;
          color: var(--text);
          border-color: rgba(128, 128, 128, 0.3);
        }

        .premium-btn.highlight {
          background: #22c55e;
          border-color: #22c55e;
          color: white;
        }

        .premium-btn.danger {
          background: transparent;
          border-color: #ef4444;
          color: #ef4444;
        }

        .premium-btn.warning {
          background: transparent;
          border-color: #f59e0b;
          color: #f59e0b;
        }

        /* ================= WISHLIST ================= */
        .saved-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(220px, 1fr)
          );

          gap: 24px;
        }

        .mini-product-card {
          overflow: hidden;
          border-radius: 18px;

          border: 1px solid
            rgba(128, 128, 128, 0.15);

          background: rgba(128, 128, 128, 0.02);

          transition: 0.3s;
        }

        .mini-product-card:hover {
          transform: translateY(-6px);
        }

        .image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
        }

        .info-box {
          padding: 16px;
        }

        .info-box h3 {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .info-box p {
          font-weight: 700;
          margin-bottom: 15px;
        }

        /* ================= ORDERS ================= */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .order-card {
          border-radius: 20px;
          overflow: hidden;

          border: 1px solid
            rgba(128, 128, 128, 0.15);

          background: rgba(128, 128, 128, 0.03);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 20px;

          padding: 18px 24px;

          border-bottom: 1px solid
            rgba(128, 128, 128, 0.1);
        }

        .order-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .order-id {
          font-size: 13px;
          font-weight: 700;
        }

        .order-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 8px 14px;
          border-radius: 30px;

          font-size: 12px;
          font-weight: 800;
        }

        .status-processing {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-dispatched {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-delivered {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .order-body {
          display: grid;
          grid-template-columns: 2fr 320px;
        }

        .order-items-preview {
          padding: 24px;
          border-right: 1px solid
            rgba(128, 128, 128, 0.1);

          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mini-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mini-item-img {
          position: relative;
          width: 70px;
          min-width: 70px;
          height: 90px;

          border-radius: 10px;
          overflow: hidden;
        }

        .mini-item-info {
          flex: 1;
          min-width: 0;
        }

        .mini-item-info h4 {
          font-size: 14px;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .mini-item-info p {
          font-size: 12px;
          opacity: 0.7;
        }

        .mini-item-price {
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
        }

        .separator {
          margin: 0 8px;
        }

        .order-summary-panel {
          padding: 24px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }

        .payment-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 12px;
          opacity: 0.7;
        }

        .amount {
          font-size: 28px;
          font-weight: 900;
        }

        .order-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= TABLET ================= */
        @media (max-width: 1100px) {
          .profile-container {
            grid-template-columns: 1fr;
          }

          .profile-sidebar {
            position: static;
          }

          .profile-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
          }

          .profile-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-btn {
            min-width: max-content;
          }

          .divider {
            display: none;
          }

          .order-body {
            grid-template-columns: 1fr;
          }

          .order-items-preview {
            border-right: none;
            border-bottom: 1px solid
              rgba(128, 128, 128, 0.1);
          }
        }

        /* ================= MOBILE ================= */
        @media (max-width: 768px) {
          .profile-wrapper {
            padding: 110px 16px 50px;
          }

          .section-title {
            font-size: 24px;
          }

          .saved-grid {
            grid-template-columns: repeat(
              2,
              1fr
            );
            gap: 16px;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-summary-panel {
            padding: 18px;
          }

          .amount {
            font-size: 24px;
          }

          .mini-item {
            align-items: flex-start;
          }

          .mini-item-img {
            width: 60px;
            min-width: 60px;
            height: 78px;
          }
        }

        /* ================= SMALL MOBILE ================= */
        @media (max-width: 500px) {
          .profile-wrapper {
            padding: 95px 12px 40px;
          }

          .user-card {
            padding: 28px 18px;
          }

          .brand-badge {
            font-size: 22px;
          }

          .saved-grid {
            grid-template-columns: 1fr;
          }

          .order-header {
            padding: 16px;
          }

          .order-items-preview {
            padding: 16px;
          }

          .order-summary-panel {
            padding: 16px;
          }

          .mini-item {
            gap: 12px;
          }

          .mini-item-info h4 {
            font-size: 13px;
          }

          .mini-item-price {
            font-size: 13px;
          }

          .order-actions {
            width: 100%;
          }

          .premium-btn.small {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}