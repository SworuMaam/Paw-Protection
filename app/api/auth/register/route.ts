import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import pool from '@/lib/db';
import { geocodeAddressNominatim } from '@/lib/geocode';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      location: locationInput,
      isFosterParent,
      fosterCapacity,
      contactNumber,
    } = await request.json();

    if (!name || !email || !password || !contactNumber) {
      return NextResponse.json(
        { error: 'Name, email, password, and contact number are required.' },
        { status: 400 }
      );
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { error: 'Name must contain only letters and spaces.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      return NextResponse.json({
        error: 'Contact number must be exactly 10 digits.',
      }, { status: 400 });
    }

    if (
      isFosterParent &&
      (!fosterCapacity || typeof fosterCapacity !== 'number' || fosterCapacity < 1)
    ) {
      return NextResponse.json(
        { error: 'Foster capacity must be a number > 0.' },
        { status: 400 }
      );
    }

    // Geocode
    let locationJSON = null;
    if (locationInput) {
      const geoLocation = await geocodeAddressNominatim(locationInput);

      if (!geoLocation) {
        return NextResponse.json(
          { error: 'Invalid location provided. Please enter a valid city or address.' },
          { status: 400 }
        );
      }

      locationJSON = {
        address: geoLocation.address,
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        district: geoLocation.district,
      };
    }

    const role = isFosterParent ? 'foster-user' : 'user';
    const hashedPassword = await hashPassword(password);

    const client = await pool.connect();
    try {
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
      }

      await client.query(
        `INSERT INTO users 
          (name, email, password, location, contact_number, role, foster_capacity) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          name,
          email,
          hashedPassword,
          locationJSON,
          contactNumber,
          role,
          isFosterParent ? fosterCapacity : null,
        ]
      );

      return NextResponse.json({ success: true }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
