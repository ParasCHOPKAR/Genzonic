"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { ArrowRight, Check } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Newsletter() {
  const sectionRef = useRef(null)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".newsletter-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus("loading")
    // Simulate network request
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1500)
  }

  return (
    <section ref={sectionRef} className="newsletter-section">
      <div className="container">
        
        <div className="newsletter-content">
          <div className="text-col">
            <span className="tag">[ JOIN_THE_NETWORK ]</span>
            <h2 className="title">ACCESS <br/> THE ARCHIVE</h2>
            <p className="description">
              Subscribe to unlock early access to new drops, exclusive artifacts, and secret collections. No spam, just signal.
            </p>
          </div>

          <div className="form-col">
            <form onSubmit={handleSubmit} className="subscribe-form">
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL ADDRESS" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status !== "idle"}
                />
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${status}`}
                disabled={status !== "idle"}
              >
                <span className="btn-text">
                  {status === "idle" && "SUBSCRIBE"}
                  {status === "loading" && "PROCESSING..."}
                  {status === "success" && "VERIFIED"}
                </span>
                <span className="btn-icon">
                  {status === "success" ? <Check size={18} /> : <ArrowRight size={18} />}
                </span>
              </button>
            </form>
            
            {status === "success" && (
              <p className="success-msg">Welcome to the network. Check your inbox.</p>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        .newsletter-section {
          padding: 120px 5%;
          background: #000;
          color: #fff;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .newsletter-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 80px;
          background: #111;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 20px;
        }

        .title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -2px;
          margin: 0 0 20px 0;
        }

        .description {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 400px;
        }

        .form-col {
          width: 100%;
        }

        .subscribe-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        input {
          width: 100%;
          padding: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          outline: none;
          transition: all 0.3s;
          border-radius: 4px;
        }

        input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        input:focus {
          border-color: #fff;
          background: rgba(255,255,255,0.08);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: #fff;
          color: #000;
          border: none;
          cursor: pointer;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255,255,255,0.1);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn.loading {
          background: rgba(255,255,255,0.7);
          cursor: wait;
        }

        .submit-btn.success {
          background: #4caf50;
          color: #fff;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .submit-btn:hover .btn-icon {
          transform: translateX(5px);
        }

        .success-msg {
          margin-top: 15px;
          font-size: 12px;
          font-weight: 700;
          color: #4caf50;
          letter-spacing: 1px;
        }

        @media (max-width: 1024px) {
          .newsletter-content {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 50px;
          }
          .description { max-width: 100%; }
        }

        @media (max-width: 600px) {
          .newsletter-section { padding: 80px 5%; }
          .newsletter-content { padding: 40px 20px; }
          .title { font-size: 2.2rem; }
        }
      `}</style>
    </section>
  )
}
