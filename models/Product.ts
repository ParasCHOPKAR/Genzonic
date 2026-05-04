import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    price: { 
      type: Number, 
      required: true 
    },
    // Used to calculate and display "% OFF" on the frontend
    originalPrice: { 
      type: Number 
    },
    // The main thumbnail image
    image: { 
      type: String, 
      required: true 
    },
    // 👈 The new array to hold multiple gallery images!
    images: [
      { type: String }
    ],
    // CRITICAL: This locks the database to exactly match your Navbar links
    category: { 
      type: String, 
      required: true, 
      enum: ["men", "women", "kids"] 
    },
    sizes: [
      { type: String }
    ],
    stock: { 
      type: Number, 
      default: 0 
    },
    featured: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

// Prevent Mongoose from recompiling the model if it already exists
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;