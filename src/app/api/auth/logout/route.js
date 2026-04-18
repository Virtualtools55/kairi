import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "Logout successful!" },
      { status: 200 }
    );

    // सेम नाम "token" का उपयोग करके पुरानी कुकी को खत्म करना
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // तुरंत एक्सपायर करने के लिए 1970 की तारीख
      path: "/", // पाथ वही होना चाहिए जो लॉगिन के समय था
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}