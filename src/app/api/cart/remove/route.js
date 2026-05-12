import { NextResponse } from "next/server"; // Yeh line missing thi
import { cookies } from "next/headers";    // Yeh bhi zaroori hai
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function DELETE(req) {
  try {
    // 1. Token read karein (Naam 'token' rakhein jo login mein set kiya tha)
    const token = cookies().get("token")?.value; 
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { productId } = await req.json();

    await dbConnect();

    // 3. Cart se item remove karein
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: decoded.id },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    return NextResponse.json({ cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Error deleting item" }, { status: 500 });
  }
}