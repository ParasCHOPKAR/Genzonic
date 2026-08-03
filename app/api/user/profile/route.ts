import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const profile = await Profile.findOne({ userEmail: session.user.email });
    
    return NextResponse.json({ success: true, profile: profile || { addresses: [] } });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { addresses } = await req.json();

    const updatedProfile = await Profile.findOneAndUpdate(
      { userEmail: session.user.email },
      { 
        userEmail: session.user.email,
        addresses: addresses 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
