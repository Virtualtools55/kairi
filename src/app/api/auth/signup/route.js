import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    // 1. Validation: Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered!" }, { status: 400 });
    }

    // 2. Security: Bcrypt se password hash karein
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Database: Naya user create karein
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // Pehla user manually DB mein 'admin' banana hoga
    });

    // 4. Token: JWT generate karein (Taki register hote hi login ho jaye)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Response: Cookie set karein aur success message bhejein
    const response = NextResponse.json({
      message: "Kairi.in par aapka swagat hai!",
      user: { name: newUser.name, email: newUser.email }
    }, { status: 201 });

    // Secure Cookie set karna
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 din
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Registration failed!" }, { status: 500 });
  }
}