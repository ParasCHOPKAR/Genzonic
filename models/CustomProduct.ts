import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  frontImage: { type: String, required: true },
  backImage: { type: String, required: true },
});

const designSchema = new mongoose.Schema({
  name: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, default: "General" }
});

const customProductSchema = new mongoose.Schema(
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
    featuredImage: { 
      type: String, 
      required: true 
    },
    colors: [colorSchema],
    sizes: [
      { type: String }
    ],
    designs: [designSchema], // Trendy images available for this product
    stock: { 
      type: Number, 
      default: 0 
    },
    tag: { 
      type: String, 
      default: "" // e.g. "NEW", "BEST SELLER"
    },
    active: { 
      type: Boolean, 
      default: true 
    },
    rank: { 
      type: Number, 
      default: 9999 
    }
  },
  { timestamps: true }
);

const CustomProduct = mongoose.models.CustomProduct || mongoose.model("CustomProduct", customProductSchema);

export default CustomProduct;
