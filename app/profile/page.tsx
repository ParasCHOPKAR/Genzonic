"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [isLoadingOrders, setIsLoadingOrders] =
    useState(false);

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
      console.error(error);
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

    if (s === "shipped" || s === "dispatched") {
      return "status-shipped";
    }

    if (s === "cancelled") return "status-cancelled";

    return "status-processing";
  };

  const formatDate = (date: string) => {
    if (!date) return "Processing";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
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

  // ================= ACTIONS =================
  const handleOrderAction = async (
    orderId: string,
    action: "cancel" | "return" | "replace"
  ) => {
    const confirmMessage =
      action === "cancel"
        ? "Cancel this order?"
        : action === "return"
        ? "Request return?"
        : "Request replacement?";

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
        alert(`${action} request submitted`);
        fetchOrders();
      } else {
        alert(data.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* ================= SIDEBAR ================= */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="brand-badge">
              GenZonic
            </div>

            <h2 className="user-title">
              VIP ACCESS
            </h2>

            <p className="user-email">
              {session?.user?.email ||
                "guest@gmail.com"}
            </p>

            <div className="scan-line"></div>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-btn ${
                activeTab === "orders"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("orders")
              }
            >
              <Package size={16} />
              <span>Orders</span>
            </button>

            <button
              className={`nav-btn ${
                activeTab === "saved"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("saved")
              }
            >
              <Heart size={16} />
              <span>Wishlist</span>

              <span className="count-badge">
                {wishlist.length}
              </span>
            </button>

            <button
              className={`nav-btn ${
                activeTab === "settings"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("settings")
              }
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button
              className="nav-btn signout-btn"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="profile-content">
          {/* ================= SAVED ================= */}
          {activeTab === "saved" && (
            <div className="tab-section">
              <h1 className="section-title">
                Wishlist
              </h1>

              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <Heart
                    size={36}
                    className="empty-icon"
                  />

                  <p>
                    Your wishlist is empty
                  </p>

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
            <div className="tab-section">
              <h1 className="section-title">
                Order Archive
              </h1>

              {isLoadingOrders ? (
                <div className="empty-state">
                  <Loader2
                    className="spinner"
                    size={36}
                  />

                  <p>Loading Orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package
                    size={36}
                    className="empty-icon"
                  />

                  <p>No Orders Found</p>

                  <Link
                    href="/shop/men"
                    className="premium-btn"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const statusStr = (
                      order.status ||
                      "processing"
                    ).toLowerCase();

                    const timeReferenceDate =
                      order.deliveredAt ||
                      order.updatedAt ||
                      order.createdAt;

                    return (
                      <div
                        key={order._id}
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
                                  order._id
                                    ?.slice(-8)
                                    .toUpperCase()}
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
                            <Truck size={13} />

                            {statusStr
                              .charAt(0)
                              .toUpperCase() +
                              statusStr.slice(1)}
                          </div>
                        </div>

                        {/* BODY */}
                        <div className="order-body">
                          {/* ITEMS */}
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
                                        item.name
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
                                    ₹
                                    {item.price}
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          {/* SUMMARY */}
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
                                  className="premium-btn green small"
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
            <div className="tab-section">
              <h1 className="section-title">
                Settings
              </h1>

              <div className="empty-state">
                <Settings
                  size={36}
                  className="empty-icon"
                />

                <p>
                  Settings panel coming soon
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .profile-wrapper {
          width: 100%;
          min-height: 100vh;
          padding: 110px 16px 50px;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        .profile-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
        }

        /* ================= SIDEBAR ================= */
        .profile-sidebar {
          width: 100%;
          position: sticky;
          top: 110px;
          height: fit-content;
        }

        .user-card {
          position: relative;
          overflow: hidden;

          background: linear-gradient(
            135deg,
            #111,
            #000
          );

          border-radius: 20px;

          padding: 28px 22px;

          margin-bottom: 20px;

          border: 1px solid
            rgba(255, 255, 255, 0.08);
        }

        .brand-badge {
          font-size: 30px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 10px;
        }

        .user-title {
          font-size: 13px;
          letter-spacing: 3px;
          color: #ffc107;
          margin-bottom: 12px;
        }

        .user-email {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          word-break: break-word;
        }

        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 193, 7, 0.8);
          box-shadow: 0 0 12px
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
          gap: 10px;
        }

        .nav-btn {
          width: 100%;

          display: flex;
          align-items: center;
          gap: 10px;

          padding: 14px 16px;

          border-radius: 14px;

          border: none;

          background: transparent;

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
          border-left: 4px solid
            var(--text);
        }

        .count-badge {
          margin-left: auto;

          background: rgba(128, 128, 128, 0.15);

          padding: 2px 8px;

          border-radius: 30px;

          font-size: 11px;
        }

        .signout-btn {
          color: #ef4444;
        }

        /* ================= CONTENT ================= */
        .profile-content {
          width: 100%;
          min-width: 0;
        }

        .section-title {
          font-size: 34px;
          font-weight: 900;
          margin-bottom: 25px;
        }

        /* ================= EMPTY ================= */
        .empty-state {
          border-radius: 20px;

          border: 1px dashed
            rgba(128, 128, 128, 0.2);

          background: rgba(128, 128, 128, 0.03);

          padding: 70px 20px;

          text-align: center;
        }

        .empty-icon {
          opacity: 0.4;
          margin-bottom: 16px;
        }

        .empty-state p {
          margin-bottom: 24px;
          font-weight: 600;
          opacity: 0.7;
        }

        /* ================= BUTTONS ================= */
        .premium-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          border-radius: 12px;

          padding: 12px 16px;

          text-decoration: none;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          border: 1px solid
            var(--text);

          background: var(--text);
          color: var(--bg);

          transition: 0.3s;
        }

        .premium-btn.small {
          width: 100%;
        }

        .premium-btn.outline {
          background: transparent;
          color: var(--text);
          border-color: rgba(128, 128, 128, 0.3);
        }

        .premium-btn.green {
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

        /* ================= SAVED ================= */
        .saved-grid {
          display: grid;

          grid-template-columns: repeat(
            auto-fill,
            minmax(220px, 1fr)
          );

          gap: 20px;
        }

        .mini-product-card {
          border-radius: 18px;
          overflow: hidden;

          border: 1px solid
            rgba(128, 128, 128, 0.15);

          background: rgba(128, 128, 128, 0.02);
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
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .info-box p {
          margin-bottom: 16px;
          font-weight: 700;
        }

        /* ================= ORDERS ================= */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .order-card {
          width: 100%;
          overflow: hidden;

          border-radius: 20px;

          border: 1px solid
            rgba(128, 128, 128, 0.15);

          background: rgba(128, 128, 128, 0.03);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 16px;

          padding: 18px 20px;

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

        .mono {
          margin-left: 6px;
          font-family: monospace;
        }

        .order-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 8px 12px;

          border-radius: 30px;

          font-size: 11px;
          font-weight: 800;

          white-space: nowrap;
        }

        .status-processing {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-shipped {
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
          grid-template-columns: 1fr 300px;
        }

        /* ================= ITEMS ================= */
        .order-items-preview {
          padding: 20px;

          display: flex;
          flex-direction: column;
          gap: 18px;

          border-right: 1px solid
            rgba(128, 128, 128, 0.1);
        }

        .mini-item {
          display: flex;
          align-items: center;
          gap: 14px;

          min-width: 0;
        }

        .mini-item-img {
          position: relative;

          width: 72px;
          min-width: 72px;

          height: 92px;

          border-radius: 10px;
          overflow: hidden;

          background: #eee;
        }

        .mini-item-info {
          flex: 1;
          min-width: 0;
        }

        .mini-item-info h4 {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 6px;

          word-break: break-word;
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

        /* ================= SUMMARY ================= */
        .order-summary-panel {
          padding: 20px;

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
          font-size: 30px;
          font-weight: 900;
        }

        .order-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
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

            scrollbar-width: none;
          }

          .profile-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-btn {
            min-width: max-content;
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
            padding: 95px 12px 40px;
          }

          .section-title {
            font-size: 28px;
          }

          .saved-grid {
            grid-template-columns: 1fr 1fr;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-summary-panel {
            width: 100%;
          }

          .amount {
            font-size: 24px;
          }
        }

        /* ================= SMALL MOBILE ================= */
        @media (max-width: 520px) {
          .profile-wrapper {
            padding: 90px 10px 30px;
          }

          .profile-container {
            gap: 18px;
          }

          .user-card {
            padding: 24px 16px;
            border-radius: 16px;
          }

          .brand-badge {
            font-size: 26px;
          }

          .profile-nav {
            gap: 8px;
          }

          .nav-btn {
            padding: 12px 14px;
            font-size: 13px;
          }

          .section-title {
            font-size: 22px;
            margin-bottom: 18px;
          }

          .saved-grid {
            grid-template-columns: 1fr;
          }

          .order-card {
            border-radius: 16px;
          }

          .order-header {
            padding: 14px;
          }

          .order-items-preview {
            padding: 14px;
            gap: 14px;
          }

          .mini-item {
            align-items: flex-start;
            gap: 10px;
          }

          .mini-item-img {
            width: 58px;
            min-width: 58px;
            height: 74px;
          }

          .mini-item-info h4 {
            font-size: 12px;
          }

          .mini-item-info p {
            font-size: 11px;
          }

          .mini-item-price {
            font-size: 13px;
          }

          .order-summary-panel {
            padding: 14px;
          }

          .amount {
            font-size: 22px;
          }

          .premium-btn {
            font-size: 12px;
            padding: 11px 14px;
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