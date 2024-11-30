import { useState, useEffect } from 'react'
import type { Poll } from '@/lib/types'

interface UsePollReturn {
  poll: Poll | null;
  loading: boolean;
  error: string | null;
  voting: boolean;
  submitVote: (optionId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function usePoll(pollId: string): UsePollReturn {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voting, setVoting] = useState(false)

  const fetchPoll = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/poll/${pollId}`, { signal })
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Erreur lors de la récupération du sondage')
        setPoll(null)
        return
      }

      // Vérification des données reçues
      if (!data || !data.id || !data.title || !Array.isArray(data.options)) {
        setError('Les données du sondage sont invalides ou incomplètes')
        setPoll(null)
        return
      }

      // Transformation des données Prisma en type Poll avec vérifications
      const formattedPoll: Poll = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        options: data.options.map((option: any) => ({
          id: option?.id || '',
          text: option?.text || '',
          pollId: option?.pollId || data.id,
          _count: {
            votes: option?._count?.votes || 0
          }
        })),
        createdAt: new Date(data.createdAt || Date.now()),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
      }
      
      setPoll(formattedPoll)
      setError(null)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      
      // Gestion silencieuse des erreurs - pas de console.error
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement')
      setPoll(null)
    } finally {
      setLoading(false)
    }
  }

  const submitVote = async (optionId: string): Promise<boolean> => {
    if (voting || !poll) return false
    setVoting(true)
    
    try {
      if (!optionId) {
        setError('ID de l\'option non valide')
        return false
      }

      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId,
          pollId: poll.id
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Erreur lors du vote')
        return false
      }

      await fetchPoll()
      return true
    } catch (error) {
      // Gestion silencieuse des erreurs - pas de console.error
      setError(error instanceof Error ? error.message : 'Erreur lors du vote')
      return false
    } finally {
      setVoting(false)
    }
  }

  useEffect(() => {
    if (!pollId) {
      setError('ID du sondage non valide')
      return
    }

    const controller = new AbortController()
    fetchPoll(controller.signal)
    
    return () => {
      controller.abort()
    }
  }, [pollId])

  const refresh = async () => {
    await fetchPoll()
  }

  return {
    poll,
    loading,
    error,
    voting,
    submitVote,
    refresh
  }
}