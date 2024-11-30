'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function PollForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    expiresAt: ''
  })

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const validOptions = formData.options.filter(opt => opt.trim())
      if (validOptions.length < 2) {
        throw new Error('Au moins deux options sont requises')
      }

      const response = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          options: validOptions,
          expiresAt: formData.expiresAt || undefined
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la création')

      setFormData({
        title: '',
        description: '',
        options: ['', ''],
        expiresAt: ''
      })
      
      router.refresh()
      router.push(`/polls/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <Input
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Question du sondage"
        required
      />
      
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Description (optionnelle)"
      />

      <Input
        type="datetime-local"
        value={formData.expiresAt}
        onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
        placeholder="Date d'expiration (optionnelle)"
      />

      <div className="space-y-2">
        {formData.options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            {formData.options.length > 2 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeOption(index)}
                className="shrink-0"
              >
                Supprimer
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={addOption}
      >
        Ajouter une option
      </Button>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Création...' : 'Créer le sondage'}
      </Button>
    </form>
  )
}
