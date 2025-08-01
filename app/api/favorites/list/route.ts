import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware-auth';

export const GET = withAuth(
  async (req: AuthenticatedRequest) => {
    const client = await db.connect();

    try {
      const userIdNum = Number(req.user?.userId);
      if (!userIdNum) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
          p.image,
          p.location_address,
          p.adoption_fee,
          p.availability_status
        FROM user_favorites uf
        JOIN pets p ON uf.pet_id = p.id
        WHERE uf.user_id = $1
        `,
        [userIdNum]
      );

      return NextResponse.json({ success: true, pets: result.rows });
    } catch (error) {
      console.error('[Favorites] Error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch favorites' }, { status: 500 });
    } finally {
      client.release();
    }
  },
  { requiredRole: 'user' }
);
