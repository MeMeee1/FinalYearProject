import { defineEventHandler, readBody, createError } from 'h3'
import { getPrisma } from '../../../utils/prisma_client'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  const body = await readBody(event)

  if (!body?.email || !body?.name || !body?.clerkId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, name, and clerkId are required',
    })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists',
      })
    }

    const existingClerkUser = await prisma.user.findUnique({
      where: { clerkId: body.clerkId },
    })

    if (existingClerkUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this clerkId already exists',
      })
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        clerkId: body.clerkId,
        role: body.role ?? 'BUYER',
        isActive: body.isActive ?? true,
      },
    })

    return { success: true, data: user }
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists',
      })
    }

    if (error?.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    })
  }
})
