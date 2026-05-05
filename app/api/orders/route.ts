import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

// ==========================================
// 🔥 RESTORED GET: FETCH ORDERS FOR PROFILE
// ==========================================
export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Extract the email from the URL (e.g., /api/orders?email=test@test.com)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Find all orders belonging to this email, newest first!
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("FETCH USER ORDERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// ==========================================
// POST: CREATE RAZORPAY PAYMENT (Working)
// ==========================================
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { userEmail, shippingInfo, orderItems, totalAmount } = body;

    if (!totalAmount || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
    }

    // Create the order in MongoDB
    const newOrder = await Order.create({
      userEmail,
      shippingInfo,
      orderItems,
      totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      status: "Processing",
    });

    // Ask Razorpay to generate a secure payment window
    const options = {
      amount: Math.round(totalAmount * 100), // Converts to Paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save the Razorpay Order ID to database
    newOrder.paymentResult = { razorpay_order_id: razorpayOrder.id };
    await newOrder.save();

    return NextResponse.json({ 
      success: true, 
      amount: razorpayOrder.amount, 
      rzpOrderId: razorpayOrder.id 
    });

  } catch (error) {
    console.error("RAZORPAY ORDER CREATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Order creation failed" },
      { status: 500 }
    );
  }   
}