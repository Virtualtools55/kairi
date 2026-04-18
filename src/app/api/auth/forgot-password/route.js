import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Check your email" }, { status: 200 });
    }

    // 1. Token banana
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // 2. Hash karke save karna
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 Min Valid
    await user.save();

    // 3. Nodemailer Config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: '"Kairi.in Support" <no-reply@kairi.in>',
      to: user.email,
      subject: "Password Reset Request",
      html: `Click here to reset: <a href="${resetUrl}">${resetUrl}</a>`
    });

    return NextResponse.json({ message: "Link sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}