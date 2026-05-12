import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();
    
    // 1. Get the token from the cookies you set in login
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Please login first" }, { status: 401 });
    }

    // 2. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId } = await req.json();

    // 3. Find or Create Cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex((p) => p.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
      await cart.save();
    } else {
      await Cart.create({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    }

    return NextResponse.json({ message: "Added to cart! 🥭" }, { status: 200 });

  } catch (error) {
    console.error("Cart Error:", error);
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }
}