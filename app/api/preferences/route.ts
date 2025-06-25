import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware-auth';
import pool from '@/lib/db';

async function getHandler(req: NextRequest) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ preferences: null });
    }

    const preferences = result.rows[0];
    return NextResponse.json({
      success: true,
      preferences: {
        id: preferences.id,
        userId: preferences.user_id,
        species: preferences.species || [],
        breeds: preferences.breeds || [],
        size: preferences.size || [],
        ageRange: preferences.age_range || [0, 15],
        gender: preferences.gender || [],
        temperament: preferences.temperament || [],
        activityLevel: preferences.activity_level || [],
        specialNeeds: preferences.special_needs || false,
        housingType: preferences.housing_type || '',
        yardSize: preferences.yard_size || '',
        experienceLevel: preferences.experience_level || '',
        timeAvailable: preferences.time_available || '',
        location: preferences.location || {},
        maxDistance: preferences.max_distance || 50,
        createdAt: preferences.created_at,
        updatedAt: preferences.updated_at
      }
    });
  } finally {
    client.release();
  }
}

async function postHandler(req: NextRequest) {
  try {
    const preferences = await req.json();
    const client = await pool.connect();

    try {
      // Check if preferences already exist
      const existingResult = await client.query(
        'SELECT id FROM user_preferences WHERE user_id = $1',
        [req.user!.userId]
      );

      let result;
      if (existingResult.rows.length > 0) {
        // Update existing preferences
        result = await client.query(
          `UPDATE user_preferences SET 
           species = $2, breeds = $3, size = $4, age_range = $5, gender = $6,
           temperament = $7, activity_level = $8, special_needs = $9, 
           housing_type = $10, yard_size = $11, experience_level = $12,
           time_available = $13, location = $14, max_distance = $15, updated_at = NOW()
           WHERE user_id = $1 RETURNING *`,
          [
            req.user!.userId,
            preferences.species,
            preferences.breeds,
            preferences.size,
            preferences.ageRange,
            preferences.gender,
            preferences.temperament,
            preferences.activityLevel,
            preferences.specialNeeds,
            preferences.housingType,
            preferences.yardSize,
            preferences.experienceLevel,
            preferences.timeAvailable,
            JSON.stringify(preferences.location),
            preferences.maxDistance
          ]
        );
      } else {
        // Insert new preferences
        result = await client.query(
          `INSERT INTO user_preferences 
           (user_id, species, breeds, size, age_range, gender, temperament, 
            activity_level, special_needs, housing_type, yard_size, experience_level,
            time_available, location, max_distance, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
           RETURNING *`,
          [
            req.user!.userId,
            preferences.species,
            preferences.breeds,
            preferences.size,
            preferences.ageRange,
            preferences.gender,
            preferences.temperament,
            preferences.activityLevel,
            preferences.specialNeeds,
            preferences.housingType,
            preferences.yardSize,
            preferences.experienceLevel,
            preferences.timeAvailable,
            JSON.stringify(preferences.location),
            preferences.maxDistance
          ]
        );
      }

      return NextResponse.json({
        success: true,
        preferences: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Preferences save error:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);