import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTokenWithNumber(length: number = 24): string {
  if (length % 2 !== 0) {
    throw new Error("Token length for hex encoding must be an even number.");
  }
  const byteLength = length / 2;
  return crypto.randomBytes(byteLength).toString('hex');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}