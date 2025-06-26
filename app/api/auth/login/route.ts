import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth'; // generateToken is now async
import pool from '@/lib/db'; // Assuming this is your database connection

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if it's admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await generateToken({ // Await generateToken
        userId: 'admin',
        email: process.env.ADMIN_EMAIL!,
        role: 'admin',
        name: 'Administrator'
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          email: process.env.ADMIN_EMAIL,
          role: 'admin',
          name: 'Administrator'
        },
      });

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    // Check user in database
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, email, password, name, role, location, created_at FROM users WHERE email = $1',
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

      const token = await generateToken({ // Await generateToken
        userId: user.id,
        email: user.email,
        role: user.role, // Use the role from the database
        name: user.name
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email, 
          role: user.role, // Return the correct role
          name: user.name,
          location: user.location,
          createdAt: user.created_at
        },
      });

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
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