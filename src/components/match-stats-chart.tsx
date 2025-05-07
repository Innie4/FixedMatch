"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface MatchStatsChartProps {
  homeTeam: string
  awayTeam: string
  stats: {
    homeStats: {
      possession: number
      shots: number
      shotsOnTarget: number
      corners: number
      goals: number
    }
    awayStats: {
      possession: number
      shots: number
      shotsOnTarget: number
      corners: number
      goals: number
    }
  }
}

export default function MatchStatsChart({ homeTeam, awayTeam, stats }: MatchStatsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Prepare the data
        const labels = ["Possession", "Shots per game", "Shots on target", "Corners", "Goals per game"]

        const homeData = [
          stats.homeStats.possession,
          stats.homeStats.shots,
          stats.homeStats.shotsOnTarget,
          stats.homeStats.corners,
          stats.homeStats.goals,
        ]

        const awayData = [
          stats.awayStats.possession,
          stats.awayStats.shots,
          stats.awayStats.shotsOnTarget,
          stats.awayStats.corners,
          stats.awayStats.goals,
        ]

        // Create chart
        chartInstance.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels,
            datasets: [
              {
                label: homeTeam,
                data: homeData,
                backgroundColor: "rgba(26, 86, 219, 0.2)",
                borderColor: "rgba(26, 86, 219, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(26, 86, 219, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(26, 86, 219, 1)",
                pointRadius: 4,
              },
              {
                label: awayTeam,
                data: awayData,
                backgroundColor: "rgba(220, 38, 38, 0.2)",
                borderColor: "rgba(220, 38, 38, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(220, 38, 38, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220, 38, 38, 1)",
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              r: {
                beginAtZero: true,
                grid: {
                  color: "rgba(156, 163, 175, 0.2)",
                },
                pointLabels: {
                  color: "rgb(156, 163, 175)",
                },
                ticks: {
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
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [homeTeam, awayTeam, stats])

  return (
    <div className="h-72">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
