import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('adminToken')?.value;

  // --- 1. SPECIAL BYPASS FOR SIGNUP ---
  if (pathname === '/admin/signup') {
    try {
      // Pehle check karo ki Atlas mein signup allowed hai ya nahi
      const resStatus = await fetch(`${request.nextUrl.origin}/api/setting/signup-status`, {
        cache: 'no-store'
      });
      const data = await resStatus.json();

      if (data.isEnabled) {
        return NextResponse.next(); // Agar true hai toh page khulne do
      } else {
        return NextResponse.rewrite(new URL('/404', request.url)); // Nahi toh 404
      }
    } catch (error) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // --- 2. PROTECTION FOR ALL OTHER ADMIN ROUTES ---
  if (pathname.startsWith('/admin')) {
    
    // Login page ko hamesha allowed rakho taaki loop na bane
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Baaki sab ke liye Token check
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Session Verification
      const res = await fetch(`${request.nextUrl.origin}/api/admin/check-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: payload.id, sessionId: payload.sessionId }),
      });

      if (!res.ok) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }

      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('adminToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};