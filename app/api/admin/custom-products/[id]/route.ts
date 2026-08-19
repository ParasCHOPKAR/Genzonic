import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomProduct from "@/models/CustomProduct";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await CustomProduct.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const updatedProduct = await CustomProduct.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        slug: slug,
        description: body.description,
        price: Number(body.price),
        featuredImage: body.featuredImage,
        colors: body.colors || [],
        sizes: body.sizes || [],
        designs: body.designs || [],
        stock: Number(body.stock || 0),
        tag: body.tag || "",
        active: body.active !== undefined ? body.active : true,
        rank: Number(body.rank || 9999),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error("❌ UPDATE CUSTOM PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedProduct = await CustomProduct.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
