import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { id, sessionId } = await req.json();

    const admin = await Admin.findById(id);

    // Agar admin nahi mila ya sessionId match nahi hua (yaani dusri jagah login ho gaya)
    if (!admin || admin.currentSessionId !== sessionId) {
      return NextResponse.json({ message: "Session Invalid" }, { status: 401 });
    }

    return NextResponse.json({ message: "Session Valid" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}