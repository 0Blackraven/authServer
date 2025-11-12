import type React from "react"
import { useState } from "react"
import type { Repository } from "../types"

interface RepositoryListProps {
  repositories: Repository[]
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  const [repoTypeFilter, setRepoTypeFilter] = useState<"all" | "local" | "remote">("all")
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "week" | "month">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getFilteredRepositories = () => {
    let filtered = repositories

    if (repoTypeFilter !== "all") {
      filtered = filtered.filter((repo) => repo.type === repoTypeFilter)
    }

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

      filtered = filtered.filter((repo) => repo.lastActivity >= start && repo.lastActivity <= end)
    }

    return filtered
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h3 className="text-sm md:text-lg font-semibold text-gray-900">Scanned Repositories</h3>
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
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Repository Name</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Last Activity</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Stack</th>
              <th className="px-3 md:px-6 py-2 md:py-3 text-left font-semibold text-gray-700">Commits</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredRepositories().map((repo) => (
              <tr key={repo.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-3 md:px-6 py-2 md:py-4 font-medium text-gray-900 text-xs md:text-base">
                  {repo.name}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <span
                    className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                      repo.type === "local" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {repo.type.charAt(0).toUpperCase() + repo.type.slice(1)}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 text-gray-500 text-xs">
                  {repo.lastActivity.toLocaleDateString()}
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4">
                  <div className="flex flex-wrap gap-1">
                    {repo.stack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs md:text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-2 md:py-4 font-semibold text-gray-900">{repo.commitCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden">
        {getFilteredRepositories().map((repo) => (
          <div key={repo.id} className="border-b border-gray-200">
            <button
              onClick={() => setExpandedId(expandedId === repo.id ? null : repo.id)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 active:bg-gray-100 flex justify-between items-center"
            >
              <span className="font-medium text-gray-900 text-sm truncate flex-1">{repo.name}</span>
              <span className="text-gray-400 ml-2">{expandedId === repo.id ? "▼" : "▶"}</span>
            </button>
            {expandedId === repo.id && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 space-y-1 text-xs">
                <div>
                  <span className="font-semibold text-gray-700">Type:</span>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      repo.type === "local" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {repo.type.charAt(0).toUpperCase() + repo.type.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Last Activity:</span>{" "}
                  <span className="text-gray-600">{repo.lastActivity.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Stack:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {repo.stack.map((tech) => (
                      <span key={tech} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Commits:</span>{" "}
                  <span className="text-gray-600 font-semibold">{repo.commitCount}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
