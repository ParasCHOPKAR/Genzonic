import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// 🔥 THIS IS CRITICAL: Forces Vercel to NEVER cache this file, always fetch fresh Env Variables
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("FETCH USER ORDERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // ==========================================
    // 🚨 DEBUGGING: PRINT EXACTLY WHAT VERCEL SEES
    // ==========================================
    console.log("=== RAZORPAY ENVIRONMENT CHECK ===");
    console.log("1. NEXT_PUBLIC_RAZORPAY_KEY_ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "✅ Exists" : "❌ MISSING");
    console.log("2. RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✅ Exists" : "❌ MISSING");
    console.log("3. RAZORPAY_SECRET:", process.env.RAZORPAY_SECRET ? "✅ Exists" : "❌ MISSING");
    console.log("==================================");

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_SECRET;

    // If Vercel is still returning blank keys, stop here and tell us exactly what's wrong.
    if (!key_id || !key_secret) {
      throw new Error("CRITICAL VERCEL ERROR: One or more Razorpay API keys are missing in Vercel Environment Variables.");
    }

    // Initialize Razorpay securely
    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const body = await req.json();
    const { userEmail, shippingInfo, orderItems, subtotal, gstAmount, deliveryCharge, totalAmount } = body;

    if (!totalAmount || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userEmail,
      shippingInfo,
      orderItems,
      subtotal,
      gstAmount,
      deliveryCharge,
      totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      status: "Processing",
    });

    const options = {
      amount: Math.round(totalAmount * 100), 
      currency: "INR",
      receipt: newOrder._id.toString(),
      notes: {
        subtotal: subtotal,
        gst: gstAmount,
        shipping: deliveryCharge
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    newOrder.paymentResult = { razorpay_order_id: razorpayOrder.id };
    await newOrder.save();

    return NextResponse.json({ 
      success: true, 
      amount: razorpayOrder.amount, 
      rzpOrderId: razorpayOrder.id 
    });

  } catch (error: any) {
    console.error("RAZORPAY CRASH:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Order creation failed" },
      { status: 500 }
    );
  }   
}