import type React from "react"

interface SummaryCardProps {
  totalCommits: number
  activeRepos: number
  mostUsedStack: string
  totalStackTypes: number
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  totalCommits,
  activeRepos,
  mostUsedStack,
  totalStackTypes,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-6 shadow-sm">
        <div className="text-xs md:text-sm text-gray-600 font-medium">Total Commits</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{totalCommits}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-6 shadow-sm">
        <div className="text-xs md:text-sm text-gray-600 font-medium">Active Repositories</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{activeRepos}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-6 shadow-sm">
        <div className="text-xs md:text-sm text-gray-600 font-medium">Most Used Stack</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{mostUsedStack}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-6 shadow-sm">
        <div className="text-xs md:text-sm text-gray-600 font-medium">Total Stack Types</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{totalStackTypes}</div>
      </div>
    </div>
  )
}
