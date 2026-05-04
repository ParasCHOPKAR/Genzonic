import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    // 1. Extract all data from the request body ONCE
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData,
      userId 
    } = await req.json();

    // 2. Verify Signature securely using your Razorpay Secret
    const secret = process.env.RAZORPAY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" }, 
        { status: 400 }
      );
    }

    // 3. Signature is valid! Connect to DB and save the order
    await connectDB();

    const newOrder = await Order.create({
      user: userId || null, // Link to the user if they are logged in, otherwise null
      userEmail: orderData.shippingAddress.email,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.cartItems,
      totalPrice: orderData.totalPrice,
      isPaid: true,
      paidAt: new Date(),
      paymentMethod: "Razorpay",
      paymentResult: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: "Processing" // Initial status for your admin dashboard
    });

    // 4. Return success and the new Order ID so the frontend can redirect
    return NextResponse.json({ success: true, orderId: newOrder._id });
    
  } catch (error) {
    console.error("VERIFICATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error during verification" }, 
      { status: 500 }
    );
  }
}