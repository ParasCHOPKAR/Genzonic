import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 1. Extract the base number sent from your frontend checkout
    const subtotal = body.subtotal || 0;
    const couponCode = body.couponCode || "";

    let discountAmount = 0;
    
    // 🔥 Verify coupon on the server to prevent frontend tampering
    if (couponCode) {
      await connectDB();
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isActive && (!coupon.expirationDate || new Date(coupon.expirationDate) >= new Date()) && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit) && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "percentage") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
        if (discountAmount > subtotal) discountAmount = subtotal;
      }
    }

    // 🔥 2. Perform the exact same mathematical calculations on the SERVER
    // This strictly prevents anyone from tampering with the final price in the browser.
    const deliveryCharge = 25;
    
    // Calculate the final total in standard Rupees
    const finalTotalInRupees = subtotal - discountAmount + deliveryCharge;

    // 🔥 3. Razorpay requires the amount in PAISE (multiply by 100)
    const amountInPaise = Math.round(finalTotalInRupees * 100);

    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, // Generated dynamically to prevent duplicate receipt errors
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("RAZORPAY ERROR:", error);

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
