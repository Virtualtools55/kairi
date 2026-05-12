import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );

    // 1. Check if verified
    if (!user.isVerified)
      return NextResponse.json(
        { message: "Please verify your email first" },
        { status: 403 }
      );

    // 2. Password Check
    const bytes = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET
    );

    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== password)
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 401 }
      );

    // 3. SINGLE DEVICE LOGIN LOGIC
    const newSessionId = crypto.randomBytes(16).toString("hex");
    await User.findByIdAndUpdate(user._id, { currentSessionId: newSessionId });

    // 4. Generate JWT with SessionId
    const token = jwt.sign(
      { id: user._id, email: user.email, sessionId: newSessionId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // 5. FIXED COOKIE SETTING
    response.cookies.set("token", token, { 
      httpOnly: true, 
      // Localhost pe false rahega, production (Vercel) pe apne aap true ho jayega
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 Day in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}