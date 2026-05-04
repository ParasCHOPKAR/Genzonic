import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;
    const contact = email || phone;

    if (!contact) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // 1. Generate a real 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save OTP to Database (Allows saving even if 'otp' isn't explicitly in your Schema yet)
    await connectDB();
    await User.findOneAndUpdate(
      { email: contact },
      { 
        $set: { 
          name: name || "GenZonic VIP", 
          otp: otp, 
          otpExpiry: Date.now() + 10 * 60 * 1000 // Valid for 10 minutes
        } 
      },
      { upsert: true, strict: false } 
    );

    // 3. Setup Nodemailer (Make sure EMAIL_USER and EMAIL_PASS are in your .env file!)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Send the Email
    await transporter.sendMail({
      from: `"GenZonic Store" <${process.env.EMAIL_USER}>`,
      to: contact,
      subject: "GenZonic // Authorization Code",
      html: `
        <div style="font-family: sans-serif; background: #050505; color: #fff; padding: 40px; text-align: center;">
          <h1 style="margin-bottom: 20px; letter-spacing: 2px;">GENZONIC</h1>
          <p style="color: #888;">Your secure authorization code is:</p>
          <h2 style="font-size: 32px; background: #111; padding: 15px; border-radius: 8px; letter-spacing: 5px; color: #ff3e00;">${otp}</h2>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email!" }, { status: 200 });

  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
  }
}