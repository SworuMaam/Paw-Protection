import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// Add pet to user's favorites
export async function POST(req: NextRequest) {
  try {
    const { petId } = await req.json();
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Insert favorite; ON CONFLICT DO NOTHING prevents duplicates
    await pool.query(
      `INSERT INTO user_favorites (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [user.id, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// Remove pet from user's favorites
export async function DELETE(req: NextRequest) {
  try {
    const { petId } = await req.json();
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await pool.query(
      `DELETE FROM user_favorites WHERE user_id = $1 AND pet_id = $2`,
      [user.id, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error removing favorite:", err);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}

// Get list of user's favorite pets with isFavorited flag
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Select all columns from pets joined with user_favorites for the user
    const result = await pool.query(
      `SELECT p.* FROM pets p
       JOIN user_favorites uf ON p.id = uf.pet_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`, // optional: newest favorites first
      [user.id]
    );

    // Add isFavorited: true to each pet for UI usage
    const petsWithFavoriteFlag = result.rows.map((pet) => ({
      ...pet,
      isFavorited: true,
    }));

    return NextResponse.json(petsWithFavoriteFlag);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}
