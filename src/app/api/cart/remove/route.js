import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    // $pull operator use karke specific productId ko array se remove karenge
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    ).populate('items.productId');

    return NextResponse.json({ message: "Item removed", cart: updatedCart }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}