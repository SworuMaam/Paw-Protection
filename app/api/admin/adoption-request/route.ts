import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware-auth";
import db from "@/lib/db";

async function GET(req: NextRequest) {
  const client = await db.connect();

  try {
    const result = await client.query(`
      SELECT
        aa.id,
        aa.user_id,
        u.name AS user_name,
        aa.pet_id,
        p.name AS pet_name,
        aa.status,
        aa.created_at
      FROM adoption_applications aa
      JOIN users u ON aa.user_id = u.id
      JOIN pets p ON aa.pet_id = p.id
      ORDER BY aa.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch adoption requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch adoption requests" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

async function PUT(req: NextRequest) {
  const { requestId, status } = await req.json();

  if (!requestId || !["Accepted", "Rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const client = await db.connect();

  try {
    const appRes = await client.query(
      "SELECT pet_id FROM adoption_applications WHERE id = $1",
      [requestId]
    );

    const petId = appRes.rows[0]?.pet_id;

    if (!petId) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update application status
    await client.query(
      `UPDATE adoption_applications SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, requestId]
    );

    // Update pet availability if accepted or rejected
    if (status === "Accepted") {
      await client.query(
        `UPDATE pets SET availability_status = 'Adopted', updated_at = NOW() WHERE id = $1`,
        [petId]
      );
    } else if (status === "Rejected") {
      await client.query(
        `UPDATE pets SET availability_status = 'Available', updated_at = NOW() WHERE id = $1`,
        [petId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const GET = withAuth(GET, ["admin"]);
export const PUT = withAuth(PUT, ["admin"]);
