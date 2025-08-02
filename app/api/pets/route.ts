import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(
      `SELECT id, name, species, breed, age, gender, size, temperament, 
              activity_level, description, image, location_address, 
              adoption_fee, availability_status, created_at
       FROM pets
       WHERE availability_status != 'Adopted'
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ pets: res.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
  }
}
