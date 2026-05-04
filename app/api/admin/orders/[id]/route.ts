import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth"; 

export async function PATCH(req: Request, context: any) {
  try {
    const session = await getServerSession();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, message: "UNAUTHORIZED ACTION" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    
    // 🔥 Now we extract trackingUrl too!
    const { status, trackingUrl } = body; 

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    const params = await context.params;
    const orderId = params.id; 

    // 🔥 Build the update object dynamically
    const updateData: any = { status };
    if (trackingUrl !== undefined) {
      updateData.trackingUrl = trackingUrl; // Only update it if we actually sent one
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Status updated successfully", order: updatedOrder }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}