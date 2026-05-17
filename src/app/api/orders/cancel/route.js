import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();

    // 1. User authentication verify karna cookie se
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: "Invalid session. Login again." }, { status: 401 });
    }

    // 2. Request body se orderId nikalna
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 3. DB se order dhoodna
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Time Check Rule: 1 Hour validation on server-side (Security ke liye)
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = Date.now();
    const oneHourInMs = 60 * 60 * 1000; // 3600000 milliseconds

    if (currentTime - orderTime > oneHourInMs) {
      return NextResponse.json({ 
        error: "Cancellation window closed. Orders cannot be cancelled after 1 hour." 
      }, { status: 400 });
    }

    // 5. Order update karna (Aap chahein toh status 'Cancelled' karein ya Order.findByIdAndDelete use karein)
    order.status = "Cancelled";
    await order.save();

    // Agar aapko DB se order ko poora udaana hi hai, toh upar ki 2 lines hata kar ye use kar sakte hain:
    // await Order.findByIdAndDelete(orderId);

    return NextResponse.json({ success: true, message: "Order cancelled successfully." });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ error: "Something went wrong while cancelling the order" }, { status: 500 });
  }
}