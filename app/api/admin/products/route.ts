import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// 🔥 This route handles the Admin POST (Create) and GET (List)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. CLEAN CATEGORY: Ensure "MENS COLLECTION" becomes "men"
    // This prevents the "Enum Validation" error
    const rawCategory = body.category || "men";
    const cleanCategory = rawCategory.toLowerCase().includes("men") 
      ? "men" 
      : rawCategory.toLowerCase().includes("women") 
      ? "women" 
      : "kids";

    // 2. GENERATE SLUG: URL-friendly name (e.g., "Oversized Tee" -> "oversized-tee")
    // MongoDB requires a unique slug!
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // 3. CREATE PRODUCT IN DATABASE
    const newProduct = await Product.create({
      name: body.name,
      slug: slug, // Automatically generated
      description: body.description,
      price: Number(body.price),
      category: cleanCategory, // Saved as "men", "women", or "kids"
      color: body.color,
      sizes: body.sizes || [],
      stock: Number(body.stock),
      image: body.image, // Main thumbnail
      images: body.images || [], // 🔥 Full gallery array
      featured: body.featured || false,
    });

    console.log("✅ ARTIFACT DEPLOYED:", newProduct.name);

    return NextResponse.json({ 
      success: true, 
      product: newProduct 
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    
    // Send a specific error message back to the frontend alert
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Database deployment failed." 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}