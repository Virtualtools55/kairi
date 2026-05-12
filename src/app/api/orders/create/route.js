import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { paymentId, orderId, productId, amount, productTitle } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Login Required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newOrder = await Order.create({
      userId: decoded.id,
      items: [{ 
        productId, 
        title: productTitle, 
        quantity: 1, 
        price: amount 
      }],
      amount,
      paymentId,
      orderId,
      status: "Confirmed",
    });

    return NextResponse.json({ message: "Success", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error saving order" }, { status: 500 });
  }
}