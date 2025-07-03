import { NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const availabilityOptions = [
  "Available",
  "Pending",
  "Adopted",
  "Fostered_Available",
  "Fostered_Not_Available",
];

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
    let location_address = formData.get("location_address") as string;
    const diet_type = formData.get("diet_type") as string;
    const diet_frequency = formData.get("diet_frequency") as string;
    const space_requirements = formData.get("space_requirements") as string;
    const adoption_fee = parseFloat(formData.get("adoption_fee") as string);

    const fosterIdRaw = formData.get("foster_parent_id") as string;
    let foster_parent_id: number | null = null;

    if (fosterIdRaw && fosterIdRaw.trim() !== "") {
      const fosterId = parseInt(fosterIdRaw);
      if (isNaN(fosterId)) {
        return NextResponse.json(
          { success: false, error: "Invalid foster parent ID" },
          { status: 400 }
        );
      }

      const fosterCheck = await db.query(
        `SELECT id, location FROM users WHERE id = $1 AND role = 'foster-user'`,
        [fosterId]
      );
      if (fosterCheck.rowCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Foster parent ID does not exist or is not a foster user",
          },
          { status: 400 }
        );
      }

      foster_parent_id = fosterId;

      // Override location_address with foster parent's location if available
      if (
        fosterCheck.rows[0].location &&
        fosterCheck.rows[0].location.trim() !== ""
      ) {
        location_address = fosterCheck.rows[0].location;
      }
    }

    // If no location provided and no foster parent assigned, default to Kathmandu, Nepal
    if (
      (!location_address || location_address.trim() === "") &&
      !foster_parent_id
    ) {
      location_address = "Kathmandu, Nepal";
    }

    // Handle availability_status with fallback defaults
    let availability_status = formData.get("availability_status") as string;
    if (
      !availability_status ||
      !availabilityOptions.includes(availability_status)
    ) {
      availability_status = foster_parent_id
        ? "Fostered_Not_Available"
        : "Available";
    }

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
        { success: false, error: "No valid image provided" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO pets (
        name, species, breed, age, gender, size, temperament, activity_level,
        description, image, location_address, diet_type, diet_frequency,
        space_requirements, adoption_fee, foster_parent_id, availability_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::text[], $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17
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
        foster_parent_id,
        availability_status,
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
