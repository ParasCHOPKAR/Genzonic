// /app/api/orders/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Order from "@/models/Order"; // Adjust this path if your Order model is located elsewhere!

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const body = await req.json();
    const resolvedParams = await params;

    const order = await Order.findByIdAndUpdate(
      resolvedParams.id,
      { status: body.status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}