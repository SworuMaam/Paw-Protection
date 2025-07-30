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
  } catch (error: any) {
    console.error("GET pet error:", error);
    return NextResponse.json({ error: "Failed to fetch pet", details: error.message }, { status: 500 });
  }
}, { requiredRole: "admin" });

// PUT: Update pet information (admin only)
export const PUT = withAuth(async (req: NextRequest, { params }) => {
  const petId = params.id;
  const form = await req.formData();

  try {
    const temperament = form.getAll("temperament");
    const foster_parent_id_raw = form.get("foster_parent_id")?.toString().trim();
    const foster_parent_id = foster_parent_id_raw ? Number(foster_parent_id_raw) : null;

    const pgTemperamentArray = `{${temperament.map((t) => `"${t}"`).join(",")}}`;

    let location_address = form.get("location_address")?.toString().trim() || "";
    let availability_status = form.get("availability_status")?.toString().trim();

    // If foster parent assigned, fetch their location
    if (foster_parent_id) {
      const fosterCheck = await db.query(
        `SELECT location FROM users WHERE id = $1 AND role = 'foster-user'`,
        [foster_parent_id]
      );

      if (fosterCheck.rowCount === 0) {
        return NextResponse.json(
          { error: "Foster parent not found or not a foster user" },
          { status: 400 }
        );
      }

      const fosterLocation = fosterCheck.rows[0].location;

      if (
        fosterLocation &&
        typeof fosterLocation === "object" &&
        typeof fosterLocation.address === "string" &&
        fosterLocation.address.trim() !== ""
      ) {
        location_address = fosterLocation.address;
      }

      // Force availability to Fostered_Not_Available if foster assigned
      availability_status = "Fostered_Not_Available";
    }

    const values = [
      form.get("description"),
      location_address,
      availability_status,
      Number(form.get("age")),
      form.get("size"),
      form.get("gender"),
      form.get("activity_level"),
      form.get("diet_type"),
      form.get("diet_frequency"),
      form.get("space_requirements"),
      Number(form.get("adoption_fee")),
      foster_parent_id,
      pgTemperamentArray,
      Number(petId),
    ];

    await db.query(
      `
      UPDATE pets SET 
        description = $1,
        location_address = $2,
        availability_status = $3,
        age = $4,
        size = $5,
        gender = $6,
        activity_level = $7,
        diet_type = $8,
        diet_frequency = $9,
        space_requirements = $10,
        adoption_fee = $11,
        foster_parent_id = $12,
        temperament = $13
      WHERE id = $14
      `,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT update error:", error);
    return NextResponse.json(
      { error: "Failed to update pet", details: error.message },
      { status: 500 }
    );
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
  } catch (error: any) {
    console.error("DELETE pet error:", error);
    return NextResponse.json({ error: "Failed to delete pet", details: error.message }, { status: 500 });
  }
}, { requiredRole: "admin" });
