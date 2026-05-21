import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// 🔥 Next.js 15+ requires params to be a Promise
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // 1. Resolve params to get the Order ID
    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    
    // 2. Grab the action ("cancel", "return", or "replace") from the frontend
    const body = await request.json();
    const { action } = body;

    if (!orderId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing Order ID or Action" },
        { status: 400 }
      );
    }

    // 3. Find the exact order in the database
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found in database." },
        { status: 404 }
      );
    }

    const currentStatus = (order.status || "processing").toLowerCase();
    let newStatus = order.status;

    // 4. 🔥 STRICT BUSINESS LOGIC 🔥
    if (action === "cancel") {
      // ONLY allow cancellation if the order is still processing
      if (currentStatus === "processing") {
        newStatus = "Cancelled";
      } else {
        return NextResponse.json(
          { success: false, message: "Order has already been processed/shipped and cannot be cancelled." },
          { status: 400 }
        );
      }
    } 
    else if (action === "return") {
      newStatus = "Return Requested";
    } 
    else if (action === "replace") {
      newStatus = "Replace Requested";
    }

    // 5. Save the new status to MongoDB
    order.status = newStatus;
    await order.save();

    // 6. Success! Send response back to Profile page
    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${action}`,
      order 
    });

  } catch (error) {
    console.error("ORDER ACTION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while processing request." },
      { status: 500 }
    );
  }
}