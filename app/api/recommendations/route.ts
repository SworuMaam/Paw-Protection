import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized: No token' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || !user.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userIdNum = parseInt(user.userId, 10);
    if (isNaN(userIdNum)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const prefResult = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userIdNum]
    );

    if (prefResult.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User preferences not found. Please set your preferences first.',
      }, { status: 400 });
    }

    const preferences = prefResult.rows[0];
    console.log('User preferences:', preferences);

    // Fetch all pets (simplify first)
    const petsResult = await pool.query('SELECT * FROM pets');
    if (petsResult.rowCount === 0) {
      return NextResponse.json({ success: true, recommendations: [] });
    }
    const pets = petsResult.rows;
    console.log('All pets fetched:', pets.length);

    // Filter pets manually based on preferences
    const filteredPets = pets.filter((pet) => {
      if (preferences.species.length > 0 && !preferences.species.includes(pet.species)) return false;
      if (preferences.breeds.length > 0 && !preferences.breeds.includes(pet.breed)) return false;
      if (pet.age < preferences.age_range[0] || pet.age > preferences.age_range[1]) return false;
      if (preferences.gender.length > 0 && !preferences.gender.includes(pet.gender)) return false;
      // Add other filters as needed
      return true;
    });

    console.log('Pets after filtering:', filteredPets.length);

    const recommendations = filteredPets.map(pet => ({
      pet,
      score: 100,
      matchReasons: ['Matches your preferences!'],
      distance: null, // Implement if you have location data
    }));

    return NextResponse.json({ success: true, recommendations });

  } catch (error) {
    console.error('Error in GET /api/recommendations:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
