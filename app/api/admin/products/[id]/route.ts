import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product"; // Adjust this import based on your actual Product model path

// Helper function to handle image uploads to Cloudinary/AWS
// If you are storing base64 strings or linking external URLs, adjust this logic.
async function uploadImageToStorage(file: File) {
  // NOTE: Implement your actual image upload logic here (e.g., Cloudinary)
  // For now, if you rely on external URLs or local storage, handle it accordingly.
  // Example dummy return:
  // const buffer = await file.arrayBuffer();
  // const uploadResult = await uploadToCloudinary(buffer);
  // return uploadResult.secure_url;
  
  return `/uploads/${file.name}`; // Placeholder return
}

// GET: Fetch a single product for the edit form
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

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
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
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
      // Pass the file to your upload provider (Cloudinary, S3, etc.)
      const url = await uploadImageToStorage(file);
      uploadedImageUrls.push(url);
    }

    // Combine old images kept by user + newly uploaded images
    const finalImagesArray = [...existingImages, ...uploadedImageUrls];

    // Update MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        price,
        category,
        color,
        stock,
        description,
        isPremium,
        sizes,
        images: finalImagesArray, // Update image array
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