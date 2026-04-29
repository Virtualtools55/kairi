import dbConnect from '@/lib/mongodb';
import Product from '@/models/Products';
import { NextResponse } from 'next/server';
import ImageKit from "imagekit";

// ImageKit Configuration
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

// 1. GET: Fetch All Products
export async function GET() {
  try {
    await dbConnect();
    // Timestamps enabled है, इसलिए नवीनतम प्रोडक्ट्स पहले दिखाएंगे
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Products fetch fail ho gaye" }, { status: 500 });
  }
}

// 2. POST: Upload Image to Specific Folder & Save Product
export async function POST(req) {
  try {
    await dbConnect();
    
    const data = await req.formData();
    const file = data.get("file");
    const title = data.get("title");
    const price = data.get("price");
    const discountPrice = data.get("discountPrice");

    // Basic Validation
    if (!file || !title || !price) {
      return NextResponse.json({ error: "Missing mandatory fields" }, { status: 400 });
    }

    // A. Buffer Conversion
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // B. ImageKit Upload (Specific Folder: kairi_products)
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `kairi-${Date.now()}-${file.name}`,
      folder: "kairi_products", // <--- Aapka manga hua specific folder
      useUniqueFileName: true,
    });

    // C. Save to DB (Strictly following your Schema)
    const newProduct = await Product.create({
      imageUrl: uploadResponse.url,
      imageFileId: uploadResponse.fileId,
      title: title,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      isSoldOut: false
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload product" }, { status: 500 });
  }
}

// 3. PATCH: Toggle Sold Out Status
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, isSoldOut } = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updated = await Product.findByIdAndUpdate(
      id, 
      { isSoldOut }, 
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 4. DELETE: Remove from DB and ImageKit Storage
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Product ID missing" }, { status: 400 });

    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ImageKit से इमेज डिलीट करना (Storage बचाने के लिए बेस्ट प्रैक्टिस)
    if (product.imageFileId) {
      await imagekit.deleteFile(product.imageFileId);
    }

    // Database से डिलीट करना
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product and Image deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete process failed" }, { status: 500 });
  }
}                                                             