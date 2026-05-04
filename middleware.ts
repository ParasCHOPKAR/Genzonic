import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // ✅ Only protect admin routes
  if (pathname.startsWith("/admin")) {
    // ❌ Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ❌ Not admin
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Allow request
  return NextResponse.next();
}

// ✅ Only run on admin routes
export const config = {
  matcher: ["/admin/:path*"],
};