import dbConnect from "@/lib/mongodb";
import Slider from "@/models/Slider";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // priority के हिसाब से डेटा फेच करें
    const slides = await Slider.find({}).sort({ priority: 1 });

    return NextResponse.json(slides, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Slider fetch failed" }, 
      { status: 500 }
    );
  }
}