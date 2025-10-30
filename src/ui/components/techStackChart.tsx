import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import type { StackBreakdown } from "../../lib/types"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface TechStackChartProps {
    data: StackBreakdown[]
}

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-1) / 0.7)",
    "hsl(var(--chart-2) / 0.7)",
    "hsl(var(--chart-3) / 0.7)",
]

export function TechStackChart({ data }: TechStackChartProps) {
    const chartData = data.map(({ stack, count, percentage }) => ({
        name: stack,
        count,
        percentage,
    }));
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tech Stack Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ stack, percentage }) => `${stack} ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} repos`} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}