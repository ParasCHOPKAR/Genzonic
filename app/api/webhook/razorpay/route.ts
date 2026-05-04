import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// This tells Next.js to not cache this route
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // 1. VERIFY THE SIGNATURE
    // The secret should be the same one you set in your Razorpay Dashboard
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing in .env");
      return NextResponse.json({ message: "Secret missing" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay Signature detected");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // 2. PARSE THE DATA
    const event = JSON.parse(body);

    // We only care about successful payments
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      // Extract the order details we sent in 'notes' during checkout
      const { 
        orderId, 
        userEmail, 
        items, 
        shippingInfo 
      } = payment.notes;

      await connectDB();

      // 3. CHECK IF ORDER ALREADY EXISTS (Prevents duplicates)
      const existingOrder = await Order.findOne({ razorpayPaymentId: payment.id });
      
      if (!existingOrder) {
        // 4. CREATE THE ORDER PERMANENTLY
        await Order.create({
          orderItems: JSON.parse(items), // Convert back from string
          shippingInfo: JSON.parse(shippingInfo),
          totalAmount: payment.amount / 100, // Convert paisa to Rupees
          userEmail: userEmail,
          razorpayPaymentId: payment.id,
          razorpayOrderId: payment.order_id,
          status: "Processing",
          paymentStatus: "Paid",
        });

        console.log(`✅ Webhook: Order saved for ${userEmail}`);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error: any) {
    console.error("RAZORPAY WEBHOOK ERROR:", error.message);
    return NextResponse.json({ message: "Webhook Error" }, { status: 500 });
  }
}