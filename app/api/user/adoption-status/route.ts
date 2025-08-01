import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware-auth";
import db from "@/lib/db";

async function handleGet(req: AuthenticatedRequest) {
  const client = await db.connect();

  try {
    const user = req.user;
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await client.query(
      `
      SELECT
        aa.id,
        aa.pet_id,
        p.name AS pet_name,
        p.image AS pet_image,
        aa.status,
        aa.created_at,
        aa.action_performed_at
      FROM adoption_applications aa
      JOIN pets p ON aa.pet_id = p.id
      WHERE aa.user_id = $1
      ORDER BY aa.created_at DESC
    `,
      [user.userId]
    );

    return NextResponse.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error("GET user adoption-status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch adoption requests" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const GET = withAuth(handleGet, { requiredRole: "user" });
