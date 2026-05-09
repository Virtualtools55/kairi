import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await dbConnect();

    // 1. Auth Check (Security ke liye zaroori hai)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. URL se ID nikalna
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // 3. Delete logic (userId check ke saath taaki koi aur delete na kar sake)
    const deletedItem = await Cart.findOneAndDelete({ _id: itemId, userId: userId });

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed" }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}