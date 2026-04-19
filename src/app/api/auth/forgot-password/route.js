import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server"; // NextResponse use karna zaroori hai

export async function POST(req) {
  try {
    await dbConnect();

    // App Router mein req.body nahi, await req.json() use hota hai
    const { email } = await req.json();

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: "If that account exists, an email has been sent." },
        { status: 200 }
      );
    }

    // Token generation
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // URL format aapke dynamic route ke hisab se (reset-password/[token])
    const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Make sure this is correct in .env
      },
    });

    await transporter.sendMail({
      from: '"Kairi Support" <support@kairi.in>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #f97316;">Password Reset</h2>
          <p>Aapne password reset ka request kiya hai. Niche diye gaye button par click karein:</p>
          <a href="${resetUrl}" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 15px; font-size: 12px;">Ye link 15 minutes mein expire ho jayega.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Server error, please try again." },
      { status: 500 }
    );
  }
}