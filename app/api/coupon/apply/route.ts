import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code." }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code." }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: "This coupon is no longer active." }, { status: 400 });
    }

    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      return NextResponse.json({ success: false, message: "This coupon has expired." }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: "This coupon usage limit has been reached." }, { status: 400 });
    }

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json({ 
        success: false, 
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` 
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue; // Fixed amount
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({
      success: true,
      message: "Coupon applied successfully!",
      discountAmount,
      code: coupon.code
    });

  } catch (error: any) {
    console.error("COUPON APPLY ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error while applying coupon." }, { status: 500 });
  }
}
