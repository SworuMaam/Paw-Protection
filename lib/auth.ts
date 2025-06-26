import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// Ensure your JWT_SECRET is base64 encoded for JOSE
// For production, this should be a strong, random string.
// A common practice is to generate it and store it as a base64 string.
// Example: Buffer.from(process.env.JWT_SECRET!).toString('base64')
const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

// Corrected JWTPayload interface
export interface JWTPayload extends jose.JWTPayload { // Extend jose's JWTPayload
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'foster-user';
  name: string;
  // Add an index signature to allow for additional custom properties if needed by jose
  // Though extending jose.JWTPayload often handles this for known JWT claims,
  // this is a robust way to allow custom properties.
  [propName: string]: any;
}

// Updated generateToken using jose
export async function generateToken(payload: JWTPayload): Promise<string> {
  // JOSE generally expects an Async function, so we make it one.
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // HS256 is a common algorithm
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d') // e.g., '2h', '7d'
    .sign(JWT_SECRET_KEY);
}

// Updated verifyToken using jose
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET_KEY, {
      algorithms: ['HS256'], // Specify the algorithm used for signing
    });
    // Cast the payload to your custom JWTPayload interface
    return payload as JWTPayload;
  } catch (error) {
    console.error('Invalid JWT token:', error);
    // Log the actual JOSE error for better debugging
    if (error instanceof jose.errors.JWTExpired) {
        console.error('Token expired');
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
        console.error('Token signature verification failed');
    } else {
        console.error('Unknown JWT error:', error);
    }
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  // bcryptjs is typically fine for Node.js API routes
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  // bcryptjs is typically fine for Node.js API routes
  return bcrypt.compare(password, hashedPassword);
}

// ✅ IMPORTANT: This method exclusively reads the 'auth-token' cookie
export function getTokenFromRequest(request: NextRequest): string | null {
    const cookie = request.cookies.get('auth-token');
    if (!cookie) {
        console.log('[Auth] No auth-token cookie found in request.');
        return null;
    }
    return cookie.value;
}

export function isAdmin(payload: JWTPayload): boolean {
    return payload.role === 'admin';
}

export function isUser(payload: JWTPayload): boolean {
    return payload.role === 'user';
}
