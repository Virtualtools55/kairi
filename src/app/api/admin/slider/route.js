import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

// 1. GET ALL SLIDES
export async function GET() {
  await dbConnect();
  const slides = await Slider.find({}).sort({ priority: 1 });
  return NextResponse.json(slides);
}

// 2. UPLOAD NEW SLIDE
export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");

    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // Buffer में कन्वर्ट करें ImageKit के लिए
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ImageKit पर अपलोड
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `slider_${Date.now()}`,
      folder: "/kairi_sliders",
    });

    const newSlide = await Slider.create({
      imageUrl: uploadResponse.url,
      imageFileId: uploadResponse.fileId,
      title,
      subtitle,
    });

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE SLIDE
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const fileId = searchParams.get("fileId");

    await Slider.findByIdAndDelete(id);
    await imagekit.deleteFile(fileId); // ImageKit से भी डिलीट करें

    return NextResponse.json({ message: "Slide Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}