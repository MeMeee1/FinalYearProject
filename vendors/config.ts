export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_API_URL is not set, using default: http://localhost:3001');
}