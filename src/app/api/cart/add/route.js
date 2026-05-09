import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { cookies } from "next/headers"; // Next.js 15+ ke liye await zaroori hai
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Yahan await lagaiye 
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value; 

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Token verify karke userId nikalna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId } = await req.json();

    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
    } else {
      await Cart.create({ userId, productId, quantity: 1 });
    }

    return NextResponse.json({ message: "Added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ message: "Invalid Token or Auth Error" }, { status: 500 });
  }
}