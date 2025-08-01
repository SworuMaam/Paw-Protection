import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest, JWTPayload } from './auth'; // verifyToken is now async

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>,
  options: { requiredRole?: 'admin' | 'user' | 'foster-user' } = {}
) {
  return async (req: AuthenticatedRequest, context: any) => { // Make this wrapper function async
    try {
      const token = getTokenFromRequest(req);

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const payload = await verifyToken(token); // Await verifyToken
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Check role if required
      if (options.requiredRole && payload.role !== options.requiredRole) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Attach user to request
      req.user = payload;

      return handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}