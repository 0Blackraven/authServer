import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import type { DashboardSummary } from "../../lib/types"

interface SummaryCardProps {
  summary: DashboardSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const trendColor = summary.commitsTrend >= 0 ? "text-green-600" : "text-red-600"

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalCommits}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Repos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.activeRepos}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Most Used Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.mostUsedStack}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Commits Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {summary.commitsTrend > 0 ? "+" : ""}
            {summary.commitsTrend}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
