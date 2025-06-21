import { compare, hash } from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash a password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

/**
 * Compare a password with a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

/**
 * Generate a random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

