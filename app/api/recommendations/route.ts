import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// Haversine formula to calculate distance between two coordinates
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const token = getTokenFromRequest(req);
    if (!token)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const user = await verifyToken(token);
    if (!user?.userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const userId = user.userId;

    // Step 2: Get user preferences
    const prefResult = await pool.query(
      "SELECT * FROM user_preferences WHERE user_id = $1",
      [userId]
    );
    if (prefResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Set preferences first" },
        { status: 400 }
      );
    }
    const preferences = prefResult.rows[0];

    // Step 3: Get user location (includes district)
    const userResult = await pool.query(
      "SELECT location FROM users WHERE id = $1",
      [userId]
    );
    const locationRaw = userResult.rows[0]?.location;
    if (!locationRaw) {
      return NextResponse.json(
        { success: false, error: "User location not set in profile" },
        { status: 400 }
      );
    }

    let location;
    try {
      location =
        typeof locationRaw === "string" ? JSON.parse(locationRaw) : locationRaw;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid location format" },
        { status: 400 }
      );
    }

    const userLat = location.latitude;
    const userLon = location.longitude;
    const userDistrict = location.district;
    const maxDistance = 50; // miles

    const defaultCenter = { lat: 27.7047, lon: 85.3078 }; // Kathmandu fallback if pet/foster has no location

    // Step 4: Fetch all pets + foster parent locations
    const petsResult = await pool.query(`
      SELECT
        pets.*,
        users.location as foster_location
      FROM pets
      LEFT JOIN users ON pets.foster_parent_id = users.id
      WHERE pets.availability_status IN ('Available', 'Fostered_Available')
    `);

    const sameDistrict: any[] = [];
    const otherDistrict: any[] = [];

    // Step 5: Process each pet and calculate match score + distance
    for (const pet of petsResult.rows) {
      let petLat = defaultCenter.lat;
      let petLon = defaultCenter.lon;
      let petDistrict = "Unknown";

      try {
        const fosterLoc = pet.foster_location
          ? typeof pet.foster_location === "string"
            ? JSON.parse(pet.foster_location)
            : pet.foster_location
          : null;

        if (fosterLoc?.latitude && fosterLoc?.longitude) {
          petLat = fosterLoc.latitude;
          petLon = fosterLoc.longitude;
          petDistrict = fosterLoc.district || petDistrict;
        } else if (pet.location) {
          const petLoc =
            typeof pet.location === "string"
              ? JSON.parse(pet.location)
              : pet.location;
          if (petLoc?.latitude && petLoc?.longitude) {
            petLat = petLoc.latitude;
            petLon = petLoc.longitude;
            petDistrict = petLoc.district || petDistrict;
          }
        }
      } catch {
        // Skip if location is malformed
        continue;
      }

      const distance = haversineDistance(userLat, userLon, petLat, petLon);
      if (distance > maxDistance) continue; // Skip pets too far

      // Step 6: Match scoring based on preferences
      const S =
        preferences.species.length === 0 ||
        preferences.species.includes(pet.species)
          ? 25
          : 0;
      const Z =
        preferences.size.length === 0 || preferences.size.includes(pet.size)
          ? 20
          : 0;

      let A = 0;
      if (
        pet.age >= preferences.age_range[0] &&
        pet.age <= preferences.age_range[1]
      ) {
        const mid = (preferences.age_range[0] + preferences.age_range[1]) / 2;
        const diff = Math.abs(pet.age - mid);
        const maxDiff =
          (preferences.age_range[1] - preferences.age_range[0]) / 2 || 1;
        A = 15 * (1 - diff / maxDiff);
      }

      const G =
        preferences.gender.length === 0 ||
        preferences.gender.includes(pet.gender)
          ? 10
          : 0;
      const L =
        preferences.activity_level.length === 0 ||
        preferences.activity_level.includes(pet.activity_level)
          ? 15
          : 0;

      const temperamentPrefs = preferences.temperament || [];
      const temperamentPet = pet.temperament || [];
      const commonTemps = temperamentPrefs.filter((t) =>
        temperamentPet.includes(t)
      );
      const T =
        temperamentPrefs.length === 0
          ? 10
          : (commonTemps.length / temperamentPrefs.length) * 10;

      const H =
        preferences.housing_type &&
        pet.space_requirements &&
        pet.space_requirements
          .toLowerCase()
          .includes(preferences.housing_type.toLowerCase())
          ? 5
          : 0;

      const score = S + Z + A + G + L + T + H;

      const reasons = [];
      if (S) reasons.push(`Species matches (${pet.species})`);
      if (Z) reasons.push(`Size matches (${pet.size})`);
      if (A > 0)
        reasons.push(
          `Age fits your preferred range (${preferences.age_range[0]}–${preferences.age_range[1]})`
        );
      if (G) reasons.push(`Gender matches (${pet.gender})`);
      if (L) reasons.push(`Activity level matches (${pet.activity_level})`);
      if (T > 0)
        reasons.push(`Temperament matches (${commonTemps.join(", ")})`);
      if (H) reasons.push(`Housing compatible (${preferences.housing_type})`);
      reasons.push(
        `Located within ${maxDistance} miles (${distance.toFixed(1)} mi)`
      );

      const recommendation = {
        pet,
        score: Math.round(score * 100) / 100,
        distance,
        matchReasons: reasons,
      };

      // Step 7: Group pets by district match
      if (petDistrict && petDistrict === userDistrict) {
        sameDistrict.push(recommendation);
      } else {
        otherDistrict.push(recommendation);
      }
    }

    // Step 8: Sort each group by distance first, then score
    sameDistrict.sort((a, b) => a.distance - b.distance || b.score - a.score);
    otherDistrict.sort((a, b) => a.distance - b.distance || b.score - a.score);

    // Step 9: Combine both groups (same-district pets first)
    const recommendations = [...sameDistrict, ...otherDistrict];

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
