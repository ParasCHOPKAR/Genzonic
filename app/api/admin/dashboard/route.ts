import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

// Force Next.js to fetch fresh data every time you load the dashboard
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // 1. Get total number of registered users
    const totalUsers = await User.countDocuments();

    // 2. Get total number of orders placed
    const totalOrders = await Order.countDocuments();

    // 3. Calculate Total Revenue (Only sum the orders that are actually Paid)
    // We use MongoDB Aggregate to mathematically sum the 'totalAmount' field
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } }, 
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    // If there is revenue, extract the number. Otherwise, default to 0.
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    return NextResponse.json({
      success: true,
      totalUsers,
      totalOrders,
      totalRevenue
    }, { status: 200 });

  } catch (error: any) {
    console.error("DASHBOARD ANALYTICS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}