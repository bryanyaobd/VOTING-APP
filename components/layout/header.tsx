import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PollAndVote
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/polls">
                <Button variant="ghost">Voir les sondages</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}