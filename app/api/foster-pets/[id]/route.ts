// /app/api/foster-pets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'foster-user') {
    return NextResponse.json({ error: 'Unauthorized or invalid role' }, { status: 403 });
  }

  const petId = parseInt(params.id, 10);
  const { availability_status } = await req.json();

  if (isNaN(petId) || !availability_status) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const check = await db.query(
      'SELECT foster_parent_id FROM pets WHERE id = $1',
      [petId]
    );

    if (check.rowCount === 0) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    if (check.rows[0].foster_parent_id !== parseInt(payload.userId, 10)) {
      return NextResponse.json({ error: 'Unauthorized (not your pet)' }, { status: 403 });
    }

    const update = await db.query(
      `UPDATE pets SET availability_status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING id, name, availability_status`,
      [availability_status, petId]
    );

    return NextResponse.json(update.rows[0]);
  } catch (error) {
    console.error('[Foster PATCH Error]', error);
    return NextResponse.json({ error: 'Failed to update pet' }, { status: 500 });
  }
}
