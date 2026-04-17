import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // npm install jsonwebtoken
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // 1. Check karein ki user exist karta hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User nahi mila!" }, { status: 404 });
    }

    // 2. Bcrypt se password compare karein
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. JWT Token generate karein
    // Isme hum user ki ID aur Role (Admin/User) bhej rahe hain
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token 1 din tak valid rahega
    );

    // 4. Token ko HTTP-Only Cookie mein set karein (Zada secure hai)
    const response = NextResponse.json({
      message: "Login successful!",
      user: { name: user.name, role: user.role }
    }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true, // Frontend se access nahi hoga (Security)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 din
      path: "/",
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}