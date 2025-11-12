import type React from "react"
import { useState, useMemo } from "react"
import { mockRepositories, mockCommits, mockCommitFrequency, mockStackStats } from "../data/mockData"
import type { FilterState } from "../types"
import { SummaryCard } from "./SummaryCard"
import { FilterPanel } from "./FilterPanel"
import { CommitsTable } from "./CommitsTable"
import { CommitFrequencyChart } from "./CommitFrequencyChart"
import { TechStackChart } from "./TechStackChart"
import { RepositoryList } from "./RepositoryList"
import { NotificationCard } from "./NotificationCard"

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(2024, 9, 25),
      end: new Date(2024, 10, 3),
    },
    repoType: "all",
    selectedStack: [],
  })

  const [showCommitChart, setShowCommitChart] = useState(true)

  const availableStacks = Array.from(new Set(mockRepositories.flatMap((repo) => repo.stack))).sort()

  const filteredRepositories = useMemo(() => {
    return mockRepositories.filter((repo) => {
      if (filters.repoType !== "all" && repo.type !== filters.repoType) {
        return false
      }
      if (filters.selectedStack.length > 0 && !repo.stack.some((s) => filters.selectedStack.includes(s))) {
        return false
      }
      return true
    })
  }, [filters])

  const filteredCommits = useMemo(() => {
    return mockCommits.filter((commit) => {
      const commitRepo = mockRepositories.find((r) => r.name === commit.repo)
      if (!commitRepo) return false

      if (filters.repoType !== "all" && commitRepo.type !== filters.repoType) {
        return false
      }
      if (filters.selectedStack.length > 0 && !commitRepo.stack.some((s) => filters.selectedStack.includes(s))) {
        return false
      }
      if (commit.date < filters.dateRange.start || commit.date > filters.dateRange.end) {
        return false
      }
      return true
    })
  }, [filters])

  const totalCommits = mockRepositories.reduce((sum, repo) => sum + repo.commitCount, 0)
  const activeRepos = filteredRepositories.length
  const stackCounts: Record<string, number> = {}
  filteredRepositories.forEach((repo) => {
    repo.stack.forEach((stack) => {
      stackCounts[stack] = (stackCounts[stack] || 0) + 1
    })
  })
  const mostUsedStack = Object.entries(stackCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
  const totalStackTypes = Object.keys(stackCounts).length

  const alerts: string[] = []
  if (filteredCommits.length === 0) {
    alerts.push("No commits found in the selected date range")
  }
  const localRepos = filteredRepositories.filter((r) => r.type === "local")
  if (localRepos.some((r) => r.lastActivity < new Date(2024, 9, 20))) {
    alerts.push("Some local repositories have not been updated in over 10 days")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2">Repository and commit insights</p>
        </header>

        {/* Notifications */}
        <NotificationCard alerts={alerts} />

        <div className="hidden lg:grid grid-cols-2 gap-6 mb-6">
          {/* Left: Summary Cards in 2x2 Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
            <SummaryCard
              totalCommits={totalCommits}
              activeRepos={activeRepos}
              mostUsedStack={mostUsedStack}
              totalStackTypes={totalStackTypes}
            />
          </div>

          {/* Right: Toggleable Charts - click on chart to switch */}
          <div onClick={() => setShowCommitChart(!showCommitChart)} className="cursor-pointer">
            {showCommitChart ? (
              <CommitFrequencyChart data={mockCommitFrequency} />
            ) : (
              <TechStackChart data={mockStackStats} />
            )}
          </div>
        </div>

        <div className="lg:hidden space-y-3 md:space-y-6 mb-4 md:mb-6">
          <div>
            <h2 className="text-sm md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">Summary</h2>
            <SummaryCard
              totalCommits={totalCommits}
              activeRepos={activeRepos}
              mostUsedStack={mostUsedStack}
              totalStackTypes={totalStackTypes}
            />
          </div>
          <div onClick={() => setShowCommitChart(!showCommitChart)} className="cursor-pointer">
            {showCommitChart ? (
              <CommitFrequencyChart data={mockCommitFrequency} />
            ) : (
              <TechStackChart data={mockStackStats} />
            )}
          </div>
        </div>

        <FilterPanel filters={filters} onFiltersChange={setFilters} availableStacks={availableStacks} />

        {/* Tables */}
        <div className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <CommitsTable commits={filteredCommits} />
          <RepositoryList repositories={filteredRepositories} />
        </div>
      </div>
    </div>
  )
}
