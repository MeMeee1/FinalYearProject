import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export const getPrisma = () => {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: ['error', 'warn'], // Add logging for debugging
      })
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error)
      throw error
    }
  }
  return prisma
}