"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Poll } from '@/lib/types'

interface PollCardProps {
  poll: Poll
}

export default function PollCard({ poll }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => 
    sum + (option._count?.votes || 0), 0
  )

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()

  return (
    <Card className={isExpired ? 'opacity-75' : ''}>
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
            {poll.expiresAt && (
              <span className="ml-2">
                • {isExpired ? 'Expiré' : `Expire le ${new Date(poll.expiresAt).toLocaleDateString()}`}
              </span>
            )}
          </div>
          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full">
              {isExpired ? 'Voir les résultats' : 'Voter'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
