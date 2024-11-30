import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Créez des sondages simplement
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Créez, partagez et analysez vos sondages en quelques clics.
        Obtenez des réponses rapidement et visualisez les résultats en temps réel.
      </p>
      <div className="flex gap-4">
        <Link href="/polls">
          <Button size="lg">
            Voir les sondages
          </Button>
        </Link>
      </div>
    </div>
  )
}