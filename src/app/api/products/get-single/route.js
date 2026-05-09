import dbConnect from "@/lib/mongodb";
import Product from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // URL se ID nikalne ka sahi tarika
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check agar ID nahi mili
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Database mein search karein
    const product = await Product.findById(id);

    // Check agar product database mein nahi hai
    if (!product) {
      return NextResponse.json({ message: "Mango not found in orchard" }, { status: 404 });
    }

    // Success response
    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    console.error("Single Product Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}