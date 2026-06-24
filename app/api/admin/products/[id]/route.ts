import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product"; 

// GET: Fetch a single product for the edit form
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const product = await Product.findById(resolvedParams.id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// PUT: Update product via standard JSON (Fixes Image Upload bugs)
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    
    // Parse the clean JSON body sent from the new frontend
    const body = await req.json();
    
    const { 
      name, price, category, color, stock, 
      description, isPremium, sizes, 
      existingImages, newImages 
    } = body;

    // Optional: If you use Cloudinary, you would upload the base64 strings here.
    // E.g., const uploadedUrls = await Promise.all(newImages.map(img => cloudinary.uploader.upload(img)))
    // For now, we will save the raw base64 strings directly to the DB so they render instantly.
    
    const finalImagesArray = [...(existingImages || []), ...(newImages || [])];

    // Update MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id, 
      {
        name,
        price: Number(price),
        category,
        color,
        stock: Number(stock),
        description,
        isPremium,
        sizes,
        images: finalImagesArray, 
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}