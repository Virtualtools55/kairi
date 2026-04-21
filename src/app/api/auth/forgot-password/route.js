import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 1. Create Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins valid

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // 2. Create Reset Link
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${resetToken}`;

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Kairi Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Kairi",
      html: `<div style="font-family:sans-serif; text-align:center; padding:20px; border:2px solid #FF5E00; border-radius:15px;">
              <h1 style="color:#FF5E00;">Kairi.in</h1>
              <p>Aapne password reset ke liye request ki thi. Niche diye gaye button par click karein:</p>
              <a href="${resetUrl}" style="background:#2D6A4F; color:white; padding:12px 25px; text-decoration:none; border-radius:10px; font-weight:bold; display:inline-block; margin:20px 0;">Reset Password</a>
              <p style="color:#666;">Ye link 15 minute mein expire ho jayega.</p>
             </div>`
    });

    return NextResponse.json({ message: "Reset link sent to Gmail" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }
}