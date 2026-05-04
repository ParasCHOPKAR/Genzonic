"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Loader2 } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { useSession } from "next-auth/react"; // 🔥 Security Hooks Added
import { useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme(); 
  
  // 🔥 Pull the active session data
  const { data: session, status } = useSession();

  // 🔥 Security Check: Kick unauthorized users back to the homepage
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); 
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/"); 
    }
  }, [status, session, router]);

  // Show a loading state while NextAuth verifies the admin credentials
  if (status === "loading") {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg)", color: "var(--text)" }}>
        <Loader2 className="spinner" size={40} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Prevent the layout from rendering if they aren't an admin
  if (!session || session.user?.role !== "admin") {
    return null; 
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <h2 className={styles.logo}>GenZonic <span className={styles.adminTag}>ADMIN</span></h2>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === "/admin" ? styles.active : ""}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/products" className={`${styles.navLink} ${pathname.includes("/admin/products") ? styles.active : ""}`}>
            <Package size={18} /> Products
          </Link>
          <Link href="/admin/orders" className={`${styles.navLink} ${pathname.includes("/admin/orders") ? styles.active : ""}`}>
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link href="/admin/users" className={`${styles.navLink} ${pathname.includes("/admin/users") ? styles.active : ""}`}>
            <Users size={18} /> Users
          </Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>

    </div>
  );
}