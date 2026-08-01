"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingButtons from "@/components/FloatingButtons/FloatingButtons";

// Routes where Footer / floating chrome should be hidden (Navbar always shows)
const HIDE_FOOTER_ROUTES = ["/customizer"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = HIDE_FOOTER_ROUTES.some(r => pathname?.startsWith(r));

  return (
    <>
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
      {!hideFooter && <ThemeToggle />}
      {!hideFooter && <FloatingButtons />}
    </>
  );
}
