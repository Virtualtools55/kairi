import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // Aapka DB connection helper
import Order from "@/models/Order";     // Aapka Order model

export async function POST(req) {
  try {
    await dbConnect();

    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { error: "Order ID and OTP are required" },
        { status: 400 }
      );
    }

    // 1. Order ko database mein dhoondein
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. OTP Check karein
    // Note: OTP ko string mein convert karke compare karna safe rehta hai
    if (order.deliveryOtp?.toString() !== otp.toString()) {
      return NextResponse.json(
        { error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // 3. Order update karein
    order.status = "Delivered";
    order.deliveredAt = new Date();
    // Verification ke baad OTP ko null kar dena chahiye security ke liye
    order.deliveryOtp = null; 

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order marked as delivered successfully! 🥭",
    });

  } catch (error) {
    console.error("Delivery Completion Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}