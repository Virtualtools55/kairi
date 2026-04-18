import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Cookie se token nikalna (Zaroori step)
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found in cookies" }, { status: 401 });
    }

    // 2. Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. User fetch karein
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: "Invalid or Expired Token" }, { status: 401 });
  }
}