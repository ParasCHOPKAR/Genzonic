"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

// A sub-component to handle the URL parameters
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // 1. Kick off the GSAP Animations
    const tl = gsap.timeline();

    tl.fromTo(
      ".success-icon",
      { scale: 0, opacity: 0, rotation: -45 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.5)" }
    )
      .fromTo(
        ".success-title",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".success-text",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".order-card",
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".action-buttons",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.2"
      );

    // 2. Start the countdown to auto-redirect
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/profile");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="success-page">
      <div className="success-container">
        
        {/* Animated Icon */}
        <div className="icon-wrapper success-icon">
          <CheckCircle2 size={64} color="#22c55e" strokeWidth={1.5} />
          <div className="pulse-ring"></div>
        </div>

        <h1 className="success-title">PAYMENT AUTHORIZED</h1>
        <p className="success-text">
          Your transaction was successful. The GenZonic dispatch team has been notified and is preparing your artifact.
        </p>

        {/* Order Details Card */}
        <div className="order-card">
          <div className="card-header">
            <span className="label">MANIFEST ID</span>
            <span className="value mono">{orderId ? orderId.slice(-8).toUpperCase() : "VERIFYING..."}</span>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="label">STATUS</span>
              <span className="value green-text">PROCESSING</span>
            </div>
            <div className="detail-row">
              <span className="label">RECEIPT</span>
              <span className="value">SENT TO EMAIL</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <Link href="/profile" className="primary-btn">
            ACCESS PROFILE VAULT <ArrowRight size={16} />
          </Link>
          <p className="redirect-text">
            Auto-redirecting in <span>{countdown}</span> seconds...
          </p>
        </div>

      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Subtle Background Grid */
        .success-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(128,128,128,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128,128,128,0.03) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          z-index: 0;
        }

        .success-container {
          max-width: 500px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        /* Icon Animation */
        .icon-wrapper {
          position: relative;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.2);
          animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
          z-index: -1;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Typography */
        .success-title {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 2px;
          margin: 0 0 15px 0;
        }

        .success-text {
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.7;
          margin: 0 0 40px 0;
          max-width: 400px;
        }

        /* Order Card */
        .order-card {
          width: 100%;
          background: rgba(128,128,128,0.03);
          border: 1px solid rgba(128,128,128,0.2);
          border-radius: 8px;
          text-align: left;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
        }

        .card-header {
          padding: 20px;
          border-bottom: 1px dashed rgba(128,128,128,0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: 0.5;
        }

        .value {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .mono { font-family: monospace; font-size: 16px; }
        .green-text { color: #22c55e; }

        /* Buttons & Actions */
        .action-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        .primary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 20px;
          background: var(--text);
          color: var(--bg);
          text-decoration: none;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 2px;
          border-radius: 4px;
          transition: 0.3s;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(128,128,128,0.1);
        }

        .redirect-text {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.5;
          margin: 0;
        }

        .redirect-text span {
          font-weight: 900;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

// Wrap the content in a Suspense boundary because we are using useSearchParams()
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text)" }}>
        <p style={{ fontWeight: 900, letterSpacing: "2px", fontSize: "12px" }}>AUTHORIZING...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}