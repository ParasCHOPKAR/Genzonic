import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from "crypto";
import nodemailer from "nodemailer"; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    // 🔥 Pulling your fresh secret (Note: best practice is process.env.RAZORPAY_SECRET)
    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "YF0u2TI6qwBp5PlRL7YeSTJf";

    // Securely hash the data using the secret key to verify authenticity
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 1. Create the order from scratch now that payment is successful
      const updatedOrder = await Order.create({
        ...orderData,
        isPaid: true,
        paidAt: new Date(),
        status: "Processing",
        paymentStatus: "Paid", 
        paymentMethod: "Razorpay",
        paymentResult: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }
      });

      // 2. Send the beautiful branded email receipt!
      if (updatedOrder && updatedOrder.userEmail) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Create a dynamic list of items for the email
        const itemsHtml = updatedOrder.orderItems.map((item: any) => `
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #475569; padding: 12px 0;">
            <span style="color: #cbd5e1; font-size: 13px;">${item.quantity}x ${item.name} <br/><small style="color:#64748b;">SIZE: ${item.size}</small></span>
            <span style="color: #fff; font-weight: bold;">₹${item.price * item.quantity}</span>
          </div>
        `).join('');

        const firstName = updatedOrder.shippingInfo?.firstName || "VIP";

        // Send the upgraded email
        await transporter.sendMail({
          from: `"GenZonic Dispatch" <${process.env.EMAIL_USER}>`,
          to: updatedOrder.userEmail,
          subject: "ORDER CONFIRMED // GENZONIC ARTIFACT SECURED",
          html: `
            <div style="background-color: #0f172a; color: #ffffff; font-family: 'Courier New', Courier, monospace; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffc107; font-weight: 900; letter-spacing: 2px; margin-bottom: 10px;">GENZONIC</h1>
              <p style="font-size: 12px; letter-spacing: 4px; opacity: 0.6; margin-top: 0;">PREMIUM STREETWEAR</p>
              
              <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 30px; max-width: 500px; margin: 40px auto; text-align: left;">
                <h2 style="margin-top: 0; font-size: 16px; letter-spacing: 1px;">ARTIFACT SECURED.</h2>
                <p style="font-size: 14px; opacity: 0.8; line-height: 1.6;">
                  Welcome to the elite, ${firstName}. Your payment has been verified and your artifact is being prepared for dispatch.
                </p>
                
                <div style="margin: 30px 0; border-top: 1px dashed #475569; border-bottom: 1px dashed #475569; padding: 20px 0;">
                  <p style="margin: 5px 0; font-size: 12px; color: #94a3b8;">MANIFEST ID:</p>
                  <p style="margin: 0; font-size: 18px; font-weight: bold; font-family: monospace;">${updatedOrder._id.toString().slice(-8).toUpperCase()}</p>
                  
                  <div style="margin: 25px 0;">
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 800; letter-spacing: 2px; margin-bottom: 10px;">ACQUIRED ARTIFACTS</p>
                    ${itemsHtml}
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                     <p style="margin: 15px 0 5px 0; font-size: 12px; color: #94a3b8;">TOTAL AUTHORIZED:</p>
                     <p style="margin: 0; font-size: 18px; font-weight: bold; color: #22c55e;">₹${updatedOrder.totalAmount}</p>
                  </div>
                </div>

                <p style="font-size: 12px; opacity: 0.6;">You can track your dispatch status by logging into your Profile Vault.</p>
              </div>
              
              <p style="font-size: 10px; opacity: 0.4; letter-spacing: 1px;">© 2026 GENZONIC INDIA. SECURE TRANSMISSION.</p>
            </div>
          `,
        });
      }

      return NextResponse.json({ success: true, message: "Payment verified & Receipt Sent" }, { status: 200 });
    } else {
      console.log("❌ SIGNATURE MISMATCH ❌");
      console.log("Expected:", expectedSignature);
      console.log("Received:", razorpay_signature);
      return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("VERIFICATION ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}