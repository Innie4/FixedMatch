"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function SuccessRateChart() {
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
        // Sample data for the chart
        const data = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "VIP Predictions Success Rate (%)",
              data: [88, 90, 89, 92, 91, 93, 94, 92, 93, 91, 94, 95],
              backgroundColor: "rgba(26, 86, 219, 0.2)",
              borderColor: "rgba(26, 86, 219, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "rgba(26, 86, 219, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Free Predictions Success Rate (%)",
              data: [65, 68, 70, 72, 69, 71, 73, 70, 72, 71, 74, 73],
              backgroundColor: "rgba(156, 163, 175, 0.2)",
              borderColor: "rgba(156, 163, 175, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "rgba(156, 163, 175, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }

        // Chart configuration
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                  size: 14,
                },
                bodyFont: {
                  size: 13,
                },
                displayColors: true,
                boxPadding: 5,
              },
            },
            scales: {
              y: {
                beginAtZero: false,
                min: 50,
                max: 100,
                ticks: {
                  stepSize: 10,
                },
                grid: {
                  // Use type assertion to bypass TypeScript check
                  ...(({ border: { display: false } } as any))
                },
              },
              x: {
                grid: {
                  display: false,
                  // Use type assertion to bypass TypeScript check
                  ...(({ border: { display: false } } as any))
                },
              },
            },
            elements: {
              line: {
                tension: 0.4,
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
  }, [])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Success Rate Comparison</h3>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}
