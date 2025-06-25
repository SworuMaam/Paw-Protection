import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware-auth';

async function handler(req: NextRequest) {
  return NextResponse.json({
    success: true,
    user: req.user
  });
}

export const GET = withAuth(handler);