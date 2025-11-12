import type React from "react"
import type { CommitFrequency } from "../types"

interface CommitFrequencyChartProps {
  data: CommitFrequency[]
}

export const CommitFrequencyChart: React.FC<CommitFrequencyChartProps> = ({ data }) => {
  const maxCommits = Math.max(...data.map((d) => d.commits))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Commit Frequency</h3>
      <p className="text-xs text-gray-500 mb-4">Click to toggle to Tech Stack chart</p>
      <div className="flex items-end justify-between gap-1 md:gap-2 h-48 md:h-64 overflow-x-auto md:overflow-x-visible">
        {data.map((item) => (
          <div key={item.date} className="flex flex-col items-center flex-1 min-w-0">
            <div
              className="w-full bg-gray-200 rounded-t-md hover:bg-blue-500 transition"
              style={{
                height: `${(item.commits / maxCommits) * 100}%`,
                minHeight: "4px",
              }}
              title={`${item.commits} commits`}
            />
            <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 text-center truncate w-full">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
