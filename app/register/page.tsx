"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./register.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /* ✅ FIX: ONLY LOCK SCROLL TEMPORARILY */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original || "auto";
    };
  }, []);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error");
    }
  };

  return (
    <div className="premium-auth">

      {/* BACKGROUND */}
      <div className="auth-bg" />

      {/* OVERLAY */}
      <div className="auth-overlay" />

      {/* CONTENT */}
      <div className="auth-wrapper">

        <div className="auth-card">

          {/* LEFT */}
          <div className="auth-left">
            <h1>GenZonic</h1>
            <p>Tap into evolution</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="auth-form">

            <h2>Create Account</h2>

            <div className="input-group">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => router.push("/login")}>
                Login
              </span>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
}