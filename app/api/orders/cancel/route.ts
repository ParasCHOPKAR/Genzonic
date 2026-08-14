import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
    }

    // Find the order first to check its status
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Only allow cancellation if it hasn't been shipped or delivered
    const cancellableStatuses = ["Pending", "Paid", "Processing"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json({ success: false, message: "Cannot cancel an order that has already been shipped or delivered." }, { status: 400 });
    }

    // Update its status to CANCELLED
    order.status = "Cancelled";
    await order.save();

    return NextResponse.json({ success: true, message: "Order Cancelled Successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("CANCEL ORDER ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}   