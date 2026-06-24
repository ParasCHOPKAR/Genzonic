import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product"; 

// Helper function to handle image uploads
async function uploadImageToStorage(file: File) {
  // NOTE: Implement your actual image upload logic here
  return `/uploads/${file.name}`; 
}

// GET: Fetch a single product for the edit form
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // FIX 1: params is now a Promise
) {
  try {
    await connectDB();
    
    // FIX 2: Await the params before using them
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

// PUT: Update the product and handle images
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // FIX 3: params is now a Promise
) {
  try {
    await connectDB();
    
    // FIX 4: Await the params before using them
    const resolvedParams = await params;
    
    // Parse the incoming FormData
    const formData = await req.formData();
    
    // Extract text fields
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const color = formData.get("color") as string;
    const stock = Number(formData.get("stock"));
    const description = formData.get("description") as string;
    const isPremium = formData.get("isPremium") === "true";
    const sizes = JSON.parse(formData.get("sizes") as string);
    const existingImages = JSON.parse(formData.get("existingImages") as string);

    // Handle new image files
    const newImageFiles = formData.getAll("newImages") as File[];
    const uploadedImageUrls: string[] = [];

    for (const file of newImageFiles) {
      const url = await uploadImageToStorage(file);
      uploadedImageUrls.push(url);
    }

    // Combine old images kept by user + newly uploaded images
    const finalImagesArray = [...existingImages, ...uploadedImageUrls];

    // Update MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id, // Use resolvedParams here
      {
        name,
        price,
        category,
        color,
        stock,
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