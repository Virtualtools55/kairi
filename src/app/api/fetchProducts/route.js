import dbConnect from "@/lib/mongodb";
import Product from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Schema के 'createdAt' का उपयोग करके लेटेस्ट प्रोडक्ट्स सबसे पहले दिखाएंगे
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}