'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

Chart.register(...registerables)

interface UserStatsProps {
  stats: {
    total: number
    won: number
    lost: number
    successRate: number
    averageOdds: number
    profit: number
    roi: number
  }
}

export default function UserStats({ stats }: UserStatsProps) {
  const successChartRef = useRef<HTMLCanvasElement>(null)
  const profitChartRef = useRef<HTMLCanvasElement>(null)
  const predictionTypesRef = useRef<HTMLCanvasElement>(null)

  // Store chart instances
  const successChartInstance = useRef<Chart | null>(null)
  const profitChartInstance = useRef<Chart | null>(null)
  const predictionTypesChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Destroy existing charts before creating new ones
    if (successChartInstance.current) {
      successChartInstance.current.destroy()
      successChartInstance.current = null
    }
    if (profitChartInstance.current) {
      profitChartInstance.current.destroy()
      profitChartInstance.current = null
    }
    if (predictionTypesChartInstance.current) {
      predictionTypesChartInstance.current.destroy()
      predictionTypesChartInstance.current = null
    }

    // Success Rate Chart
    if (successChartRef.current) {
      const ctx = successChartRef.current.getContext('2d')
      if (ctx) {
        successChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Won', 'Lost'],
            datasets: [
              {
                data: [stats.won, stats.lost],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number
                    const total = (context.dataset.data as number[]).reduce(
                      (a, b) => (a as number) + (b as number),
                      0
                    )
                    const percentage = Math.round((value / total) * 100)
                    return `${context.label}: ${value} (${percentage}%)`
                  },
                },
              },
            },
          },
        })
      }
    }

    // Profit Chart
    if (profitChartRef.current) {
      const ctx = profitChartRef.current.getContext('2d')
      if (ctx) {
        // Sample profit data over time
        const profit = [0, 12, 28, 45, 32, 60, 78, 95, 110, 126.5]

        profitChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [
              {
                label: 'Profit (units)',
                data: profit,
                borderColor: '#1a56db',
                backgroundColor: 'rgba(26, 86, 219, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(156, 163, 175, 0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        })
      }
    }

    // Prediction Types Chart
    if (predictionTypesRef.current) {
      const ctx = predictionTypesRef.current.getContext('2d')
      if (ctx) {
        // Sample prediction types data
        predictionTypesChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Match Result',
              'Both Teams to Score',
              'Over/Under',
              'Asian Handicap',
              'Other',
            ],
            datasets: [
              {
                label: 'Predictions',
                data: [98, 62, 45, 28, 15],
                backgroundColor: [
                  'rgba(26, 86, 219, 0.7)',
                  'rgba(16, 185, 129, 0.7)',
                  'rgba(251, 191, 36, 0.7)',
                  'rgba(139, 92, 246, 0.7)',
                  'rgba(239, 68, 68, 0.7)',
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(156, 163, 175, 0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        })
      }
    }

    // Cleanup function
    return () => {
      if (successChartInstance.current) {
        successChartInstance.current.destroy()
        successChartInstance.current = null
      }
      if (profitChartInstance.current) {
        profitChartInstance.current.destroy()
        profitChartInstance.current = null
      }
      if (predictionTypesChartInstance.current) {
        predictionTypesChartInstance.current.destroy()
        predictionTypesChartInstance.current = null
      }
    }
  }, [stats])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediction Success Rate</CardTitle>
          <CardDescription>Overall success rate of your predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <canvas ref={successChartRef}></canvas>
            <div className="absolute text-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.successRate}%
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Won</p>
              <p className="text-xl font-bold text-green-600">{stats.won}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Lost</p>
              <p className="text-xl font-bold text-red-600">{stats.lost}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Odds</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.averageOdds}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
              <p className="text-xl font-bold text-blue-600">{stats.roi}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit Over Time</CardTitle>
          <CardDescription>Your betting profit from predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={profitChartRef}></canvas>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-xl font-bold text-green-600">+{stats.profit} units</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Highest Profit</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">+35.8 units</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">October</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Best League</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Bundesliga</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Prediction Types</CardTitle>
          <CardDescription>Breakdown of your prediction types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={predictionTypesRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
