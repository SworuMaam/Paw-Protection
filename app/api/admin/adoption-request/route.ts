import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware-auth";
import db from "@/lib/db";

// GET: Fetch all adoption requests
async function handleGet(req: NextRequest) {
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
        aa.created_at,
        aa.action_performed_at
      FROM adoption_applications aa
      JOIN users u ON aa.user_id = u.id
      JOIN pets p ON aa.pet_id = p.id
      ORDER BY aa.created_at DESC
    `);

    return NextResponse.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error("GET adoption-request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch adoption requests" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PUT: Accept or reject adoption requests
async function handlePut(req: NextRequest) {
  const client = await db.connect();

  try {
    const body = await req.json();
    const { requestId, status } = body;

    if (!requestId || !["Accepted", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get pet_id and user_id from adoption_applications
    const appRes = await client.query(
      "SELECT pet_id, user_id FROM adoption_applications WHERE id = $1",
      [requestId]
    );

    if (appRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const { pet_id, user_id } = appRes.rows[0];

    // Update application status
    await client.query(
      `
      UPDATE adoption_applications
      SET status = $1, action_performed_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `,
      [status, requestId]
    );

    // Update pet info
    if (status === "Accepted") {
      // Fetch user's full location
      const userRes = await client.query(
        "SELECT location FROM users WHERE id = $1",
        [user_id]
      );

      const userLocation = userRes.rows[0]?.location || null;

      await client.query(
        `
        UPDATE pets
        SET
          availability_status = 'Adopted',
          foster_parent_id = NULL,
          location_address = $1,
          updated_at = NOW()
        WHERE id = $2
      `,
        [userLocation, pet_id]
      );
    } else if (status === "Rejected") {
      await client.query(
        `
        UPDATE pets
        SET
          availability_status = 'Available',
          updated_at = NOW()
        WHERE id = $1
      `,
        [pet_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT adoption-request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update adoption request" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const GET = withAuth(handleGet, ["admin"]);
export const PUT = withAuth(handlePut, ["admin"]);
