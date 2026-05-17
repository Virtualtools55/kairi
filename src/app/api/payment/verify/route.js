import { NextResponse } from "next/server";
import crypto from "crypto";
import ConnectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    await ConnectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findByIdAndUpdate(dbOrderId, { 
        status: "Paid", 
        razorpayPaymentId: razorpay_payment_id 
      });

      // Clear the user's cart after successful payment
      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
}