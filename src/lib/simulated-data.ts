import type { Commit, Repository, CommitFrequencyData, StackBreakdown, TechStack } from "./types"

export const STACKS: TechStack[] = ["Node", "Python", "Go", "Rust", "Java", "C++", "Ruby", "PHP"]

// Generate simulated commits
export function generateCommits(): Commit[] {
  const repos = ["web-app", "api-server", "data-pipeline", "mobile-client", "analytics-service"]
  const authors = ["Alice Chen", "Bob Smith", "Carol Davis", "David Wilson", "Emma Johnson"]
  const branches = ["main", "develop", "feature/auth", "feature/ui", "hotfix/bug"]
  const messages = [
    "Fix authentication flow",
    "Add new dashboard widget",
    "Refactor database queries",
    "Update dependencies",
    "Implement caching layer",
    "Add unit tests",
    "Optimize performance",
    "Fix styling issues",
  ]

  const commits: Commit[] = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    commits.push({
      id: `commit-${i}`,
      repoName: repos[Math.floor(Math.random() * repos.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      date,
    })
  }

  return commits.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Generate simulated repositories
export function generateRepositories(): Repository[] {
  const repos: Repository[] = [
    {
      id: "repo-1",
      name: "web-app",
      type: "remote",
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      stacks: ["Node", "Python"],
      commitCount: 245,
    },
    {
      id: "repo-2",
      name: "api-server",
      type: "remote",
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      stacks: ["Go", "Node"],
      commitCount: 189,
    },
    {
      id: "repo-3",
      name: "data-pipeline",
      type: "local",
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      stacks: ["Python", "Rust"],
      commitCount: 156,
    },
    {
      id: "repo-4",
      name: "mobile-client",
      type: "remote",
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      stacks: ["Node", "Java"],
      commitCount: 203,
    },
    {
      id: "repo-5",
      name: "analytics-service",
      type: "local",
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      stacks: ["Python", "Go"],
      commitCount: 98,
    },
    {
      id: "repo-6",
      name: "cli-tool",
      type: "remote",
      lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      stacks: ["Rust", "C++"],
      commitCount: 67,
    },
  ]

  return repos
}

// Generate commit frequency data for the last 30 days
export function generateCommitFrequency(): CommitFrequencyData[] {
  const data: CommitFrequencyData[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    data.push({
      date: dateStr,
      commits: Math.floor(Math.random() * 15) + 2,
    })
  }

  return data
}

// Calculate tech stack breakdown
export function calculateStackBreakdown(repos: Repository[]): StackBreakdown[] {
  const stackCounts: Record<TechStack, number> = {
    Node: 0,
    Python: 0,
    Go: 0,
    Rust: 0,
    Java: 0,
    "C++": 0,
    Ruby: 0,
    PHP: 0,
  }

  repos.forEach((repo) => {
    repo.stacks.forEach((stack) => {
      stackCounts[stack]++
    })
  })

  const total = Object.values(stackCounts).reduce((a, b) => a + b, 0)

  return Object.entries(stackCounts)
    .filter(([, count]) => count > 0)
    .map(([stack, count]) => ({
      stack: stack as TechStack,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

// Calculate dashboard summary
export function calculateSummary(
  commits: Commit[],
  repos: Repository[],
): {
  totalCommits: number
  activeRepos: number
  mostUsedStack: TechStack
  commitsTrend: number
} {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentCommits = commits.filter((c) => c.date >= thirtyDaysAgo)
  const olderCommits = commits.filter((c) => c.date >= sixtyDaysAgo && c.date < thirtyDaysAgo)

  const trend =
    olderCommits.length > 0 ? Math.round(((recentCommits.length - olderCommits.length) / olderCommits.length) * 100) : 0

  const stackBreakdown = calculateStackBreakdown(repos)

  return {
    totalCommits: commits.length,
    activeRepos: repos.filter((r) => r.lastActivity > thirtyDaysAgo).length,
    mostUsedStack: stackBreakdown[0]?.stack || "Node",
    commitsTrend: trend,
  }
}
