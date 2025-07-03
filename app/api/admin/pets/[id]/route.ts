import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { withAuth } from '@/lib/middleware-auth';

export const GET = withAuth(async (req, { params }) => {
  const petId = params.id;
  const result = await db.query('SELECT * FROM pets WHERE id = $1', [petId]);
  const pet = result.rows[0];
  return NextResponse.json({ pet });
}, { requiredRole: 'admin' });

export const PUT = withAuth(async (req, { params }) => {
  const petId = params.id;
  const form = await req.formData();

  const fields = [
    'name', 'breed', 'description', 'location_address',
    'availability_status', 'age', 'size', 'gender', 'species',
    'activity_level', 'adoption_fee'
  ];
  
  const values = fields.map(field => form.get(field));
  values.push(petId);

  await db.query(
    `UPDATE pets SET 
      name = $1, breed = $2, description = $3, location_address = $4, 
      availability_status = $5, age = $6, size = $7, gender = $8, 
      species = $9, activity_level = $10, adoption_fee = $11
     WHERE id = $12`,
    values
  );

  return NextResponse.json({ success: true });
}, { requiredRole: 'admin' });
