import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        color: body.color,
        sizes: body.sizes,
        stock: body.stock,
        image: body.image,
        images: body.images,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}