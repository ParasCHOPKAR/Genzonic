import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomProduct from "@/models/CustomProduct";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCustomProduct = await CustomProduct.create({
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
    });

    console.log("✅ CUSTOM PRODUCT DEPLOYED:", newCustomProduct.name);

    return NextResponse.json({ 
      success: true, 
      product: newCustomProduct 
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ CREATE CUSTOM PRODUCT ERROR:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Database deployment failed." 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await CustomProduct.find({}).sort({ rank: 1, createdAt: -1 });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
