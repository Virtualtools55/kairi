import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, secretCode } = await req.json();

    // 1. Secret Code Check (Taaki koi bhi random banda signup na kar sake)
    // Ise aap apne .env mein ADMIN_SIGNUP_SECRET naam se save kar sakte hain
    if (secretCode !== process.env.ADMIN_SIGNUP_SECRET) {
      return NextResponse.json({ message: "Unauthorized: Invalid Secret Code" }, { status: 401 });
    }

    // 2. Check karein ki admin pehle se toh nahi bana
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
    }

    // 3. Password ko Hash karein (Direct plain text save mat kijiye)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Naya Admin Create karein
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      currentSessionId: "" // Shuruat mein khali rahega
    });

    await newAdmin.save();

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}