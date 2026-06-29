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

    // 🔥 UPDATED: Sort by Rank (1st, 2nd, 3rd), then fallback to newest first
    const products = await Product.find(query).sort({ rank: 1, createdAt: -1 });

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
      rank: body.rank || 9999, // 🔥 Ensure rank is saved on creation
    });

    // 🔥 Restored the missing success return here!
    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("POST ERROR:", error);
    
    // Safely extract the message to satisfy TypeScript
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}