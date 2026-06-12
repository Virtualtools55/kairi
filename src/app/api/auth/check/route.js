import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    // 1. Cookie se token read karein
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, message: "No token found" }, { status: 401 });
    }

    // 2. JWT Secret se token verify karein
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({ authenticated: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // 3. Connect DB & Validate Single Device Session ID
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ authenticated: false, message: "User not found" }, { status: 401 });
    }

    // Aapki login api ka Single Device Session validate logic
    if (user.currentSessionId !== decoded.sessionId) {
      return NextResponse.json({ authenticated: false, message: "Session expired. Logged in from elsewhere." }, { status: 401 });
    }

    // Token aur Session dono valid hain
    return NextResponse.json({ authenticated: true, userId: user._id }, { status: 200 });

  } catch (error) {
    console.error("Auth check internal error:", error);
    return NextResponse.json({ authenticated: false, message: "Server error" }, { status: 500 });
  }
}