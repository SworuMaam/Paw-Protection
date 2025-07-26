import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = user.userId;

    const {
      species,
      size,
      ageRange,
      gender,
      temperament,
      activityLevel,
      housingType,
      yardSize,
      experienceLevel,
      timeAvailable,
    } = await request.json();

    const client = await pool.connect();

    try {
      await client.query(
        `INSERT INTO user_preferences (
          user_id, species, size, age_range, gender, temperament, activity_level,
          housing_type, yard_size, experience_level, time_available,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          NOW(), NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          species = EXCLUDED.species,
          size = EXCLUDED.size,
          age_range = EXCLUDED.age_range,
          gender = EXCLUDED.gender,
          temperament = EXCLUDED.temperament,
          activity_level = EXCLUDED.activity_level,
          housing_type = EXCLUDED.housing_type,
          yard_size = EXCLUDED.yard_size,
          experience_level = EXCLUDED.experience_level,
          time_available = EXCLUDED.time_available,
          updated_at = NOW()
        `,
        [
          userId,
          species || [],
          size || [],
          ageRange || [0, 15],
          gender || [],
          temperament || [],
          activityLevel || [],
          housingType || null,
          yardSize || null,
          experienceLevel || null,
          timeAvailable || null,
        ]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM user_preferences WHERE user_id = $1', [
        user.userId,
      ]);

      if (result.rowCount === 0) {
        return NextResponse.json({ preferences: null }, { status: 200 });
      }

      const row = result.rows[0];

      // Parse Postgres arrays to JS arrays if needed
      const parsePGArray = (val: any) =>
        Array.isArray(val)
          ? val
          : typeof val === 'string'
          ? val.replace(/[{}]/g, '').split(',').filter(Boolean)
          : [];

      const preferences = {
        userId: row.user_id,
        species: parsePGArray(row.species),
        size: parsePGArray(row.size),
        ageRange: row.age_range || [0, 15],
        gender: parsePGArray(row.gender),
        temperament: parsePGArray(row.temperament),
        activityLevel: parsePGArray(row.activity_level),
        housingType: row.housing_type || '',
        yardSize: row.yard_size || '',
        experienceLevel: row.experience_level || '',
        timeAvailable: row.time_available || '',
      };

      return NextResponse.json({ preferences });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
