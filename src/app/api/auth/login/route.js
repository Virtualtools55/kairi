import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. User find karein
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
    }

    // 2. Decrypt Password (CRYPTO_SECRET vahi hona chahiye jo reset mein tha)
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    // 3. Verification
    if (originalPassword !== password) {
      return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
    }

    // 4. Success: Generate JWT session
    const sessionToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ 
      message: "Login successful",
      token: sessionToken 
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}