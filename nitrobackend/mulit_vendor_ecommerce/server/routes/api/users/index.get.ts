// server/routes/api/users/index.get.ts
import { defineEventHandler, createError, getQuery } from 'h3'
import { getPrisma } from '../../../utils/prisma_client'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const role = query.role as string
    const isActive = query.isActive as string
    const search = query.search as string

    // Build where clause
    const where: any = {}
    
    if (role) {
      where.role = role
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        clerkId: true,
        role: true,
        phone: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive fields like stripeCustomerId if needed
        // Or include relations if needed
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    })

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
    })
  }
})
