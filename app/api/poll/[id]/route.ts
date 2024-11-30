import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Attendre que les paramètres soient résolus
  const { id } = await params;

  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Sondage non trouvé' }, { status: 404 });
    }

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Erreur lors de la récupération du sondage:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du sondage' }, { status: 500 });
  }
}