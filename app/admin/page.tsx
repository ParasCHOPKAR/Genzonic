"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingCart, IndianRupee, TrendingUp, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetching from the new dashboard API route
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const data = await res.json();
        
        if (data.success) {
          setStats({
            users: data.totalUsers || 0,
            orders: data.totalOrders || 0,
            revenue: data.totalRevenue || 0,
          });
          
          // If you add chart data to the API later, it will load here
          if (data.chartData) {
            setChartData(data.chartData);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className={styles.dashboardWrapper}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>COMMAND CENTER</h1>
        <p className={styles.subtitle}>System overview and analytics.</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginTop: '20px', fontSize: '12px', fontWeight: 800, letterSpacing: '2px' }}>
          <Loader2 className="spin" size={20} /> SYNCHRONIZING DATA...
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            
            {/* USERS CARD */}
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Users</span>
                <Users size={18} className={styles.statIcon} />
              </div>
              <h3 className={styles.statValue}>{stats.users}</h3>
            </div>

            {/* ORDERS CARD */}
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Orders</span>
                <ShoppingCart size={18} className={styles.statIcon} />
              </div>
              <h3 className={styles.statValue}>{stats.orders}</h3>
            </div>

            {/* REVENUE CARD */}
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Revenue</span>
                <IndianRupee size={18} className={styles.statIcon} />
              </div>
              <h3 className={styles.statValue}>₹{stats.revenue.toLocaleString('en-IN')}</h3>
            </div>

          </div>

          {/* CHART SECTION */}
          <div className={styles.chartSection}>
            <h3 className={styles.chartTitle}>
              <TrendingUp size={18} className={styles.statIcon} /> Sales Overview
            </h3>
            
            <div className={styles.chartBox}>
              {chartData.length === 0 ? (
                <p className={styles.emptyChartText}>NO SALES DATA AVAILABLE YET</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
                      itemStyle={{ color: '#ff3e00' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ff3e00" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#ff3e00' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}

      {/* ONLY THE SPINNER ANIMATION REMAINS HERE */}
      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}