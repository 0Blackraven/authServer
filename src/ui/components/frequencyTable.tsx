import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import type { CommitFrequencyData } from "../../lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CommitFrequencyChartProps {
  data: CommitFrequencyData[]
}

export function CommitFrequencyChart({ data }: CommitFrequencyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Frequency (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="commits" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
