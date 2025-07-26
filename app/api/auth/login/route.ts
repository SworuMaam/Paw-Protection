import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Admin Login Shortcut
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await generateToken({
        userId: 'admin',
        email: process.env.ADMIN_EMAIL!,
        role: 'admin',
        name: 'Administrator',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          email: process.env.ADMIN_EMAIL,
          role: 'admin',
          name: 'Administrator',
          location: null,
          createdAt: new Date().toISOString(),
        },
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, email, password, name, role, location, created_at
         FROM users WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const user = result.rows[0];
      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const token = await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      // Safely parse and return location
      const safeLocation =
        typeof user.location === 'object' && user.location !== null
          ? user.location
          : null;

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          location: safeLocation, // now guaranteed to be object or null
          createdAt: user.created_at,
        },
      });

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
