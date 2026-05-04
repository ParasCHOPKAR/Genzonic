import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 🛑 I have temporarily removed the getServerSession security lock
    // so you can fetch orders freely while testing on localhost!
    
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("ADMIN FETCH ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}