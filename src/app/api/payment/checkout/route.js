import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Products";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    // 1. Cookie se token nikalna
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
    }

    // 2. Token verify karke userId nikalna
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid session. Login again." }, { status: 401 });
    }

    const { cartItems, address } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let totalAmount = 0;
    const finalItems = [];

    // Security: Price calculation server-side pe DB se fetch karke
    for (const item of cartItems) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        const price = product.discountPrice || product.price;
        totalAmount += price * item.quantity;
        
        // Aapke Order Model ke structure ke mutabik mapping (.title aur .price)
        finalItems.push({
          productId: product._id,
          title: product.title,
          quantity: item.quantity,
          price: price 
        });
      }
    }

    // 3. Razorpay Order Create karna
    const razorOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Kaise mein
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // 4. DB mein Pending Order save karna (Fixing Model Alignment)
    const dbOrder = await Order.create({
      userId, 
      items: finalItems,
      amount: totalAmount,
      orderId: razorOrder.id,      // Model ke 'orderId' se match kiya
      paymentId: "PENDING",        // Model ka 'required: true' satisfy karne ke liye
      status: "Processing",        // Model ka default status
      address: address || "Not Provided",
    });

    return NextResponse.json({ 
      id: razorOrder.id, 
      amount: razorOrder.amount,
      dbOrderId: dbOrder._id 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    // Error details console mein dikhegi taaki debugging aasan ho
    return NextResponse.json({ error: error.message || "Checkout Initialization Failed" }, { status: 500 });
  }
}