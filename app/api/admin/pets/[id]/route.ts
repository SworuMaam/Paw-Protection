import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withAuth } from "@/lib/middleware-auth";

// GET: Fetch single pet details (admin only)
export const GET = withAuth(async (req, { params }) => {
  const petId = params.id;

  try {
    const result = await db.query("SELECT * FROM pets WHERE id = $1", [petId]);
    const pet = result.rows[0];

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error("GET pet error:", error);
    return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 });
  }
}, { requiredRole: "admin" });

// PUT: Update pet information (admin only)
export const PUT = withAuth(async (req: NextRequest, { params }) => {
  const petId = params.id;
  const form = await req.formData();

  try {
    const fields = [
      "name",
      "breed",
      "description",
      "location_address",
      "availability_status",
      "age",
      "size",
      "gender",
      "species",
      "activity_level",
      "adoption_fee"
    ];

    const values = fields.map(field => form.get(field));
    values.push(petId); // for WHERE clause

    await db.query(
      `
      UPDATE pets SET 
        name = $1,
        breed = $2,
        description = $3,
        location_address = $4,
        availability_status = $5,
        age = $6,
        size = $7,
        gender = $8,
        species = $9,
        activity_level = $10,
        adoption_fee = $11
      WHERE id = $12
      `,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT update error:", error);
    return NextResponse.json({ error: "Failed to update pet" }, { status: 500 });
  }
}, { requiredRole: "admin" });

// DELETE: Remove a pet by ID (admin only)
export const DELETE = withAuth(async (req, { params }) => {
  const petId = params.id;

  try {
    const result = await db.query("DELETE FROM pets WHERE id = $1 RETURNING *", [petId]);
    const deleted = result.rows[0];

    if (!deleted) {
      return NextResponse.json({ error: "Pet not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pet deleted", pet: deleted });
  } catch (error) {
    console.error("DELETE pet error:", error);
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 });
  }
}, { requiredRole: "admin" });
