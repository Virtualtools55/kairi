import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    // 1. Database mein token search karein jo expire na hua ho
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }, // Check karein ki 15 min khatam toh nahi huye
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or Expired Reset Link" },
        { status: 400 }
      );
    }

    // 2. Naya password encrypt karein (Aapki Kairi.in encryption logic)
    const hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET
    ).toString();

    // 3. Password update karein aur tokens clear karein
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    return NextResponse.json(
      { message: "Password Reset Successful! Login now." },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESET ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}