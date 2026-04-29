import dbConnect from "@/lib/mongodb";
import Setting from "@/models/setting";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: "allow_admin_signup" });
    
    return NextResponse.json({ isEnabled: setting ? setting.value : false });
  } catch (error) {
    return NextResponse.json({ isEnabled: false }, { status: 500 });
  }
}