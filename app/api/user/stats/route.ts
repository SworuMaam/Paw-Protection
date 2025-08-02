import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user?.userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const userId = user.userId;

    const [favorites, recommendations, applications] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM user_favorites WHERE user_id = $1", [userId]),
      pool.query("SELECT COUNT(*) FROM pets WHERE availability_status IN ('Available', 'Fostered_Available')"),
      pool.query("SELECT COUNT(*) FROM adoption_applications WHERE user_id = $1", [userId])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        savedPets: parseInt(favorites.rows[0].count),
        recommendations: parseInt(recommendations.rows[0].count),
        applications: parseInt(applications.rows[0].count)
      }
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
