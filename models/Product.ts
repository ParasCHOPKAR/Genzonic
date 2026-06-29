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
    originalPrice: { 
      type: Number 
    },
    image: { 
      type: String, 
      required: true 
    },
    images: [
      { type: String }
    ],
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
    },
    // 🔥 Rank field correctly placed inside the schema
    rank: { 
      type: Number, 
      default: 9999 
    }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;