import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

// ✅ GET ALL PRODUCTS (WITH OPTIONAL CATEGORY FILTER)
export async function GET(req: Request) {
  try {
    await connectDB();

    // Look at the URL to see if a category is requested
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // If a category exists in the URL, filter by it. Otherwise, get all.
    const query = category ? { category } : {};

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ CREATE PRODUCT
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Generate Slug
    const slug = body.name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const product = await Product.create({
      name: body.name,
      price: body.price,
      description: body.description || "",
      slug,
      category: body.category || "men",
      stock: body.stock || 0,
      image: body.image,
      featured: body.featured || false,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}