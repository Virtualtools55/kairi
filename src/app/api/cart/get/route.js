import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart"; // Cart model import karein (User nahi)
import Product from "@/models/Products"; 
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 1. Seedha Cart collection mein query karein jahan userId match ho
    const cartItems = await Cart.find({ userId: userId })
      .populate({
        path: "productId",
        model: Product,
      });

    // 2. Agar cart khali hai toh empty array bhejien
    return NextResponse.json(cartItems || [], { status: 200 });

  } catch (error) {
    console.error("Fetch Cart Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}