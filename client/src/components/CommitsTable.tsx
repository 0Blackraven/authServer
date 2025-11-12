import type React from "react"
import { useState } from "react"
import type { Commit } from "../types"

interface CommitsTableProps {
  commits: Commit[]
}

export const CommitsTable: React.FC<CommitsTableProps> = ({ commits }) => {
  const [repoTypeFilter, setRepoTypeFilter] = useState<"all" | "local" | "remote">("all")
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "week" | "month">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getFilteredCommits = () => {
    let filtered = commits

    if (dateRangeFilter !== "all") {
      const end = new Date(2024, 10, 3)
      let start = new Date(2024, 9, 25)

      if (dateRangeFilter === "week") {
        start = new Date(end)
        start.setDate(end.getDate() - 7)
      } else if (dateRangeFilter === "month") {
        start = new Date(end)
        start.setMonth(end.getMonth() - 1)
      }

      filtered = filtered.filter((commit) => commit.date >= start && commit.date <= end)
    }

    if (repoTypeFilter !== "all") {
      filtered = filtered.filter((commit) => {
        const repo = commits.find((c) => c.repo)
        return repoTypeFilter === "local"
      })
    }

    return filtered
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h3 className="text-sm md:text-lg font-semibold text-gray-900">All Commits</h3>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <select
            value={repoTypeFilter}
            onChange={(e) => setRepoTypeFilter(e.target.value as "all" | "local" | "remote")}
            className="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="local">Local</option>
            <option value="remote">Remote</option>
          </select>
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value as "all" | "week" | "month")}
            className="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Repository</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Branch</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Author</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Message</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredCommits().map((commit) => (
              <tr key={commit.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-3 md:px-6 py-2 md:py-4 font-medium text-gray-900">{commit.repo}</td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-gray-700">
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {commit.branch}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-gray-700">{commit.author}</td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-gray-500 text-xs">
                  {commit.date.toLocaleDateString()}{" "}
                  {commit.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-gray-700 max-w-xs truncate">{commit.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden">
        {getFilteredCommits().map((commit) => (
          <div key={commit.id} className="border-b border-gray-200">
            <button
              onClick={() => setExpandedId(expandedId === commit.id ? null : commit.id)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 active:bg-gray-100 flex justify-between items-center"
            >
              <span className="font-medium text-gray-900 text-sm truncate flex-1">{commit.repo}</span>
              <span className="text-gray-400 ml-2">{expandedId === commit.id ? "▼" : "▶"}</span>
            </button>
            {expandedId === commit.id && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 space-y-1 text-xs">
                <div>
                  <span className="font-semibold text-gray-700">Branch:</span>{" "}
                  <span className="text-gray-600">{commit.branch}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Author:</span>{" "}
                  <span className="text-gray-600">{commit.author}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  <span className="text-gray-600">
                    {commit.date.toLocaleDateString()}{" "}
                    {commit.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Message:</span>
                  <p className="text-gray-600 mt-1 break-words">{commit.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
