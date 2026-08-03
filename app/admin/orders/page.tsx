"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Search, Download } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderTimeFilter, setOrderTimeFilter] = useState("All Time");
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // 🔥 Added cache: "no-store" to guarantee fresh data! 🔥
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("API returned false:", data.message);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        // Update the local state so the UI reflects the change immediately
        setOrders((prevOrders: any) =>
          prevOrders.map((order: any) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).toUpperCase();
  };

  // Filter orders by search (ID, Email, or Name) and Time
  const filteredOrders = orders.filter((order: any) => {
    // Time Filter
    let timeMatch = true;
    if (orderTimeFilter !== "All Time") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const orderDate = new Date(order.createdAt);
      
      if (orderTimeFilter === "Today") {
        timeMatch = orderDate >= today;
      } else if (orderTimeFilter === "This Week") {
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        timeMatch = orderDate >= firstDayOfWeek;
      } else if (orderTimeFilter === "This Month") {
        timeMatch = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      } else if (orderTimeFilter === "This Year") {
        timeMatch = orderDate.getFullYear() === now.getFullYear();
      } else if (orderTimeFilter === "Custom Date" && customDate) {
        const selectedDate = new Date(customDate);
        timeMatch = orderDate.getFullYear() === selectedDate.getFullYear() && 
                    orderDate.getMonth() === selectedDate.getMonth() && 
                    orderDate.getDate() === selectedDate.getDate();
      } else if (orderTimeFilter === "Custom Date" && !customDate) {
        timeMatch = true;
      }
    }

    if (!timeMatch) return false;

    const searchLower = searchTerm.toLowerCase();
    
    // Safely check ID, Email, and Name without crashing
    const idMatch = order._id?.toLowerCase().includes(searchLower);
    const emailMatch = (order.userEmail || order.shippingInfo?.email || "").toLowerCase().includes(searchLower);
    const nameMatch = `${order.shippingInfo?.firstName || ""} ${order.shippingInfo?.lastName || ""}`.toLowerCase().includes(searchLower);
    
    return idMatch || emailMatch || nameMatch;
  });

  const exportToCSV = () => {
    if (filteredOrders.length === 0) return alert("No orders to export!");

    const headers = [
      "Order ID", "Date", "Customer Name", "Email", "Phone", 
      "Address", "City", "State", "PIN Code", "Total Amount (Rs)", "Delivery Status"
    ];

    const rows = filteredOrders.map((order: any) => [
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      `"${((order.shippingInfo?.firstName || '') + ' ' + (order.shippingInfo?.lastName || '')).replace(/"/g, '""').trim()}"`,
      `"${(order.userEmail || order.shippingInfo?.email || '').replace(/"/g, '""')}"`,
      `"${(order.shippingInfo?.phone || '').replace(/"/g, '""')}"`,
      `"${(order.shippingInfo?.address || '').replace(/"/g, '""')}"`,
      `"${(order.shippingInfo?.city || '').replace(/"/g, '""')}"`,
      `"${(order.shippingInfo?.state || '').replace(/"/g, '""')}"`,
      `"${(order.shippingInfo?.pinCode || '').replace(/"/g, '""')}"`,
      order.totalAmount || 0,
      order.status || 'Pending'
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `genzonic_orders_${orderTimeFilter.replace(/\s+/g, '_').toLowerCase()}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <Loader2 className="spinner" size={32} />
        <span>ACCESSING SECURE MAINFRAME...</span>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">COMMAND CENTER // ORDERS</h1>
          <p className="admin-subtitle">Manage fulfillment, shipping, and manifests.</p>
        </div>
        
        <div className="header-actions">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="SEARCH ID, NAME, OR EMAIL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            value={orderTimeFilter} 
            onChange={(e) => setOrderTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
            <option value="Custom Date">Custom Date</option>
          </select>

          {orderTimeFilter === "Custom Date" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="filter-date"
            />
          )}

          <button onClick={exportToCSV} className="export-btn">
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>MANIFEST ID</th>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <Package size={32} opacity={0.3} />
                  <p>NO ORDERS FOUND MATCHING CRITERIA.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: any) => (
                <tr key={order._id}>
                  
                  {/* ID */}
                  <td className="mono-text">{order._id.slice(-8).toUpperCase()}</td>
                  
                  {/* DATE */}
                  <td className="meta-text">{formatDate(order.createdAt)}</td>
                  
                  {/* CUSTOMER (Now with full Address & Phone) */}
                  <td>
                    <div className="customer-cell">
                      <span className="c-name">
                        {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                      </span>
                      <span className="c-email">
                        {order.userEmail || order.shippingInfo?.email}
                      </span>
                      <span className="c-phone">
                        📞 +91 {order.shippingInfo?.phone} {order.shippingInfo?.altPhone ? ` / ${order.shippingInfo.altPhone}` : ""}
                      </span>
                      
                      <div className="c-address-box">
                        <span className="c-type">[{order.shippingInfo?.addressType?.toUpperCase() || "HOME"}]</span>
                        <span className="c-address-line">{order.shippingInfo?.address}</span>
                        <span className="c-address-line">{order.shippingInfo?.area}</span>
                        {order.shippingInfo?.landmark && (
                          <span className="c-address-line">Landmark: {order.shippingInfo.landmark}</span>
                        )}
                        <span className="c-city">
                          {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* ITEMS (Summarized) */}
                  <td>
                    <div className="items-cell">
                      {order.orderItems.map((item: any, i: number) => (
                        <div key={i} className="item-line">
                          {item.quantity}x {item.name} ({item.size})
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* TOTAL */}
                  <td className="bold-text">₹{order.totalAmount}</td>
                  
                  {/* STATUS DROPDOWN */}
                  <td>
                    <div className="status-cell">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="Processing">PROCESSING</option>
                        <option value="Shipped">SHIPPED</option>
                        <option value="Delivered">DELIVERED</option>
                        <option value="Cancelled">CANCELLED</option>
                      </select>
                      {updatingId === order._id && <Loader2 size={14} className="spinner small-spinner" />}
                    </div>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-orders-page {
          padding: 40px;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .admin-loading {
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .admin-title {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0 0 5px 0;
        }

        .admin-subtitle {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.5;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(128,128,128,0.3);
          padding: 10px 15px;
          width: 300px;
          border-radius: 4px;
        }

        .filter-select {
          background: transparent;
          border: 1px solid rgba(128,128,128,0.3);
          color: var(--text);
          padding: 10px 15px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }
        
        .filter-select option {
          background: var(--bg);
          color: var(--text);
        }

        .filter-date {
          background: transparent;
          border: 1px solid rgba(128,128,128,0.3);
          color: var(--text);
          padding: 8px 15px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          border-radius: 4px;
          outline: none;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--text);
          color: var(--bg);
          border: none;
          padding: 10px 20px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .export-btn:hover {
          opacity: 0.8;
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          color: var(--text);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          width: 100%;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
          border: 1px solid rgba(128,128,128,0.2);
          background: rgba(128,128,128,0.02);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .orders-table th {
          text-align: left;
          padding: 20px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: 0.6;
          border-bottom: 1px solid rgba(128,128,128,0.2);
        }

        .orders-table td {
          padding: 20px;
          border-bottom: 1px solid rgba(128,128,128,0.1);
          vertical-align: top;
        }

        .orders-table tr:hover td {
          background: rgba(128,128,128,0.05);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px !important;
        }
        
        .empty-state p {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: 0.5;
          margin-top: 15px;
        }

        .mono-text {
          font-family: monospace;
          font-weight: 800;
          font-size: 14px;
        }

        .meta-text {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.7;
        }

        .bold-text {
          font-weight: 800;
          font-size: 14px;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .c-name { font-size: 13px; font-weight: 800; }
        .c-email { font-size: 11px; opacity: 0.7; }
        .c-city { font-size: 10px; font-weight: 600; opacity: 0.5; text-transform: uppercase; }

        .c-phone { font-size: 11px; opacity: 0.8; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
        
        .c-address-box { 
          background: rgba(128,128,128,0.05); 
          padding: 10px; 
          border-radius: 4px; 
          display: flex; 
          flex-direction: column; 
          gap: 4px; 
          border-left: 2px solid #ffc107; 
          margin-top: 5px; 
        }
        
        .c-type { font-size: 10px; font-weight: 900; color: #ffc107; letter-spacing: 1px; margin-bottom: 2px; }
        .c-address-line { font-size: 11px; font-weight: 500; opacity: 0.9; line-height: 1.4; }

        .items-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-line {
          font-size: 11px;
          font-weight: 600;
          background: rgba(128,128,128,0.1);
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-select {
          background: transparent;
          border: 1px solid;
          color: inherit;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          outline: none;
          appearance: none;
          border-radius: 2px;
        }

        .status-select:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Dynamic colors based on value */
        .status-select.processing { border-color: #f5a623; color: #f5a623; }
        .status-select.shipped { border-color: #4a90e2; color: #4a90e2; }
        .status-select.delivered { border-color: #50e3c2; color: #50e3c2; }
        .status-select.cancelled { border-color: #ff3333; color: #ff3333; }
        
        .status-select option {
          background: var(--bg);
          color: var(--text);
        }
      `}</style>
    </div>
  );
}