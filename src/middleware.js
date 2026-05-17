import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ==========================================
  // NEW: Delivery Dashboard IP Validation Logic
  // ==========================================
  if (pathname.startsWith('/delivery-dashboard')) {
    try {
      // 1. Client ka real IP address headers se nikalna
      const clientIp = 
        request.headers.get('x-forwarded-for')?.split(',')[0] || 
        request.headers.get('x-real-ip') || 
        request.ip || 
        '127.0.0.1';

      // 2. Apne database internal API ko hit karke IP verify karna
      const ipCheckRes = await fetch(`${request.nextUrl.origin}/api/security/check-ip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: clientIp }),
        cache: 'no-store'
      });

      const ipData = await ipCheckRes.json();

      // 3. Agar IP whitelisted nahi hai, toh use homepage par redirect kar do
      if (!ipCheckRes.ok || !ipData.isAllowed) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Agar IP allowed hai, toh aage badhne do
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware IP validation error:", error);
      // Kuch gadbad hone par safe side rehne ke liye block karna safe hai
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ==========================================
  // YOUR EXISTING CODE: Admin Dashboard Logic
  // ==========================================
  const token = request.cookies.get('adminToken')?.value;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

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

  if (pathname.startsWith('/admin')) {
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

  return NextResponse.next();
}

// Config matcher ko update kiya hai taaki dono routes intercept ho sakein
export const config = {
  matcher: ['/admin/:path*', '/delivery-dashboard/:path*'],
};