// utils/prisma.ts or similar

import { PrismaClient } from '@prisma/client'
import 'dotenv/config'  // ← This is the key line — loads .env into process.env

let prisma: PrismaClient | null = null

export const getPrisma = () => {
  if (!prisma) {
    // Optional: log to confirm it's loaded
    if (!process.env.DATABASE_URL) {
      console.error('⚠️  DATABASE_URL is missing! Check your .env file')
      throw new Error('DATABASE_URL not found in environment variables')
    }

    try {
      prisma = new PrismaClient({
        log: ['query', 'error', 'warn'], // 'query' is helpful during dev
      })
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error)
      throw error
    }
  }
  return prisma
}