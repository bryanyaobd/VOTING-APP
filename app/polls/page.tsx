import PollList from '@/components/polls/poll-list'
import PollForm from '@/components/polls/poll-form'
import { Card } from '@/components/ui/card'

export default function PollsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid gap-8 md:grid-cols-[2fr,3fr]">
        <div>
          <h2 className="text-2xl font-bold mb-4">Créer un sondage</h2>
          <Card className="p-4">
            <PollForm />
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Sondages récents</h2>
          <PollList />
        </div>
      </div>
    </div>
  )
}
