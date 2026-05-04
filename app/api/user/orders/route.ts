import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    // 1. Verify the user is logged in securely on the server
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" }, 
        { status: 401 }
      );
    }

    // 2. Connect to the database
    await connectDB();

    // 3. Fetch orders matching this user's email, sorted by newest first
    const orders = await Order.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 }) // -1 gives us newest orders first
      .populate("orderItems.product"); // Optional: if you need deep product data later

    return NextResponse.json({ success: true, orders });
    
  } catch (error) {
    console.error("FAILED TO FETCH USER ORDERS:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching vault" }, 
      { status: 500 }
    );
  }
}