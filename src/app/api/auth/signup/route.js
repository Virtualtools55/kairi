import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, phone, address, pincode } = await req.json();

    // 1. Gmail Only Validation
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json({ message: "Only @gmail.com addresses are allowed" }, { status: 400 });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ message: "Email already registered." }, { status: 400 });
    }

    // 3. Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();

    // 4. Upsert User (Update if exists but not verified, else create)
    await User.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, phone, address, pincode, otp: generatedOtp, otpExpire, isVerified: false },
     { upsert: true, returnDocument: 'after' }
    );

    // 5. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Kairi Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${generatedOtp} is your Kairi Verification Code`,
      html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #FF5E00; border-radius:10px;">
              <h2 style="color:#FF5E00;">Verify Your Account</h2>
              <p>Your 6-digit verification code is:</p>
              <h1 style="letter-spacing:5px; color:#2D6A4F;">${generatedOtp}</h1>
              <p>Valid for 10 minutes only.</p>
            </div>`,
    });

    return NextResponse.json({ message: "OTP sent to your Gmail." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}