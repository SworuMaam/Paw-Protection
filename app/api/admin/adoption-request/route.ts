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

    return NextResponse.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error("GET /api/admin/adoption-request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch adoption requests" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

async function PUT(req: NextRequest) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { requestId, status } = body;

    if (!requestId || !["Accepted", "Rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 });
    }

    // Check if adoption application exists
    const appRes = await client.query(
      "SELECT pet_id FROM adoption_applications WHERE id = $1",
      [requestId]
    );

    if (appRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const petId = appRes.rows[0].pet_id;

    // Update application status
    await client.query(
      "UPDATE adoption_applications SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, requestId]
    );

    // Update pet availability if accepted or rejected
    if (status === "Accepted") {
      await client.query(
        "UPDATE pets SET availability_status = 'Adopted', updated_at = NOW() WHERE id = $1",
        [petId]
      );
    } else if (status === "Rejected") {
      await client.query(
        "UPDATE pets SET availability_status = 'Available', updated_at = NOW() WHERE id = $1",
        [petId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/adoption-request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update adoption request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const GET = withAuth(GET, ["admin"]);
export const PUT = withAuth(PUT, ["admin"]);
