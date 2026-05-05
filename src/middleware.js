import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('adminToken')?.value;

  // 1. Agar login page hai, toh jaane do (taaki redirect loop na bane)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. Signup Page Logic
  if (pathname === '/admin/signup') {
    try {
      const resStatus = await fetch(`${request.nextUrl.origin}/api/setting/signup-status`, {
        cache: 'no-store'
      });
      const data = await resStatus.json();

      if (data.isEnabled) return NextResponse.next();
      return NextResponse.rewrite(new URL('/404', request.url));
    } catch (error) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // 3. Auth Protection (Sabhi /admin routes ke liye)
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

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

export const config = {
  matcher: ['/admin/:path*'],
};