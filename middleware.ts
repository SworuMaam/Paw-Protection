import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Make sure to import the async versions from '@/lib/auth'
import { verifyToken, getTokenFromRequest, JWTPayload } from '@/lib/auth';

export async function middleware(request: NextRequest) { // Make middleware function async
  console.log('[Middleware] triggered for:', request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  const adminRoutes = ['/admin'];
  const userRoutes = ['/dashboard', '/preferences', '/recommendations', '/favorites'];
  const authRoutes = ['/login', '/register'];

  const token = getTokenFromRequest(request);
  // Await the verifyToken call
  const payload: JWTPayload | null = token ? await verifyToken(token) : null;

  console.log('[Middleware] Route:', pathname);
  console.log('[Middleware] Token Found:', !!token);
  console.log('[Middleware] Payload Role:', payload?.role ?? 'None');

  // 1️⃣ Redirect logged-in users away from /login or /register
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (payload) {
      const redirectUrl = payload.role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

  // 2️⃣ Protect Admin Route
  if (isAdminRoute) {
    if (!payload) {
      console.log('[Middleware] No payload -> redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (payload.role !== 'admin') {
      console.log('[Middleware] Not Admin -> redirecting to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 3️⃣ Protect User Route
  if (isUserRoute) {
    if (!payload) {
      console.log('[Middleware] No payload -> redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (payload.role !== 'user') {
      console.log('[Middleware] Not User -> redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/preferences/:path*',
    '/recommendations/:path*',
    '/favorites/:path*',
    '/login',
    '/register',
  ],
};