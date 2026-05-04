import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});

export default mongoose.models.OTP ||
  mongoose.model("OTP", OTPSchema);