// app/api/admin/pets/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
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

    let imageUrl = "";
    const imageField = formData.get("image");

    if (imageField instanceof File) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(imageField.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid image type: ${imageField.type}` },
          { status: 400 }
        );
      }

      const bytes = await imageField.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataURI = `data:${imageField.type};base64,${base64}`;

      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: "paw_protection_pets",
      });
      imageUrl = uploadRes.secure_url;
    } else {
      return NextResponse.json(
        { success: false, error: "No valid image file provided" },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
