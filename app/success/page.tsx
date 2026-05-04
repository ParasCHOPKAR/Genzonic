"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { CheckCircle, ArrowRight, Box } from "lucide-react";

// --- THE CORE SUCCESS COMPONENT ---
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const containerRef = useRef(null);
  
  // Extract the orderId from the URL (e.g., /success?orderId=12345)
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // If somehow someone lands here without an order ID, boot them back to the shop
    if (!orderId) {
      router.push("/shop");
      return;
    }

    // Premium Cinematic Reveal Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".success-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)"
      })
      .from(".reveal-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4")
      .from(".action-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, [orderId, router]);

  if (!orderId) return null; // Prevent flash before redirect

  return (
    <div className="success-wrapper" ref={containerRef}>
      <div className="success-card">
        
        <div className="success-icon">
          <CheckCircle size={60} strokeWidth={1.5} />
        </div>

        <div className="success-header">
          <span className="label reveal-text">TRANSACTION COMPLETE</span>
          <h1 className="title reveal-text">ORDER SECURED</h1>
          <p className="subtitle reveal-text">
            Your premium artifacts are currently being prepared for dispatch. 
            A confirmation has been sent to your encrypted comms (email).
          </p>
        </div>

        <div className="manifest-box reveal-text">
          <span className="manifest-label">MANIFEST ID</span>
          <span className="manifest-id">{orderId}</span>
        </div>

        <div className="action-buttons">
          {/* This will lead to our next step (Option 1) */}
          <Link href="/profile" className="btn-primary">
            VIEW VAULT <Box size={16} />
          </Link>
          
          <Link href="/shop" className="btn-secondary">
            RETURN TO ARCHIVE <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        .success-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg, #fdfdfd);
          color: var(--text, #000000);
          padding: 20px;
        }

        .success-card {
          max-width: 600px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 40px;
          background: transparent;
          border: 1px solid rgba(128, 128, 128, 0.2);
          position: relative;
          overflow: hidden;
        }

        /* Subtle cyber-grid background inside the card */
        .success-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(128, 128, 128, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.05) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        .success-icon {
          margin-bottom: 30px;
          color: var(--text);
        }

        .success-header {
          margin-bottom: 40px;
        }

        .label {
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 800;
          opacity: 0.5;
          display: block;
          margin-bottom: 15px;
        }

        .title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -1px;
          margin: 0 0 15px 0;
          line-height: 1.1;
        }

        .subtitle {
          font-size: 14px;
          line-height: 1.6;
          opacity: 0.7;
          max-width: 400px;
          margin: 0 auto;
        }

        .manifest-box {
          background: rgba(128, 128, 128, 0.05);
          border: 1px dashed rgba(128, 128, 128, 0.3);
          padding: 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 50px;
          width: 100%;
          max-width: 400px;
        }

        .manifest-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: 0.5;
        }

        .manifest-id {
          font-size: 16px;
          font-family: monospace;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          width: 100%;
          max-width: 400px;
          flex-direction: column;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 18px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--text);
          color: var(--bg);
          border: 1px solid var(--text);
        }

        .btn-primary:hover {
          background: transparent;
          color: var(--text);
        }

        .btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid rgba(128, 128, 128, 0.3);
        }

        .btn-secondary:hover {
          border-color: var(--text);
        }

        @media (min-width: 600px) {
          .action-buttons {
            flex-direction: row;
            max-width: 500px;
          }
        }
      `}</style>
    </div>
  );
}

// --- THE DEFAULT EXPORT WRAPPED IN SUSPENSE ---
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', animation: 'pulse 1.5s infinite' }}>DECRYPTING MANIFEST...</span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}