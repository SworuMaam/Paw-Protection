import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { petId } = await req.json();
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await pool.query(
      `INSERT INTO user_favorites (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id)
       DO NOTHING`,
      [user.id, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { petId } = await req.json();
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await pool.query(
      `DELETE FROM user_favorites WHERE user_id = $1 AND pet_id = $2`,
      [user.id, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}
