// app/api/admin/pets/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import db from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();

  const getArray = (name: string) =>
    formData.getAll(name).filter((v) => typeof v === "string") as string[];

  const name = formData.get("name") as string;
  const species = formData.get("species") as string;
  const breed = formData.get("breed") as string;
  const age = parseInt(formData.get("age") as string);
  const gender = formData.get("gender") as string;
  const size = formData.get("size") as string;
  const temperament = getArray("temperament");
  const activity_level = formData.get("activity_level") as string;
  const description = formData.get("description") as string;
  const location_address = formData.get("location_address") as string;
  const diet_type = formData.get("diet_type") as string;
  const diet_frequency = formData.get("diet_frequency") as string;
  const space_requirements = formData.get("space_requirements") as string;
  const adoption_fee = parseFloat(formData.get("adoption_fee") as string);

  // Handle image (file upload or URL)
  let imageUrl = formData.get("image") as string;

  const imageFile = formData.get("image") as File;
  if (imageFile && typeof imageFile !== "string") {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${imageFile.name}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  try {
    await db.query(
      `
      INSERT INTO pets (
        name, species, breed, age, gender, size, temperament, activity_level,
        description, image, location_address, diet_type, diet_frequency,
        space_requirements, adoption_fee
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::text[], $8, $9, $10,
        $11, $12, $13, $14, $15
      )
      `,
      [
        name,
        species,
        breed,
        age,
        gender,
        size,
        temperament,
        activity_level,
        description,
        imageUrl,
        location_address,
        diet_type,
        diet_frequency,
        space_requirements,
        adoption_fee,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting pet:", error);
    return NextResponse.json({ success: false, error: "Failed to add pet" }, { status: 500 });
  }
}
