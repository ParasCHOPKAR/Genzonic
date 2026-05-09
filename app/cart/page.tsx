"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // 🔥 1. Imported NextAuth session hook
import { X, ArrowLeft, ShieldCheck, Truck, RefreshCw, Ticket, Check, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter(); 
  const { status } = useSession(); // 🔥 2. Grab the user's login status
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "GENZONIC10") {
      setDiscount(Math.floor(subtotal * 0.10));
      setIsApplied(true);
    } else {
      alert("INVALID CODE. ACCESS DENIED.");
    }
  };

  const total = subtotal - discount;

  // 🔥 3. The Secure Checkout Handler
  const handleCheckout = () => {
    if (status === "loading") return; // Wait a split second if NextAuth is still checking
    
    if (status === "unauthenticated") {
      // If not logged in, send them to login. 
      // We pass the callbackUrl so they come straight back to checkout after signing in!
      router.push("/login?callbackUrl=/checkout"); 
    } else {
      // If logged in, proceed normally
      router.push("/checkout");
    }
  };

  if (cart.length === 0) return (
    <div className="empty-state">
      <h2 className="glitch">MANIFEST EMPTY</h2>
      <Link href="/shop/men" className="return-link">RETURN TO ARCHIVE</Link>
      <style jsx>{`
        .empty-state { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); color: var(--text); }
        .glitch { font-size: 40px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; }
        .return-link { margin-top: 20px; padding: 15px 30px; border: 2px solid var(--text); text-decoration: none; color: var(--text); font-weight: 900; letter-spacing: 1px; transition: 0.3s; }
        .return-link:hover { background: var(--text); color: var(--bg); transform: translateY(-3px); }
      `}</style>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-header">
          <div className="header-top">
            <h1 className="title">YOUR CART <span className="count">[{cart.length}]</span></h1>
            <Link href="/shop/men" className="continue-link"><ArrowLeft size={16}/> CONTINUE SHOPPING</Link>
          </div>
        </header>

        <div className="cart-grid">
          {/* PRODUCT LISTING */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id + item.size} className="item-card">
                <div className="item-img">
                  <Image src={item.image} alt="" fill style={{objectFit:"cover"}} />
                </div>
                <div className="item-details">
                  <div className="item-top">
                    <h3 className="item-name">{item.name}</h3>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id, item.size)}><X size={20}/></button>
                  </div>
                  <p className="item-meta">SIZE: <span className="highlight">{item.size}</span></p>
                  <div className="item-bottom">
                    <div className="qty-control">
                      <button onClick={() => decreaseQty(item.id, item.size)}>-</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id, item.size)}>+</button>
                    </div>
                    <p className="item-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SIDEBAR */}
          <div className="sidebar">
            <div className="summary-box">
              <h2 className="summary-title">ORDER SUMMARY</h2>
              
              <div className="summary-row"><span>SUBTOTAL</span><span>₹{subtotal}</span></div>
              <div className="summary-row"><span className="orange-text">SHIPPING</span><span className="orange-text">COMPLIMENTARY</span></div>
              
              {isApplied && (
                <div className="summary-row discount">
                  <span>VIP DISCOUNT</span>
                  <span className="orange-text">-₹{discount}</span>
                </div>
              )}

              <div className="total-row">
                <span>TOTAL DUE</span>
                <span>₹{total}</span>
              </div>

              {/* MODERN COUPON BOX */}
              <div className="coupon-container">
                <div className="coupon-input-wrapper">
                  <Ticket size={18} className="ticket-icon"/>
                  <input 
                    placeholder="COUPON CODE" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={isApplied}
                  />
                  <button onClick={handleApplyCoupon} className="apply-btn">
                    {isApplied ? <Check size={20}/> : "APPLY"}
                  </button>
                </div>
              </div>

              {/* 🔥 4. Guarded Checkout Button 🔥 */}
              <button 
                onClick={handleCheckout} 
                className="pay-now-btn"
              >
                <span>PAY NOW</span>
                <ArrowRight size={22} strokeWidth={3} />
              </button>

              <div className="trust-badges">
                <div className="badge-item"><ShieldCheck size={14}/> <span>SECURE CHECKOUT</span></div>
                <div className="badge-item"><RefreshCw size={14}/> <span>EASY REPLACEMENT</span></div>
                <div className="badge-item"><Truck size={14}/> <span>FAST DISPATCH</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page { padding: 120px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; font-family: 'Inter', sans-serif; transition: background 0.3s ease, color 0.3s ease; }
        .container { max-width: 1300px; margin: 0 auto; }
        
        /* Header Styling */
        .cart-header { margin-bottom: 40px; border-bottom: 2px solid var(--text); padding-bottom: 20px; }
        .title { font-size: clamp(28px, 4vw, 36px); font-weight: 900; letter-spacing: -1px; margin: 0; }
        .count { color: #ff3e00; }
        .continue-link { font-size: 12px; font-weight: 800; text-decoration: none; color: #888; display: flex; align-items: center; gap: 8px; margin-top: 10px; transition: 0.2s; }
        .continue-link:hover { color: var(--text); }

        .cart-grid { display: grid; grid-template-columns: 1fr 420px; gap: 50px; }

        /* Item Cards */
        .item-card { display: flex; gap: 20px; padding: 20px; background: transparent; border: 1px solid rgba(128,128,128,0.2); margin-bottom: 15px; border-radius: 8px; transition: 0.3s; }
        .item-card:hover { border-color: var(--text); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        :global(.dark) .item-card:hover { box-shadow: 0 10px 30px rgba(255,255,255,0.02); }
        
        .item-img { position: relative; width: 100px; aspect-ratio: 3/4; background: rgba(128,128,128,0.05); border-radius: 4px; overflow: hidden; }
        .item-details { flex: 1; display: flex; flex-direction: column; }
        .item-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .item-name { font-size: 16px; font-weight: 800; text-transform: uppercase; margin: 0; line-height: 1.2; }
        .remove-btn { background: none; border: none; color: #888; cursor: pointer; transition: 0.2s; }
        .remove-btn:hover { color: #ff3e00; }
        .item-meta { font-size: 11px; font-weight: 700; color: #888; margin: 5px 0 15px; }
        .highlight { color: var(--text); }
        
        .item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .qty-control { display: flex; align-items: center; background: rgba(128,128,128,0.05); border: 1px solid rgba(128,128,128,0.1); border-radius: 6px; padding: 2px; }
        .qty-control button { width: 30px; height: 30px; border: none; background: none; font-weight: 900; color: var(--text); cursor: pointer; border-radius: 4px; transition: 0.2s; }
        .qty-control button:hover { background: var(--text); color: var(--bg); }
        .qty-num { width: 30px; text-align: center; font-size: 13px; font-weight: 900; }
        .item-price { font-size: 18px; font-weight: 900; }

        /* Sidebar & Summary */
        .summary-box { position: sticky; top: 120px; background: var(--bg); border: 2px solid var(--text); padding: 35px; border-radius: 12px; box-shadow: 8px 8px 0px var(--text); transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; }
        :global(.dark) .summary-box { box-shadow: 6px 6px 0px rgba(255,255,255,0.2); }

        .summary-title { font-size: 14px; font-weight: 900; letter-spacing: 2px; margin-bottom: 25px; }
        .summary-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
        .orange-text { color: #ff3e00; }
        .total-row { border-top: 1px dashed rgba(128,128,128,0.3); margin-top: 20px; padding-top: 20px; display: flex; justify-content: space-between; font-size: 24px; font-weight: 900; letter-spacing: -1px; }

        /* Coupon Box */
        .coupon-container { margin: 25px 0; }
        .coupon-input-wrapper { display: flex; align-items: center; border: 1px solid rgba(128,128,128,0.3); border-radius: 8px; padding: 0 15px; transition: 0.2s; background: rgba(128,128,128,0.02); }
        .coupon-input-wrapper:focus-within { border-color: var(--text); background: transparent; }
        .ticket-icon { color: #888; }
        .coupon-input-wrapper input { flex: 1; padding: 14px; background: none; border: none; outline: none; font-weight: 800; font-size: 12px; color: var(--text); }
        .apply-btn { background: none; border: none; color: #ff3e00; font-weight: 900; cursor: pointer; padding-left: 10px; }

        /* YELLOW PAY NOW BUTTON */
        .pay-now-btn { 
          display: flex !important; 
          align-items: center !important; 
          justify-content: space-between !important; 
          width: 100% !important; 
          padding: 22px 24px !important; 
          background: #ffc107 !important; 
          color: #000 !important; 
          border: none !important;
          font-weight: 900 !important; 
          font-size: 18px !important; 
          letter-spacing: 3px !important;
          text-transform: uppercase !important; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.35) !important;
          margin-bottom: 30px !important;
        }
        .pay-now-btn:hover { 
          transform: translateY(-4px) !important; 
          background: #ffb300 !important; 
          box-shadow: 0 14px 32px rgba(255, 193, 7, 0.5) !important; 
        }
        .pay-now-btn:active {
          transform: translateY(2px) !important;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4) !important;
        }

        .trust-badges { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid rgba(128,128,128,0.2); padding-top: 20px; }
        .badge-item { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; color: #888; }

        @media (max-width: 1100px) { 
          .cart-grid { grid-template-columns: 1fr; } 
          .sidebar { margin-top: 40px; }
          .summary-box { position: relative; top: 0; }
        }
      `}</style>
    </div>
  );
}