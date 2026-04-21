import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Account verified successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}