import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const path = req.nextUrl.pathname;

  const isAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/access-portal-admin');
  const isDashboard = path.startsWith('/dashboard');
  const isAdminPage = path.startsWith('/admin');

  if (isAuthPage) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        // If they have a valid token, redirect away from auth pages
        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (err) {
        // Invalid token, allow access to auth page
      }
    }
    return NextResponse.next();
  }

  if (isDashboard || isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL(isAdminPage ? '/access-portal-admin' : '/login', req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Role check
      if (isAdminPage && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      if (isDashboard && payload.role === 'admin') {
         return NextResponse.redirect(new URL('/admin', req.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Token is invalid/expired
      const response = NextResponse.redirect(new URL(isAdminPage ? '/access-portal-admin' : '/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register', '/access-portal-admin'],
};
