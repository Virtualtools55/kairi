import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Zaroori: Model ko import karke rakhein

export async function GET(req) {
  try {
    await dbConnect();

    const pendingOrders = await Order.find({ status: "Confirmed" })
      .populate({
        path: "userId",
        select: "name email", // Humein sirf name aur email chahiye
        model: User          // Explicitly bata rahe hain ki User model use karo
      })
      .sort({ createdAt: 1 });

    return NextResponse.json(pendingOrders);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}