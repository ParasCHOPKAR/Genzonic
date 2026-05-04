import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, phone, otp } = await req.json();
    const contact = email || phone;

    await connectDB();
    
    // Find the user with strict: false so we can read the OTP
    const user = await User.findOne({ email: contact }).lean();

    // 1. Check if OTP matches OR if it's the Developer Master Password "123456"
    const isMasterPassword = otp === "123456";
    const isValidDatabaseOtp = user && user.otp === otp && user.otpExpiry > Date.now();

    if (isMasterPassword || isValidDatabaseOtp) {
      
      // Clear the OTP from database so it can't be used twice
      if (!isMasterPassword && user) {
        await User.updateOne({ email: contact }, { $unset: { otp: 1, otpExpiry: 1 } }, { strict: false });
      }

      console.log(`✅ USER VERIFIED: ${contact}`);

      return NextResponse.json({ 
        success: true, 
        message: "Identity Verified.",
        user: { 
          name: user?.name || "GenZonic VIP", 
          email: contact, 
          role: user?.role || "user"
        }
      }, { status: 200 });

    } else {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}