import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Data missing" }, { status: 400 });
    }

    // 1. Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    // 2. Naya password encrypt karein (Consistency is key)
    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();

    // 3. Database mein update karein
    const updatedUser = await User.findByIdAndUpdate(userId, { 
      password: hashedPassword 
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password reset successful!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid or expired link" }, { status: 400 });
  }
}