import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// ✅ GET ALL PRODUCTS (WITH OPTIONAL CATEGORY FILTER)
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    // 1. Changed 'let' to 'const' to satisfy ESLint
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    // 2. 🔥 Replaced 'any' with explicit types to satisfy TypeScript
    products.sort((a: { rank?: number | null }, b: { rank?: number | null }) => {
      const rankA = a.rank == null ? 9999 : a.rank;
      const rankB = b.rank == null ? 9999 : b.rank;
      return rankA - rankB;
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    // 3. 🔥 Logged the error so it is officially "used", satisfying ESLint
    console.error("GET ERROR:", error);
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
      rank: body.rank || 9999,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("POST ERROR:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}