import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, BarChart3, TrendingUp, FileText, LineChart, PieChart } from 'lucide-react'

interface PerformanceTabProps {
  predictionTimeRange: string
  setPredictionTimeRange: (value: string) => void
  vipPredictionPerformance: {
    overall: {
      total: number
      won: number
      lost: number
      successRate: number
      averageOdds: number
      roi: number
    }
    comparison: {
      vip: { successRate: number; roi: number }
      free: { successRate: number; roi: number }
    }
  }
}

export function PerformanceTab({
  predictionTimeRange,
  setPredictionTimeRange,
  vipPredictionPerformance,
}: PerformanceTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={predictionTimeRange} onValueChange={setPredictionTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vipPredictionPerformance.overall.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Odds</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipPredictionPerformance.overall.averageOdds}</div>
            <p className="text-xs text-muted-foreground">+0.15 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipPredictionPerformance.overall.roi}%</div>
            <p className="text-xs text-muted-foreground">+4.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipPredictionPerformance.overall.total}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
              <div className="text-center">
                <LineChart className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2">Line chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance by Sport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
              <div className="text-center">
                <PieChart className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2">Pie chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VIP vs Free Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>VIP vs Free Predictions</CardTitle>
          <CardDescription>
            Comparison of performance metrics between VIP and free predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Success Rate</div>
                <div className="text-sm text-muted-foreground">
                  VIP: {vipPredictionPerformance.comparison.vip.successRate}% | Free:{' '}
                  {vipPredictionPerformance.comparison.free.successRate}%
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      (vipPredictionPerformance.comparison.vip.successRate /
                        (vipPredictionPerformance.comparison.vip.successRate +
                          vipPredictionPerformance.comparison.free.successRate)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">ROI</div>
                <div className="text-sm text-muted-foreground">
                  VIP: {vipPredictionPerformance.comparison.vip.roi}% | Free:{' '}
                  {vipPredictionPerformance.comparison.free.roi}%
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      (vipPredictionPerformance.comparison.vip.roi /
                        (vipPredictionPerformance.comparison.vip.roi +
                          vipPredictionPerformance.comparison.free.roi)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
