import { JwtPayload } from 'jsonwebtoken';

/**
 * Extends the default JWT Payload to include our custom fields.
 */
export interface DecodedTokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
  name: string;
}