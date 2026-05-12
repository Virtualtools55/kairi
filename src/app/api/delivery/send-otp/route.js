import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { orderId, email } = await req.json();


    if (!email || !orderId) {
  return NextResponse.json({ message: "Email ya OrderID missing hai" }, { status: 400 });
}

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save OTP in Order document (temporary)
    await Order.findByIdAndUpdate(orderId, { 
      deliveryOtp: otp,
      otpExpires: Date.now() + 600000 // 10 mins expiry
    });

    // 3. Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password use karein
      },
    });

    // 4. Email Template
    const mailOptions = {
      from: `"Kairi Delivery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Kairi Order Delivery OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #2D6A4F;">Kairi.in - Delivery Verification</h2>
          <p>Aapka delivery agent location par hai. Kripya niche diya gaya OTP share karein:</p>
          <h1 style="letter-spacing: 5px; color: #FF5E00;">${otp}</h1>
          <p>Yeh OTP sirf 10 minutes tak valid hai.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "OTP Sent" });
  } catch (error) {
    return NextResponse.json({ message: "Error sending OTP" }, { status: 500 });
  }
}