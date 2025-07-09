import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withAuth } from "@/lib/middleware-auth"; // Replace with your actual middleware path

export const GET = withAuth(async () => {
  try {
    const result = await db.query(`
      SELECT id, name, email, role, location, contact_number, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}, { roles: ["admin"] });
