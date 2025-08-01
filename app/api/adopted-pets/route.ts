import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware-auth';

export const GET = withAuth(
  async (req: AuthenticatedRequest) => {
    const client = await db.connect();

    try {
      const userIdNum = Number(req.user?.userId);
      if (!userIdNum) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const result = await client.query(
        `
        SELECT 
          p.id, 
          p.name, 
          p.species, 
          p.breed, 
          p.gender, 
          p.age, 
          p.size, 
          p.image AS image, 
          p.location_address,
          aa.action_performed_at AS adopted_at,
          p.adoption_fee
        FROM adoption_applications aa
        JOIN pets p ON aa.pet_id = p.id
        WHERE aa.user_id = $1 AND aa.status = 'Accepted'
        `,
        [userIdNum]
      );

      return NextResponse.json({ success: true, pets: result.rows });
    } catch (error) {
      console.error('[AdoptedPets] Error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch adopted pets' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  },
  { requiredRole: 'user' }
);
