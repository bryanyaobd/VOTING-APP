import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const VoteSchema = z.object({
  optionId: z.string(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { optionId } = VoteSchema.parse(json)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Vérifier si l'option existe
    const option = await prisma.option.findUnique({
      where: { id: optionId },
      include: { poll: true }
    })

    if (!option) {
      return NextResponse.json(
        { error: "Option non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier si l'IP a déjà voté pour ce sondage
    const existingVote = await prisma.vote.findFirst({
      where: {
        ip,
        option: {
          pollId: option.pollId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: "Vous avez déjà voté pour ce sondage" },
        { status: 400 }
      )
    }

    // Créer le vote
    const vote = await prisma.vote.create({
      data: {
        optionId,
        ip,
      }
    })

    return NextResponse.json(vote)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du vote" },
      { status: 500 }
    )
  }
}