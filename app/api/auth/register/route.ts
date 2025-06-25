import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, location, preferences } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // Conflict
      }

      // Insert new user into the database
      const result = await client.query(
        'INSERT INTO users (name, email, password, location, preferences) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, location, preferences, created_at',
        [name, email, hashedPassword, location, preferences]
      );

      const newUser = result.rows[0];

      // Generate JWT token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: 'user', // Default role for new registrations
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
            preferences: newUser.preferences,
            createdAt: newUser.created_at,
            role: 'user', // Explicitly set role for client
          },
          token,
        },
        { status: 201 } // Created
      );

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
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