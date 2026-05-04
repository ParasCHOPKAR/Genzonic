import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
password: {
  type: String,
  required: false,
}
  },

  // ✅ Phone (Required)
  phone: {
    type: String,
    required: true,
  },

  // ✅ Location (Optional)
  location: {
    type: String,
    default: "",
  },

  // ✅ Role with ENUM + DEFAULT
  role: {
    type: String,
    enum: ["user", "admin"], // only these allowed
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Prevent model overwrite error in Next.js
export default mongoose.models.User ||
  mongoose.model("User", UserSchema);