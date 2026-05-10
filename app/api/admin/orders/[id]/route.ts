import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// 🔥 FIX: In Next.js 15+, params is a Promise that must be awaited
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    
    // 🔥 AWAIT the params before trying to use the ID
    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    
    // 1. Grab the new status from the frontend request
    const body = await request.json();
    const { status } = body;

    // 2. Ensure we have the ID and the Status
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing Order ID or Status" },
        { status: 400 }
      );
    }

    // 3. Find the exact order in MongoDB and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found in database" },
        { status: 404 }
      );
    }

    // 4. Success! Tell the frontend it worked
    return NextResponse.json({ 
      success: true, 
      message: "Order status updated successfully",
      order: updatedOrder 
    });

  } catch (error) {
    console.error("ADMIN STATUS UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while updating status" },
      { status: 500 }
    );
  }
}