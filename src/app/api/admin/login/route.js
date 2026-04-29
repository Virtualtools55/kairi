import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }

    // 🔥 FIX: trim password
    const isMatch = await bcrypt.compare(password.trim(), admin.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
    }

    const newSessionId = crypto.randomBytes(16).toString("hex");

    await Admin.findByIdAndUpdate(admin._id, { 
      currentSessionId: newSessionId 
    });

    const token = jwt.sign(
      { id: admin._id, role: 'admin', sessionId: newSessionId },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json({ message: "Welcome Admin" }, { status: 200 });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}