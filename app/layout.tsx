import "./globals.css";
import Loader from "@/components/Loader/Loader";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingButtons from "@/components/FloatingButtons/FloatingButtons";
import Script from "next/script";
import { Providers } from "./providers";


export const metadata = {
  title: "GenZonic",
  description: "Premium Gen-Z Streetwear Brand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>

        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <Providers>
          {/* 1. Put the Loader here as a standalone component! */}
          <Loader />

          {/* 2. The rest of your app renders normally in the background */}
          <Navbar />
          {children}
          <Footer />

          {/* Global UI */}
          <ThemeToggle />
          <FloatingButtons />
        </Providers>

      </body>
    </html>
  );
}