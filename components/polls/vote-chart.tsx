'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import Chart from 'chart.js/auto'
import type { Option } from '@/lib/types'

interface VoteChartProps {
  options: Option[]
}

export default function VoteChart({ options }: VoteChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Détruire le graphique existant si présent
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const data = {
      labels: options.map(option => option.text),
      datasets: [{
        label: 'Votes',
        data: options.map(option => option._count?.votes || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [options])

  return (
    <Card className="p-4">
      <div className="h-64 w-full">
        <canvas ref={chartRef} />
      </div>
    </Card>
  )
}
