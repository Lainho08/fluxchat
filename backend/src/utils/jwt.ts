import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../types';

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
}
