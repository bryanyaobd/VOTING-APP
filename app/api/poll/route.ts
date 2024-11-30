import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const PollSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  options: z.array(z.string().min(1)).min(2),
  expiresAt: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = PollSchema.parse(json)

    const poll = await prisma.poll.create({
      data: {
        title: body.title,
        description: body.description,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        options: {
          create: body.options.map(text => ({ text }))
        }
      },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    })

    return NextResponse.json(poll)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du sondage" },
      { status: 400 }
    )
  }
}

export async function GET() {
  const polls = await prisma.poll.findMany({
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(polls)
}
