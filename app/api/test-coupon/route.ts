import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    await Coupon.findOneAndUpdate(
      { code: "FLAT30" },
      {
        code: "FLAT30",
        discountType: "fixed",
        discountValue: 30,
        minOrderValue: 0,
        isActive: true
      },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, message: "Coupon FLAT30 seeded." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
