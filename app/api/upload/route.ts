import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ✅ 1. Use the EXACT variable names from your .env.local file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function POST(req: Request) {
  try {
    // ✅ 2. Read the JSON body sent by our modern AddProductForm
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ✅ 3. Upload the base64 image string to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "genzonic_products", // Keeps your Cloudinary dashboard clean
    });

    // ✅ 4. Return 'url' (which is what the frontend expects) mapped to Cloudinary's secure_url
    return NextResponse.json({ 
      success: true,
      url: uploadResponse.secure_url 
    }, { status: 200 });
    
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to upload image to cloud storage" }, 
      { status: 500 }
    );
  }
}