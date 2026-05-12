import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Products"; // Ensure Product model is imported for population
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
   const cookieStore = await cookies(); // Pehle pure store ko await karein
   const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find cart and populate product details (title, price, imageUrl)
    const cart = await Cart.findOne({ userId: decoded.id }).populate("items.productId");

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
  }
}