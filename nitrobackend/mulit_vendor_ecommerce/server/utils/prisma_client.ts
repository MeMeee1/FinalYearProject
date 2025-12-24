// utils/prisma_client.ts

import { PrismaClient } from '@prisma/client'  // ← Keep this standard import
import 'dotenv/config'

let prisma: PrismaClient | null = null

// Add this global declaration to prevent multiple instances in serverless
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const getPrisma = () => {
  if (!prisma) {
    // In serverless/background functions, reuse global instance
    if (global.prisma) {
      prisma = global.prisma
    } else {
      prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })

      // Assign to global for reuse
      global.prisma = prisma
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found')
    }
  }

  return prisma
}