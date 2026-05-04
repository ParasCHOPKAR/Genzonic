"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

// Tells TypeScript that window.Razorpay exists
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [addressType, setAddressType] = useState("Home");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true); // 🔄 Starts the spinning loader

    const formData = new FormData(e.currentTarget);
    const shippingInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      altPhone: formData.get("altPhone"),
      pinCode: formData.get("pinCode"),
      address: formData.get("address"),
      area: formData.get("area"),
      landmark: formData.get("landmark"),
      city: formData.get("city"),
      state: formData.get("state"),
      addressType: addressType,
    };

    const orderData = {
      userEmail: shippingInfo.email,
      shippingInfo,
      orderItems: cart,
      totalAmount: total,
    };

    try {
      // 1. Send data to backend to create a Pending MongoDB Order & Razorpay ID
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to initialize payment.");
        setIsProcessing(false);
        return;
      }

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_SfR9dfwd9euBsW",
        amount: data.amount,
        currency: "INR",
        name: "GenZonic",
        description: "Premium Artifact Dispatch",
        image: "/favicon.ico", 
        order_id: data.rzpOrderId, 
        
        // 3. User successfully paid! 
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart(); 
              // 🔥 THE MAGIC FIX: Redirect to the success page with the Order ID! 🔥
              // We use data.rzpOrderId because that's what your backend sent back in step 1.
              window.location.href = `/checkout/success?orderId=${data.rzpOrderId}`; 
            } else {
              alert("Payment Verification Failed. Contact Support.");
              setIsProcessing(false); // Stops the spinner
            }
          } catch (err) {
            alert("Error verifying payment.");
            setIsProcessing(false); // Stops the spinner
          }
        },
        
        // 4. FIX: If user closes the modal without paying, stop the spinner!
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#ffc107", 
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed or was cancelled.");
        setIsProcessing(false); // Stops the spinner
      });

    } catch (error) {
      console.error(error);
      setIsProcessing(false); // Stops the spinner
    }
  };

  return (
    <>
      {/* Load Razorpay Script globally */}
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="checkout-page">
        <h1 className="title">SECURE DISPATCH</h1>

        <div className="checkout-grid">
          <form className="shipping-form" onSubmit={handlePayment}>
            <h2 className="section-label">01 // CONTACT LOGISTICS</h2>
            <div className="grid-inputs">
              <div className="input-group half"><label>FIRST NAME *</label><input name="firstName" type="text" required /></div>
              <div className="input-group half"><label>LAST NAME *</label><input name="lastName" type="text" required /></div>
              <div className="input-group full"><label>EMAIL ADDRESS *</label><input name="email" type="email" required /></div>
              
              <div className="input-group half"><label>MOBILE NUMBER *</label>
                <div className="phone-wrapper"><span className="prefix">+91</span>
                  <input name="phone" type="tel" required maxLength={10} minLength={10} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} />
                </div>
              </div>
              <div className="input-group half"><label>ALTERNATIVE NUMBER</label>
                <div className="phone-wrapper"><span className="prefix">+91</span>
                  <input name="altPhone" type="tel" maxLength={10} minLength={10} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} />
                </div>
              </div>
            </div>

            <h2 className="section-label">02 // SHIPPING DESTINATION</h2>
            <div className="grid-inputs">
              <div className="input-group full"><label>COUNTRY *</label><input type="text" value="INDIA 🇮🇳" disabled className="disabled-input" /></div>
              <div className="input-group full"><label>PIN CODE / POSTAL CODE *</label><input name="pinCode" type="text" required /></div>
              <div className="input-group full"><label>FLAT NO / BUILDING / STREET NAME *</label><input name="address" type="text" required /></div>
              <div className="input-group full"><label>AREA / LOCALITY *</label><input name="area" type="text" required /></div>
              <div className="input-group full"><label>LANDMARK</label><input name="landmark" type="text" /></div>
              <div className="input-group half"><label>CITY *</label><input name="city" type="text" required /></div>
              <div className="input-group half"><label>STATE *</label><input name="state" type="text" required /></div>

              <div className="input-group full"><label>SAVE ADDRESS AS</label>
                <div className="type-selector">
                  {["Home", "Office", "Other"].map((type) => (
                    <button key={type} type="button" className={`type-btn ${addressType === type ? "active" : ""}`} onClick={() => setAddressType(type)}>{type}</button>
                  ))}
                </div>
              </div>
            </div>
            
            <h2 className="section-label" style={{marginTop: "40px"}}>03 // AUTHORIZATION</h2>
            
            <button type="submit" className="pay-btn" disabled={isProcessing}>
              {isProcessing ? <><Loader2 className="animate-spin" size={20} /> INITIALIZING GATEWAY...</> : `PAY WITH UPI / CARD — ₹${total}`}
            </button>
            
            <p className="notice"><ShieldCheck size={14} color="#22c55e" /> 256-bit SSL Encrypted Transaction</p>
          </form>

          {/* RIGHT: MANIFEST (STICKY) */}
          <div className="order-manifest-wrapper">
            <div className="order-manifest">
              <h2 className="section-label">ORDER MANIFEST</h2>
              <div className="manifest-items">
                {cart.map((item) => (
                  <div key={item.id + item.size} className="mini-card">
                    <div className="img-box"><Image src={item.image} alt="" fill style={{objectFit:"cover"}} /></div>
                    <div className="info"><p className="n">{item.name}</p><p className="s">SIZE: {item.size} / QTY: {item.quantity}</p></div>
                    <p className="p">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="manifest-footer">
                <div className="line"><span>SUBTOTAL</span><span>₹{total}</span></div>
                <div className="line"><span>SHIPPING</span><span className="green">COMPLIMENTARY</span></div>
                <div className="line grand"><span>TOTAL DUE</span><span>₹{total}</span></div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .checkout-page { padding: 140px 5% 100px; background: var(--bg); color: var(--text); min-height: 100vh; max-width: 1300px; margin: 0 auto; font-family: 'Inter', sans-serif; transition: 0.3s; }
          .title { font-size: clamp(32px, 5vw, 48px); font-weight: 900; letter-spacing: -2px; text-align: center; margin-bottom: 60px; text-transform: uppercase; }
          .checkout-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 60px; align-items: start; }
          
          .section-label { font-size: 12px; font-weight: 900; letter-spacing: 3px; opacity: 0.5; margin-bottom: 25px; margin-top: 20px; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 10px; }
          .grid-inputs { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
          .input-group { display: flex; flex-direction: column; gap: 8px; }
          .full { width: 100%; }
          .half { width: calc(50% - 10px); }
          label { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #888; }
          
          input { background: rgba(128,128,128,0.03); border: 1px solid rgba(128,128,128,0.2); padding: 16px; color: var(--text); font-weight: 700; font-size: 13px; outline: none; transition: 0.2s; border-radius: 4px; }
          input:focus { border-color: var(--text); background: transparent; }
          .disabled-input { background: rgba(128,128,128,0.1); cursor: not-allowed; font-weight: 900; opacity: 0.7; }

          .phone-wrapper { display: flex; align-items: center; background: rgba(128,128,128,0.03); border: 1px solid rgba(128,128,128,0.2); border-radius: 4px; transition: 0.2s; }
          .phone-wrapper:focus-within { border-color: var(--text); background: transparent; }
          .prefix { padding: 16px 0 16px 16px; font-weight: 900; color: #888; font-size: 13px; }
          .phone-wrapper input { border: none; background: transparent; padding-left: 10px; flex: 1; }
          
          .type-selector { display: flex; gap: 10px; }
          .type-btn { flex: 1; padding: 14px; background: transparent; border: 1px solid rgba(128,128,128,0.3); color: var(--text); font-weight: 800; font-size: 12px; cursor: pointer; transition: 0.2s; border-radius: 4px; }
          .type-btn.active { background: #ffc107; color: #0f172a; border-color: #ffc107; }

          .pay-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 24px; background: #ffc107; color: #0f172a; border: none; font-weight: 900; font-size: 16px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; border-radius: 8px; box-shadow: 0 6px 0px rgba(255, 193, 7, 0.4); }
          .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(255, 193, 7, 0.3); background: #ffb300; }
          .pay-btn:disabled { opacity: 0.7; cursor: not-allowed; box-shadow: none; transform: translateY(4px); }
          
          .notice { font-size: 11px; color: #888; text-align: center; margin-top: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; }

          .order-manifest-wrapper { position: relative; height: 100%; }
          .order-manifest { position: sticky; top: 120px; background: var(--bg); padding: 35px; border-radius: 8px; border: 2px solid var(--text); box-shadow: 8px 8px 0px var(--text); }
          :global(.dark) .order-manifest { box-shadow: 6px 6px 0px rgba(255,255,255,0.2); }

          .manifest-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; max-height: 40vh; overflow-y: auto; padding-right: 10px; }
          .manifest-items::-webkit-scrollbar { width: 4px; }
          .manifest-items::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
          .mini-card { display: flex; align-items: center; gap: 15px; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 15px; }
          .img-box { position: relative; width: 55px; height: 75px; background: rgba(128,128,128,0.1); border-radius: 4px; overflow: hidden; flex-shrink: 0; }
          .info { flex: 1; }
          .n { font-size: 13px; font-weight: 800; margin: 0; text-transform: uppercase; line-height: 1.2; }
          .s { font-size: 10px; color: #888; margin: 5px 0 0 0; font-weight: 700; }
          .p { font-weight: 900; font-size: 14px; }
          .manifest-footer { border-top: 1px dashed rgba(128,128,128,0.3); padding-top: 20px; }
          .line { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; margin-bottom: 12px; }
          .green { color: #22c55e; }
          .grand { font-size: 22px; font-weight: 900; margin-top: 20px; border-top: 1px solid rgba(128,128,128,0.1); padding-top: 20px; }

          @media (max-width: 1000px) { 
            .checkout-grid { grid-template-columns: 1fr; } 
            .half { width: 100%; } 
            .order-manifest { position: relative; top: 0; }
          }
        `}</style>
      </div>
    </>
  );
}