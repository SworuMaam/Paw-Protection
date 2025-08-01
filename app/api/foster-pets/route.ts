// /app/api/foster-pets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'foster-user') {
    return NextResponse.json({ error: 'Unauthorized or invalid role' }, { status: 403 });
  }

  try {
    const result = await db.query(
      `SELECT id, name, species, breed, age, gender, availability_status, image
       FROM pets
       WHERE foster_parent_id = $1
       ORDER BY updated_at DESC`,
      [payload.userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[Foster GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
}
