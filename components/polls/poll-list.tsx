'use client'

import { useEffect, useState } from 'react'
import PollCard from './poll-card'
import type { Poll } from '@/lib/types'
import { PollListSkeleton } from './loading-skeletons'

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/poll')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des sondages')
        }
        const data = await response.json()
        setPolls(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [])

  if (loading) {
    return <PollListSkeleton />
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (polls.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun sondage n'a été créé pour le moment.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  )
}