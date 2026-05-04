"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ================= SEND OTP ================= */
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Notice we are ONLY sending the email now!
        body: JSON.stringify({ email }), 
      });

      const data = await res.json();
      
      if (data.success) {
        setStep(2);
        setMsg(""); // Clear messages on success
      } else {
        setMsg(data.message || "Error sending OTP");
      }
    } catch (error) {
      console.error(error);
      setMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMsg("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      // 1. Verify with your database
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        // 2. Tell NextAuth to log the user in
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: email,
        });

        if (signInResult?.ok) {
          window.location.href = "/"; // Teleport to homepage on success!
        } else {
          setMsg("Authentication session failed.");
          setLoading(false);
        }
      } else {
        setMsg(data.message || "Invalid OTP");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMsg("Server error verifying OTP.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="brand-side">
          <h1 className="brand-title">GenZonic</h1>
          <p className="brand-subtitle">Tap into evolution</p>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="form-side">
          <h2 className="form-heading">Login / Signup</h2>
          
          {step === 1 ? (
            /* STEP 1: EMAIL INPUT */
            <form onSubmit={handleRequestOTP} className="auth-form">
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              {msg && <p className="error-msg">{msg}</p>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <Loader2 className="spinner" size={18} /> : "Continue"}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP INPUT */
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <p className="otp-message">We sent a secure code to <strong>{email}</strong></p>
              
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                  className="otp-input"
                  required
                />
              </div>

              {msg && <p className="error-msg">{msg}</p>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <Loader2 className="spinner" size={18} /> : "Verify & Login"}
              </button>
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => { setStep(1); setOtp(""); setMsg(""); }}
                disabled={loading}
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 20px;
        }

        .login-card {
          display: flex;
          background: #ffffff;
          width: 100%;
          max-width: 900px;
          min-height: 500px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          overflow: hidden;
          color: #000;
        }

        .brand-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          border-right: 1px solid rgba(0,0,0,0.05);
        }
        .brand-title {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: -1px;
          margin: 0 0 10px 0;
        }
        .brand-subtitle {
          font-size: 16px;
          color: #666;
          font-weight: 500;
          margin: 0;
        }

        .form-side {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-heading {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 40px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .input-group input {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 1px solid #ccc;
          font-size: 14px;
          outline: none;
          transition: 0.3s;
          background: transparent;
        }
        .input-group input:focus {
          border-bottom-color: #000;
        }
        
        .otp-input {
          letter-spacing: 4px;
          font-size: 18px !important;
          font-weight: 700;
        }

        .otp-message {
          font-size: 12px;
          color: #666;
          margin-bottom: -10px;
        }

        .error-msg {
          color: #ff3333;
          font-size: 12px;
          font-weight: 600;
          margin: -10px 0 0 0;
        }

        .submit-btn {
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #000;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-btn {
          background: transparent;
          border: none;
          color: #666;
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
          margin-top: -10px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .login-card { flex-direction: column; min-height: auto; }
          .brand-side { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.05); padding: 40px; text-align: center; }
          .form-side { padding: 40px; }
        }
      `}</style>
    </div>
  );
}