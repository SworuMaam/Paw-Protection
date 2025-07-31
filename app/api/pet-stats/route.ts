// /app/api/pet-stats/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE availability_status = 'Adopted') AS adopted_count,
        COUNT(*) FILTER (WHERE availability_status IN ('Fostered_Available', 'Fostered_Not_Available')) AS fostered_count,
        COUNT(*) FILTER (WHERE availability_status = 'Available') AS available_count
      FROM pets;
    `);

    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching pet stats:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
