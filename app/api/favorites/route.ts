import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware-auth";

// POST: Add favorite
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { petId } = await req.json();
    const userId = Number(req.user?.userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.query(
      `INSERT INTO user_favorites (user_id, pet_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, pet_id) DO NOTHING`,
      [userId, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}, { requiredRole: "user" });

// DELETE: Remove favorite
export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { petId } = await req.json();
    const userId = Number(req.user?.userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.query(
      `DELETE FROM user_favorites WHERE user_id = $1 AND pet_id = $2`,
      [userId, petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error removing favorite:", err);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}, { requiredRole: "user" });

// GET: List all favorites (optional if using /favorite/list route)
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.query(
      `SELECT p.* FROM pets p
       JOIN user_favorites uf ON p.id = uf.pet_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );

    const pets = result.rows.map((pet) => ({
      ...pet,
      isFavorited: true,
    }));

    return NextResponse.json(pets);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}, { requiredRole: "user" });
