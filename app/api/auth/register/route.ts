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
      isFosterParent,
      fosterCapacity,
      contactNumber,
    } = await request.json();

    // Basic presence check
    if (!name || !email || !password || !contactNumber) {
      return NextResponse.json(
        { error: 'Name, email, password, and contact number are required.' },
        { status: 400 }
      );
    }

    // Validate name: only letters and optional spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { error: 'Name must contain only letters and spaces.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate phone number: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      return NextResponse.json(
        { error: 'Contact number must be exactly 10 digits.' },
        { status: 400 }
      );
    }

    // Foster-specific validation
    if (
      isFosterParent &&
      (!fosterCapacity || typeof fosterCapacity !== 'number' || fosterCapacity < 1)
    ) {
      return NextResponse.json(
        { error: 'Foster capacity must be a number > 0.' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const result = await client.query(
        `INSERT INTO users 
          (name, email, password, location, contact_number, role, foster_capacity) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, name, email, location, contact_number, role, foster_capacity, created_at`,
        [
          name,
          email,
          hashedPassword,
          location,
          contactNumber,
          role,
          isFosterParent ? Number(fosterCapacity) : null,
        ]
      );

      const newUser = result.rows[0];
      const token = await generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      const response = NextResponse.json(
        {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            location: newUser.location,
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
        maxAge: 7 * 24 * 60 * 60, // 1 week
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
