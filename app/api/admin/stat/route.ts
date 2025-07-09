// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { withAuth } from '@/lib/middleware-auth';

export const GET = withAuth(async () => {
  const totalUsers = await db.query('SELECT COUNT(*) FROM users');

  const availablePets = await db.query(`
    SELECT COUNT(*) FROM pets 
    WHERE availability_status IN ('Available', 'Fostered_Available')
  `);

  const adoptedPets = await db.query(`
    SELECT COUNT(*) FROM pets 
    WHERE availability_status = 'Adopted'
  `);

  const pendingPets = await db.query(`
    SELECT COUNT(*) FROM pets 
    WHERE availability_status = 'Pending'
  `);

  return NextResponse.json({
    total_users: parseInt(totalUsers.rows[0].count),
    available_pets: parseInt(availablePets.rows[0].count),
    adopted_pets: parseInt(adoptedPets.rows[0].count),
    active_applications: parseInt(pendingPets.rows[0].count), // using as active applications
  });
}, { requiredRole: 'admin' });
