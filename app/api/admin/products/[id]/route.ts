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

// PUT: Update product via standard JSON (Merged Images + Rank)
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    
    // Parse the clean JSON body sent from the frontend
    const body = await req.json();
    
    // 🔥 Added rank to the extracted variables
    const { 
      name, price, category, color, stock, 
      description, isPremium, sizes, 
      existingImages, newImages, rank 
    } = body;
    
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
        rank: rank === "" || rank === undefined ? 9999 : Number(rank), // 🔥 Added rank to DB update
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

// DELETE: Delete a product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}