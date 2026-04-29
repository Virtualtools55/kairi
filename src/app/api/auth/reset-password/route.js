import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Request se data nikalna
    const body = await req.json();
    const { token, password } = body;

    // 1. Check karein ki data mil raha hai ya nahi
    if (!token || !password) {
      return NextResponse.json({ message: "Token and Password are required" }, { status: 400 });
    }

    // 2. Database mein User dhoondein (Expiry check ke saath)
    // Hum simple query karenge taaki debug kar sakein kyun fail ho raha hai
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    // 3. Agar User nahi mila (Token galat hai)
    if (!user) {
      return NextResponse.json(
        { message: "Invalid Link: Token database mein nahi mila." },
        { status: 400 }
      );
    }

    // 4. Agar User mil gaya, toh check karein expiry (Date comparison)
    const now = new Date();
    if (user.resetPasswordExpire < now) {
       // Token expire ho chuka hai, toh fields clear kar dein (Cleanup)
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;
       await user.save();
       
       return NextResponse.json(
         { message: "Expired Link: 15 minute poore ho chuke hain." },
         { status: 400 }
       );
    }

    // 5. Naya password encrypt karein
    const hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET
    ).toString();

    // 6. Password update karein aur tokens clear karein
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    return NextResponse.json(
      { message: "Password Reset Successful! Login now." },
      { status: 200 }
    );

  } catch (error) {
    console.error("RESET ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}