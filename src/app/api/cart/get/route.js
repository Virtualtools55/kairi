import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
// import Product from "@/models/Product"; // Populate ke liye important hai
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Cookie se token nikalna
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Token verify karke user ID nikalna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Cart find karna aur product details populate karna
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}