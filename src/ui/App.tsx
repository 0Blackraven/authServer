// import { useState } from 'react'
import './App.css'
import { useState, useMemo } from "react"
import {
  generateCommits,
  generateRepositories,
  generateCommitFrequency,
  calculateStackBreakdown,
  calculateSummary,
} from "../lib/simulated-data"
import type { DashboardFilters, TechStack } from "../lib/types"
import { SummaryCard } from "./components/summaryCard"
import { CommitsTable } from "./components/commitsTable"
import { CommitFrequencyChart } from "./components/frequencyTable"
import { RepositoriesList } from "./components/repositoriesList"
import { TechStackChart } from "./components/techStackChart"
import { Filters } from "./components/filters"
import { Notifications } from "./components/notification"

export default function App() {
  // Generate static data
  const commits = useMemo(() => generateCommits(), [])
  const repositories = useMemo(() => generateRepositories(), [])
  const commitFrequency = useMemo(() => generateCommitFrequency(), [])
  const stackBreakdown = useMemo(() => calculateStackBreakdown(repositories), [repositories])
  const summary = useMemo(() => calculateSummary(commits, repositories), [commits, repositories])

  // Filter state
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    repoType: "all",
    selectedStacks: [],
  })

  // Apply filters
  const filteredCommits = useMemo(() => {
    return commits.filter((commit) => {
      const inDateRange = commit.date >= filters.dateRange.start && commit.date <= filters.dateRange.end
      const matchesRepoType =
        filters.repoType === "all" || repositories.find((r) => r.name === commit.repoName)?.type === filters.repoType
      const matchesStack =
        filters.selectedStacks.length === 0 ||
        repositories.find((r) => r.name === commit.repoName)?.stacks.some((s) => filters.selectedStacks.includes(s))

      return inDateRange && matchesRepoType && matchesStack
    })
  }, [commits, filters, repositories])

  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      const matchesType = filters.repoType === "all" || repo.type === filters.repoType
      const matchesStack =
        filters.selectedStacks.length === 0 || repo.stacks.some((s) => filters.selectedStacks.includes(s))

      return matchesType && matchesStack
    })
  }, [repositories, filters])

  // Generate notifications
  const notifications = useMemo(() => {
    const notifs = []

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentCommits = commits.filter((c) => c.date >= thirtyDaysAgo)

    if (recentCommits.length === 0) {
      notifs.push({
        id: "no-commits",
        type: "alert" as const,
        message: "No commits in the last 30 days",
      })
    }

    const inactiveRepos = repositories.filter((r) => r.lastActivity < thirtyDaysAgo)
    if (inactiveRepos.length > 0) {
      notifs.push({
        id: "inactive-repos",
        type: "info" as const,
        message: `${inactiveRepos.length} repository(ies) inactive for 30+ days`,
      })
    }

    return notifs
  }, [commits, repositories])

  const availableStacks: TechStack[] = ["Node", "Python", "Go", "Rust", "Java", "C++", "Ruby", "PHP"]

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor commits, repositories, and tech stack usage</p>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && <Notifications notifications={notifications} />}

        {/* Summary Cards */}
        <SummaryCard summary={summary} />

        {/* Filters */}
        <Filters onFiltersChange={setFilters} availableStacks={availableStacks} />

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          <CommitFrequencyChart data={commitFrequency} />
          <TechStackChart data={stackBreakdown} />
        </div>

        {/* Tables Row */}
        <CommitsTable commits={filteredCommits} />
        <RepositoriesList repositories={filteredRepositories} />
      </div>
    </main>
  )
}
