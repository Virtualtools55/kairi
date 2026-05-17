import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AllowedIp from "@/models/AllowedIp"; // Kal jo model banaya tha aapne

export async function POST(req) {
  try {
    await dbConnect();
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json({ isAllowed: false, error: "IP is required" }, { status: 400 });
    }

    // Localhost IPv6 loopback check handle karne ke liye
    const cleanIp = ip === "::1" ? "127.0.0.1" : ip;

    // Database mein check karna
    const whitelisted = await AllowedIp.findOne({ ip: cleanIp });

    if (!whitelisted) {
      return NextResponse.json({ isAllowed: false }, { status: 403 });
    }

    return NextResponse.json({ isAllowed: true });
  } catch (error) {
    console.error("Database IP verification failed:", error);
    return NextResponse.json({ isAllowed: false, error: "Server Error" }, { status: 500 });
  }
}