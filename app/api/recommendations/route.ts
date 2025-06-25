import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware-auth';
import pool from '@/lib/db';
import { Pet } from '@/types/pet';
import { UserPreferences, PetRecommendation } from '@/types/preferences';

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate compatibility score between user preferences and pet
function calculateCompatibilityScore(preferences: UserPreferences, pet: any): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Species match (25 points)
  if (preferences.species.length === 0 || preferences.species.includes(pet.species)) {
    score += 25;
    if (preferences.species.includes(pet.species)) {
      reasons.push(`Perfect species match: ${pet.species}`);
    }
  }

  // Size match (20 points)
  if (preferences.size.length === 0 || preferences.size.includes(pet.size)) {
    score += 20;
    if (preferences.size.includes(pet.size)) {
      reasons.push(`Ideal size: ${pet.size}`);
    }
  }

  // Age range match (15 points)
  const [minAge, maxAge] = preferences.ageRange;
  if (pet.age >= minAge && pet.age <= maxAge) {
    score += 15;
    reasons.push(`Perfect age range: ${pet.age} years old`);
  } else if (Math.abs(pet.age - minAge) <= 1 || Math.abs(pet.age - maxAge) <= 1) {
    score += 10; // Close to preferred age range
    reasons.push(`Close to preferred age range`);
  }

  // Gender match (10 points)
  if (preferences.gender.length === 0 || preferences.gender.includes(pet.gender)) {
    score += 10;
    if (preferences.gender.includes(pet.gender)) {
      reasons.push(`Gender preference match`);
    }
  }

  // Activity level match (15 points)
  if (preferences.activityLevel.length === 0 || preferences.activityLevel.includes(pet.activity_level)) {
    score += 15;
    if (preferences.activityLevel.includes(pet.activity_level)) {
      reasons.push(`Perfect activity level: ${pet.activity_level}`);
    }
  }

  // Temperament match (10 points)
  if (preferences.temperament.length > 0 && pet.temperament) {
    const matchingTraits = pet.temperament.filter((trait: string) => 
      preferences.temperament.includes(trait)
    );
    if (matchingTraits.length > 0) {
      const temperamentScore = (matchingTraits.length / preferences.temperament.length) * 10;
      score += temperamentScore;
      reasons.push(`Matching temperament: ${matchingTraits.join(', ')}`);
    }
  } else if (preferences.temperament.length === 0) {
    score += 5; // Neutral score if no preference
  }

  // Housing compatibility (5 points)
  if (pet.compatibility) {
    const compatibility = typeof pet.compatibility === 'string' 
      ? JSON.parse(pet.compatibility) 
      : pet.compatibility;
    
    if (preferences.housingType === 'apartment' && compatibility.apartments) {
      score += 5;
      reasons.push('Apartment-friendly');
    } else if (preferences.housingType === 'house' && !compatibility.apartments) {
      score += 5;
      reasons.push('Perfect for house living');
    }
  }

  return { score: Math.min(score, maxScore), reasons };
}

async function handler(req: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      // Get user preferences
      const preferencesResult = await client.query(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [req.user!.userId]
      );

      if (preferencesResult.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No preferences found. Please set your preferences first.'
        });
      }

      const preferencesRow = preferencesResult.rows[0];
      const preferences: UserPreferences = {
        userId: preferencesRow.user_id,
        species: preferencesRow.species || [],
        breeds: preferencesRow.breeds || [],
        size: preferencesRow.size || [],
        ageRange: preferencesRow.age_range || [0, 15],
        gender: preferencesRow.gender || [],
        temperament: preferencesRow.temperament || [],
        activityLevel: preferencesRow.activity_level || [],
        specialNeeds: preferencesRow.special_needs || false,
        housingType: preferencesRow.housing_type || '',
        yardSize: preferencesRow.yard_size || '',
        experienceLevel: preferencesRow.experience_level || '',
        timeAvailable: preferencesRow.time_available || '',
        location: preferencesRow.location || {},
        maxDistance: preferencesRow.max_distance || 50
      };

      // Get all available pets
      const petsResult = await client.query(
        "SELECT * FROM pets WHERE availability_status = 'Available' OR availability_status = 'Fostered_Available'"
      );

      const pets = petsResult.rows;
      const recommendations: PetRecommendation[] = [];

      for (const pet of pets) {
        const { score, reasons } = calculateCompatibilityScore(preferences, pet);
        
        // Calculate distance if user location is available
        let distance: number | undefined;
        if (preferences.location.coordinates && pet.location_coordinates) {
          const [userLat, userLon] = preferences.location.coordinates;
          // Parse PostgreSQL point format (x,y) 
          const coordsMatch = pet.location_coordinates.match(/\(([^,]+),([^)]+)\)/);
          if (coordsMatch) {
            const petLon = parseFloat(coordsMatch[1]);
            const petLat = parseFloat(coordsMatch[2]);
            distance = calculateDistance(userLat, userLon, petLat, petLon);
          }
        }

        // Only include pets within max distance (if distance can be calculated)
        if (distance === undefined || distance <= preferences.maxDistance) {
          recommendations.push({
            pet: {
              id: pet.id.toString(),
              name: pet.name,
              species: pet.species,
              breed: pet.breed,
              age: pet.age,
              gender: pet.gender,
              size: pet.size,
              temperament: pet.temperament || [],
              activityLevel: pet.activity_level,
              healthStatus: pet.health_status,
              adoptionRequirements: pet.adoption_requirements || [],
              description: pet.description,
              images: pet.images || [],
              location: {
                address: pet.location_address,
                coordinates: pet.location_coordinates ? 
                  pet.location_coordinates.match(/\(([^,]+),([^)]+)\)/)?.slice(1, 3).map(Number) as [number, number] :
                  [0, 0],
                suitability: pet.location_suitability || []
              },
              care: {
                diet: {
                  type: pet.diet_type || '',
                  frequency: pet.diet_frequency || ''
                },
                toys: pet.toys || [],
                spaceRequirements: {
                  indoor: pet.space_requirements?.indoor || '',
                  outdoor: pet.space_requirements?.outdoor || ''
                }
              },
              compatibility: typeof pet.compatibility === 'string' 
                ? JSON.parse(pet.compatibility) 
                : pet.compatibility || {},
              adoptionFee: pet.adoption_fee,
              availabilityStatus: pet.availability_status as 'Available' | 'Pending' | 'Adopted' | 'Fostered_Available',
              createdAt: pet.created_at,
              updatedAt: pet.updated_at
            },
            score,
            matchReasons: reasons,
            distance
          });
        }
      }

      // Sort by score (highest first)
      recommendations.sort((a, b) => b.score - a.score);

      // Limit to top 20 recommendations
      const topRecommendations = recommendations.slice(0, 20);

      return NextResponse.json({
        success: true,
        recommendations: topRecommendations,
        total: topRecommendations.length
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);