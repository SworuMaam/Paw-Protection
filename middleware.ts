import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Make sure to import the async versions from '@/lib/auth'
import { verifyToken, getTokenFromRequest, JWTPayload } from '@/lib/auth';

export async function middleware(request: NextRequest) { // Make middleware function async
  const { pathname } = request.nextUrl;

  const adminRoutes = ['/admin'];
  const userRoutes = ['/dashboard', '/preferences', '/recommendations', '/favorites']; // Routes accessible by 'user' role
  const fosterRoutes = ['/foster-dashboard']; // New routes for 'foster-user' role
  const authRoutes = ['/login', '/register'];

  const token = getTokenFromRequest(request);
  // Await the verifyToken call
  const payload: JWTPayload | null = token ? await verifyToken(token) : null;

  // 1️⃣ Redirect logged-in users away from /login or /register
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (payload) {
      let redirectUrl = '/dashboard';
      if (payload.role === 'admin') {
        redirectUrl = '/admin';
      } else if (payload.role === 'foster-user') {
        redirectUrl = '/foster-dashboard';
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  const isFosterRoute = fosterRoutes.some(route => pathname.startsWith(route)); // Check for foster routes

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
    // Allow admins to access user routes too, but redirect foster users away
    if (payload.role === 'foster-user') {
      return NextResponse.redirect(new URL('/foster-dashboard', request.url));
    }
  }

  // 4️⃣ Protect Foster User Route (New)
  if (isFosterRoute) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (payload.role !== 'foster-user') {
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
    '/foster-dashboard/:path*', // New foster routes
    '/login',
    '/register',
  ],
};