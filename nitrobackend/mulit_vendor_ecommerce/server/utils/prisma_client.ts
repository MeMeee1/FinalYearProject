import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

let prisma: PrismaClient | null = null

export const getPrisma = () => {
  if (!prisma) {
    if (!process.env.DATABASE_URL) {
      console.error('⚠️  DATABASE_URL is missing! Check your .env file')
      throw new Error('DATABASE_URL not found in environment variables')
    }

    try {
      prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error)
      throw error
    }
  }
  return prisma
}