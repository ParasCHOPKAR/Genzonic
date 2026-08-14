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
    const { userEmail, shippingInfo, orderItems, subtotal, deliveryCharge, totalAmount } = body;

    if (!totalAmount || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
    }

    // The order is NOT created in the database here anymore.
    // It will be created only upon successful payment verification.

    // 🔥 AUTOMATICALLY SAVE ADDRESS TO PROFILE
    try {
      const Profile = (await import("@/models/Profile")).default;
      let profile = await Profile.findOne({ userEmail });
      
      const newAddress = {
        fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
        phone: shippingInfo.phone,
        pinCode: shippingInfo.pinCode,
        city: shippingInfo.city,
        state: shippingInfo.state,
        streetAddress: `${shippingInfo.address}, ${shippingInfo.area}${shippingInfo.landmark ? ', ' + shippingInfo.landmark : ''}`,
        isDefault: profile ? profile.addresses.length === 0 : true
      };

      if (profile) {
        // Check for duplicates
        const isDuplicate = profile.addresses.some((a: any) => 
          a.streetAddress === newAddress.streetAddress && a.pinCode === newAddress.pinCode
        );
        if (!isDuplicate) {
          profile.addresses.push(newAddress);
          await profile.save();
        }
      } else {
        await Profile.create({
          userEmail,
          addresses: [newAddress]
        });
      }
    } catch (profileError) {
      console.error("Failed to auto-save address to profile:", profileError);
    }

    const options = {
      amount: Math.round(totalAmount * 100), 
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        subtotal: subtotal,
        shipping: deliveryCharge
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);


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