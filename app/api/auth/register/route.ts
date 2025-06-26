import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, JWTPayload } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      location,
      preferences,
      isFosterParent,
      fosterAddress,
      fosterCapacity,
      fosterPreferredSpecies,
    } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Backend validation for foster-specific fields
    if (isFosterParent) {
      if (!fosterAddress || !fosterCapacity) {
        return NextResponse.json({ error: 'Foster address and capacity are required for foster parents.' }, { status: 400 });
      }
      // TODO make validation of number in the input field , NOT HERE
      if (typeof fosterCapacity !== 'number' || fosterCapacity < 1) {
        return NextResponse.json({ error: 'Foster capacity must be a number greater than 0.' }, { status: 400 });
      }
    }

    const role = isFosterParent ? 'foster-user' : 'user';
    const hashedPassword = await hashPassword(password);

    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // Conflict
      }

      const result = await client.query(
        `INSERT INTO users 
            (name, email, password, location, preferences, role, foster_address, foster_capacity, foster_preferred_species) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, name, email, location, preferences, role, created_at`,
        [
          name,
          email,
          hashedPassword,
          location,
          preferences,
          role,
          isFosterParent ? fosterAddress : null,
          isFosterParent ? Number(fosterCapacity) : null,
          isFosterParent ? fosterPreferredSpecies : null, // pg driver handles JS array to PG array conversion
        ]
      );

      const newUser = result.rows[0];
      const token = await generateToken({ // Await the async token generation
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      });

      const response = NextResponse.json(
        {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            location: newUser.location,
            preferences: newUser.preferences,
            createdAt: newUser.created_at,
            role: newUser.role,
          },
        },
        { status: 201 }
      );

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
