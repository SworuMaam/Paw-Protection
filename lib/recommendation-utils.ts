import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Extract JWT token from cookie using your auth helper
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized: No token' }, { status: 401 });
    }

    // Verify JWT token
    const user = await verifyToken(token);
    if (!user || !user.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = user.userId;

    // Fetch user preferences from DB
    const prefResult = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    if (prefResult.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User preferences not found. Please set your preferences first.',
      }, { status: 400 });
    }

    const preferences = prefResult.rows[0];

    // Prepare filters from preferences
    const speciesFilter = preferences.species.length > 0 ? preferences.species : null;

    // Build the SQL query dynamically with parameters for species filtering and others
    let sql = `
  SELECT 
    pets.*,
    users.location->>'address' AS owner_address,
    users.location->>'latitude' AS owner_latitude,
    users.location->>'longitude' AS owner_longitude,
    (
      CASE WHEN $1::text[] IS NULL OR pets.species = ANY($1::text[]) THEN 50 ELSE 0 END +
      CASE WHEN pets.availability_status = 'Available' THEN 30 ELSE 0 END +
      CASE WHEN pets.age BETWEEN $2 AND $3 THEN 20 ELSE 0 END
    ) AS score,
    NULL::float AS distance,
    ARRAY[]::text[] AS match_reasons
  FROM pets
  LEFT JOIN users ON pets.foster_parent_id = users.id
  WHERE pets.availability_status IN ('Available', 'Fostered_Available')
`;


    const params: any[] = [speciesFilter, preferences.age_range[0], preferences.age_range[1]];

    // Filter species if set
    if (speciesFilter) {
      sql += ` AND pets.species = ANY($1::text[]) `;
    }

    // You can add more filtering here based on user preferences

    // Limit results
    sql += ` ORDER BY score DESC LIMIT 50`;

    // Query pets with calculated score
    const petsResult = await pool.query(sql, params);

    // Build match reasons per pet (simple example)
    const recommendations = petsResult.rows.map((pet) => {
      const reasons: string[] = [];

      if (speciesFilter && speciesFilter.includes(pet.species)) {
        reasons.push(`Species matches your preference (${pet.species})`);
      }

      if (pet.availability_status === 'Available') {
        reasons.push('Currently available for adoption');
      }

      if (pet.age >= preferences.age_range[0] && pet.age <= preferences.age_range[1]) {
        reasons.push(`Age fits your preferred range (${preferences.age_range[0]}-${preferences.age_range[1]} years)`);
      }

      return {
        pet,
        score: pet.score,
        distance: pet.distance, // You can calculate real distance if you have geo data
        matchReasons: reasons,
      };
    });

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
