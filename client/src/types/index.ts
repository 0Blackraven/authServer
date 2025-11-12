export interface Repository {
  id: string
  name: string
  type: "local" | "remote"
  stack: string[]
  lastActivity: Date
  commitCount: number
}

export interface Commit {
  id: string
  repo: string
  branch: string
  author: string
  date: Date
  message: string
}

export interface CommitFrequency {
  date: string
  commits: number
}

export interface StackStats {
  name: string
  count: number
}

export interface FilterState {
  dateRange: {
    start: Date
    end: Date
  }
  repoType: "all" | "local" | "remote"
  selectedStack: string[]
}
