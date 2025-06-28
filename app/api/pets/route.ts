import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM pets ORDER BY id DESC');
    return NextResponse.json({ pets: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
}
