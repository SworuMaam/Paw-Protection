import { JwtPayload } from 'jsonwebtoken';

/**
 * Extends the default JWT Payload to include our custom fields.
 */
export interface DecodedTokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin'| 'foster-user';
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'foster-user';  
}