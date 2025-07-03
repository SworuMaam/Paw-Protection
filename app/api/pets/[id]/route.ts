import { NextResponse } from "next/server";
import db from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const id = params.id;

  try {
    const res = await db.query(
      `SELECT id, name, species, breed, age, gender, size, temperament, 
              activity_level, description, image, location_address, 
              adoption_fee, availability_status, foster_parent_id, diet_type,
              diet_frequency, space_requirements, created_at
       FROM pets WHERE id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json({ pet: res.rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 });
  }
}
