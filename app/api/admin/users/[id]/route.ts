import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withAuth } from "@/lib/middleware-auth";

export const GET = withAuth(
  async (req: NextRequest, { params }: any) => {
    const userId = params.id;

    try {
      const userQuery = await db.query(
        `SELECT id, name, email, role, location, contact_number, foster_capacity, created_at
         FROM users WHERE id = $1`,
        [userId]
      );

      const adoptedCountQuery = await db.query(
        `SELECT COUNT(*) FROM adoption_applications 
         WHERE user_id = $1 AND status = 'Accepted'`, // fixed to match your logic
        [userId]
      );

      const preferenceQuery = await db.query(
        `SELECT housing_type, yard_size, experience_level, time_available
         FROM user_preferences WHERE user_id = $1`,
        [userId]
      );

      if (userQuery.rows.length === 0) {
        return new NextResponse("User not found", { status: 404 });
      }

      const user = userQuery.rows[0];
      const adoptedPetsCount = parseInt(adoptedCountQuery.rows[0].count);
      const preferences = preferenceQuery.rows[0] || {};

      return NextResponse.json({ ...user, adoptedPetsCount, ...preferences });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return new NextResponse("Internal server error", { status: 500 });
    }
  },
  { roles: ["admin"] }
);
