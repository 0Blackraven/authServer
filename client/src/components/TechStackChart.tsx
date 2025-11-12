import type React from "react"
import type { StackStats } from "../types"

interface TechStackChartProps {
  data: StackStats[]
}

export const TechStackChart: React.FC<TechStackChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  let currentAngle = 0
  const slices = data.map((item) => {
    const sliceAngle = (item.count / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    currentAngle = endAngle

    return { ...item, startAngle, endAngle }
  })

  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#6366F1", "#14B8A6"]

  const createPieSlice = (startAngle: number, endAngle: number, radius: number, color: string) => {
    const start = ((startAngle - 90) * Math.PI) / 180
    const end = ((endAngle - 90) * Math.PI) / 180

    const x1 = 100 + radius * Math.cos(start)
    const y1 = 100 + radius * Math.sin(start)
    const x2 = 100 + radius * Math.cos(end)
    const y2 = 100 + radius * Math.sin(end)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    const innerRadius = 60
    const ix1 = 100 + innerRadius * Math.cos(start)
    const iy1 = 100 + innerRadius * Math.sin(start)
    const ix2 = 100 + innerRadius * Math.cos(end)
    const iy2 = 100 + innerRadius * Math.sin(end)

    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`

    return <path key={`${startAngle}-${endAngle}`} d={path} fill={color} stroke="white" strokeWidth="2" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology Stack Distribution</h3>
      <p className="text-xs text-gray-500 mb-4">Click to toggle to Commit Frequency chart</p>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <svg viewBox="0 0 200 200" className="w-full max-w-sm mx-auto">
            {slices.map((slice, index) =>
              createPieSlice(slice.startAngle, slice.endAngle, 80, colors[index % colors.length]),
            )}
          </svg>
        </div>
        <div className="w-full md:w-1/2">
          <div className="space-y-3">
            {slices.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700 flex-1">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.count} ({((item.count / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
