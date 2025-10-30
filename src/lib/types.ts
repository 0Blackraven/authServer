export type RepositoryType = "local" | "remote"
export type TechStack = "Node" | "Python" | "Go" | "Rust" | "Java" | "C++" | "Ruby" | "PHP"

export interface Commit {
  id: string
  repoName: string
  branch: string
  author: string
  message: string
  date: Date
}

export interface Repository {
  id: string
  name: string
  type: RepositoryType
  lastActivity: Date
  stacks: TechStack[]
  commitCount: number
}

export interface CommitFrequencyData {
  date: string
  commits: number
}

export interface StackBreakdown {
  stack: TechStack
  count: number
  percentage: number
}

export interface DashboardFilters {
  dateRange: {
    start: Date
    end: Date
  }
  repoType: RepositoryType | "all"
  selectedStacks: TechStack[]
}

export interface DashboardSummary {
  totalCommits: number
  activeRepos: number
  mostUsedStack: TechStack
  commitsTrend: number // percentage change
}
