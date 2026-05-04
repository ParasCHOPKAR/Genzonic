"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCartStore();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 2000;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - subtotal;

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-state">
          <h1 className="title">YOUR CART IS EMPTY</h1>
          <p className="subtitle">Discover our latest artifacts and limited drops.</p>
          <Link href="/shop/men" className="btn-primary">
            RETURN TO ARCHIVE <ArrowRight size={16} />
          </Link>
        </div>
        <style jsx>{`
          .empty-cart-container { min-height: 70vh; display: flex; align-items: center; justify-content: center; background: var(--bg); color: var(--text); padding: 20px; }
          .empty-state { text-align: center; max-width: 400px; }
          .title { font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; text-transform: uppercase; }
          .subtitle { font-size: 14px; color: var(--text); opacity: 0.6; margin-bottom: 30px; }
          .btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--text); color: var(--bg); padding: 15px 30px; font-weight: 800; text-decoration: none; transition: 0.3s; }
          .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Link href="/shop/men" className="back-link"><ArrowLeft size={16} /> CONTINUE SHOPPING</Link>
        <h1 className="page-title">MANIFEST // {cart.length} ITEMS</h1>
      </div>

      <div className="cart-grid">
        {/* LEFT COLUMN: ITEMS */}
        <div className="cart-items">
          {/* Free Shipping Tracker */}
          <div className="shipping-tracker">
            <div className="tracker-text">
              {progress >= 100 ? (
                <span className="success"><Truck size={16} /> COMPLIMENTARY SHIPPING UNLOCKED</span>
              ) : (
                <span>ADD <strong>₹{amountLeft}</strong> TO UNLOCK COMPLIMENTARY SHIPPING</span>
              )}
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <div className="item-image">
                <Image src={item.image || "/fallback.png"} alt={item.name} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="item-details">
                <div className="item-top">
                  <h3 className="item-name">{item.name}</h3>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id, item.size)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="item-meta">
                  <span className="meta-tag">SIZE: {item.size}</span>
                </div>
                <div className="item-bottom">
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id, item.size)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id, item.size)}>+</button>
                  </div>
                  <p className="item-price">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="cart-summary">
          <h2 className="summary-title">ORDER SUMMARY</h2>
          
          <div className="summary-row">
            <span>SUBTOTAL</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>SHIPPING</span>
            <span>{progress >= 100 ? "COMPLIMENTARY" : "CALCULATED AT CHECKOUT"}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>TOTAL ESTIMATE</span>
            <span>₹{subtotal}</span>
          </div>

          <Link href="/checkout" className="checkout-btn">
            SECURE CHECKOUT <ShieldCheck size={18} />
          </Link>

          <div className="trust-badges">
            <span><ShieldCheck size={14} /> SECURE PAYMENTS</span>
            <span><Truck size={14} /> EXPRESS DELIVERY</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page { padding: 120px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; max-width: 1600px; margin: 0 auto; }
        .cart-header { margin-bottom: 40px; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text); text-decoration: none; opacity: 0.6; transition: 0.2s; margin-bottom: 15px; }
        .back-link:hover { opacity: 1; }
        .page-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin: 0; letter-spacing: -1px; text-transform: uppercase; }

        .cart-grid { display: grid; grid-template-columns: 1fr 400px; gap: 50px; align-items: start; }

        /* SHIPPING TRACKER */
        .shipping-tracker { background: rgba(128,128,128,0.05); border: 1px solid rgba(128,128,128,0.1); padding: 20px; margin-bottom: 30px; }
        .tracker-text { font-size: 12px; font-weight: 700; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .success { color: #50e3c2; display: flex; align-items: center; gap: 8px; }
        .progress-bar-bg { height: 4px; background: rgba(128,128,128,0.2); width: 100%; position: relative; }
        .progress-bar-fill { height: 100%; background: var(--text); transition: width 0.5s ease; }

        /* CART ITEMS */
        .cart-items { display: flex; flex-direction: column; gap: 20px; }
        .cart-item { display: flex; gap: 20px; border: 1px solid rgba(128,128,128,0.1); padding: 20px; transition: 0.3s; }
        .cart-item:hover { border-color: rgba(128,128,128,0.3); }
        .item-image { position: relative; width: 120px; aspect-ratio: 3/4; background: rgba(128,128,128,0.05); }
        .item-details { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .item-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .item-name { font-size: 16px; font-weight: 800; margin: 0; text-transform: uppercase; }
        .remove-btn { background: none; border: none; color: var(--text); opacity: 0.4; cursor: pointer; transition: 0.2s; }
        .remove-btn:hover { opacity: 1; color: #ff3e00; }
        .meta-tag { font-size: 11px; font-weight: 700; padding: 4px 8px; background: rgba(128,128,128,0.1); letter-spacing: 1px; }
        .item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .qty-controls { display: flex; align-items: center; border: 1px solid rgba(128,128,128,0.2); }
        .qty-controls button { background: none; border: none; width: 35px; height: 35px; font-size: 16px; cursor: pointer; color: var(--text); }
        .qty-controls span { width: 35px; text-align: center; font-size: 14px; font-weight: 700; }
        .item-price { font-size: 18px; font-weight: 900; margin: 0; }

        /* SUMMARY */
        .cart-summary { background: rgba(128,128,128,0.03); border: 1px solid rgba(128,128,128,0.1); padding: 30px; position: sticky; top: 100px; }
        .summary-title { font-size: 16px; font-weight: 900; letter-spacing: 1px; margin: 0 0 25px 0; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 15px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 15px; color: var(--text); opacity: 0.8; }
        .summary-divider { height: 1px; background: rgba(128,128,128,0.1); margin: 20px 0; }
        .summary-row.total { font-size: 18px; font-weight: 900; opacity: 1; margin-bottom: 30px; }
        
        .checkout-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 18px; background: var(--text); color: var(--bg); font-weight: 800; letter-spacing: 1px; text-decoration: none; transition: 0.3s; margin-bottom: 20px; }
        .checkout-btn:hover { background: #ff3e00; color: white; transform: translateY(-2px); }

        .trust-badges { display: flex; flex-direction: column; gap: 10px; }
        .trust-badges span { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; color: var(--text); opacity: 0.5; letter-spacing: 1px; }

        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}