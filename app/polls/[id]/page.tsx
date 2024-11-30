'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePoll } from '@/hooks/use-poll'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import VoteChart from '@/components/polls/vote-chart'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PollDetailSkeleton } from '@/components/polls/loading-skeletons'

export default function PollPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { poll, loading, error, voting, submitVote } = usePoll(id)

  // État de chargement avec spinner
  if (loading) {
    return <PollDetailSkeleton />
  }

  // Gestion des erreurs avec un message explicite
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription className="text-center">
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/polls">
            <Button variant="outline">
              Retour aux sondages
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Vérification de l'existence du sondage et de ses options
  if (!poll || !Array.isArray(poll.options)) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sondage non trouvé</CardTitle>
            <CardDescription className="text-center">
              Le sondage que vous recherchez n'existe pas ou a été supprimé.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/polls">
              <Button variant="outline">
                Retour aux sondages
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false
  
  // Calcul du total des votes avec gestion des valeurs nulles
  const totalVotes = poll.options.reduce((sum, option) => 
    sum + (option._count?.votes ?? 0), 0)

  const handleVote = async (optionId: string) => {
    try {
      if (isExpired) {
        throw new Error("Le sondage est terminé")
      }
      
      const success = await submitVote(optionId)
      
      if (success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error)
      // Possibilité d' ajouter ici un toast ou une notification pour l'utilisateur
    }
  }

  // Formatage de la date d'expiration
  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-center">
            {poll.title}
          </CardTitle>
          
          {poll.description && (
            <CardDescription className="text-center text-gray-600">
              {poll.description}
            </CardDescription>
          )}
          
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <span className="font-semibold">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
            
            {poll.expiresAt && (
              <>
                <span>•</span>
                <span className={isExpired ? 'text-red-500' : 'text-green-500'}>
                  {isExpired 
                    ? 'Sondage terminé' 
                    : `Expire le ${formatExpirationDate(new Date(poll.expiresAt))}`
                  }
                </span>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {poll.options.map((option) => {
            const voteCount = option._count?.votes ?? 0
            const votePercentage = totalVotes > 0 
              ? ((voteCount / totalVotes) * 100).toFixed(1) 
              : '0'

            return (
              <Button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={voting || isExpired}
                variant={voting ? "ghost" : "outline"}
                className="w-full justify-between hover:bg-gray-50 relative overflow-hidden"
              >
                {/* Barre de progression en arrière-plan */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-100 transition-all duration-300"
                  style={{ width: `${votePercentage}%` }}
                />
                
                {/* Contenu du bouton */}
                <div className="flex justify-between w-full items-center relative z-10">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm">
                    {voteCount} vote{voteCount !== 1 ? 's' : ''} ({votePercentage}%)
                  </span>
                </div>

                {/* Indicateur de chargement pendant le vote */}
                {voting && (
                  <Loader2 className="h-4 w-4 animate-spin absolute right-4" />
                )}
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Graphique des votes */}
      {poll.options.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Résultats</CardTitle>
          </CardHeader>
          <CardContent>
            <VoteChart options={poll.options} />
          </CardContent>
        </Card>
      )}

      {/* Bouton de retour */}
      <div className="text-center pt-4">
        <Link href="/polls">
          <Button variant="ghost" className="hover:bg-gray-100">
            Retour aux sondages
          </Button>
        </Link>
      </div>
    </div>
  )
}