import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 1. Extract the base number sent from your frontend checkout
    const subtotal = body.subtotal || 0;

    // 🔥 2. Perform the exact same mathematical calculations on the SERVER
    // This strictly prevents anyone from tampering with the final price in the browser.
    const deliveryCharge = 25;
    
    // Calculate the final total in standard Rupees
    const finalTotalInRupees = subtotal + deliveryCharge;

    // 🔥 3. Razorpay requires the amount in PAISE (multiply by 100)
    const amountInPaise = finalTotalInRupees * 100;

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
