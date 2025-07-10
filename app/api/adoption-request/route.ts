import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware-auth";
import db from "@/lib/db";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { petId } = await req.json();
  const userId = req.user!.userId;

  if (!petId) {
    return NextResponse.json({ error: "Missing petId" }, { status: 400 });
  }

  const client = await db.connect();

  try {
    // Check if pet is still available
    const petRes = await client.query(
      "SELECT availability_status FROM pets WHERE id = $1",
      [petId]
    );
    const pet = petRes.rows[0];

    if (
      !pet ||
      (pet.availability_status !== "Available" &&
        pet.availability_status !== "Fostered_Available")
    ) {
      return NextResponse.json(
        { error: "Pet is not available for adoption" },
        { status: 400 }
      );
    }

    // Create adoption application
    await client.query(
      `
      INSERT INTO adoption_applications (user_id, pet_id, status, application_data)
      VALUES ($1, $2, 'Pending', '{}')
    `,
      [userId, petId]
    );

    // Update pet status
    await client.query(
      `
      UPDATE pets SET availability_status = 'Pending', updated_at = NOW()
      WHERE id = $1
    `,
      [petId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Adoption request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const POST = withAuth(handler);
