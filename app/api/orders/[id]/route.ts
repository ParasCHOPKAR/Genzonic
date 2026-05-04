// /app/api/orders/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Order from "@/models/Order"; // Adjust this path if your Order model is located elsewhere!

export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
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