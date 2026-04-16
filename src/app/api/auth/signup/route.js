import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Database से जुड़ें
    const client = await clientPromise;
    const db = client.db("kairi_db");

    // 2. चेक करें कि यूजर पहले से तो नहीं है
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 3. Password को सुरक्षित (Hash) करें
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. नया यूजर सेव करें
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}