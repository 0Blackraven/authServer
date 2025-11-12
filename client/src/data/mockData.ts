import type { Repository, Commit, CommitFrequency, StackStats } from "../types"

export const mockRepositories: Repository[] = [
  {
    id: "1",
    name: "e-commerce-api",
    type: "remote",
    stack: ["Node.js", "Express", "PostgreSQL"],
    lastActivity: new Date(2024, 10, 1),
    commitCount: 48,
  },
  {
    id: "2",
    name: "dashboard-ui",
    type: "remote",
    stack: ["React", "TypeScript", "Tailwind"],
    lastActivity: new Date(2024, 10, 2),
    commitCount: 67,
  },
  {
    id: "3",
    name: "data-processor",
    type: "local",
    stack: ["Python", "Pandas", "FastAPI"],
    lastActivity: new Date(2024, 9, 28),
    commitCount: 23,
  },
  {
    id: "4",
    name: "ml-model-training",
    type: "local",
    stack: ["Python", "TensorFlow", "NumPy"],
    lastActivity: new Date(2024, 9, 15),
    commitCount: 15,
  },
  {
    id: "5",
    name: "mobile-app",
    type: "remote",
    stack: ["React Native", "TypeScript", "Firebase"],
    lastActivity: new Date(2024, 10, 3),
    commitCount: 52,
  },
  {
    id: "6",
    name: "utils-library",
    type: "local",
    stack: ["JavaScript", "Node.js"],
    lastActivity: new Date(2024, 9, 20),
    commitCount: 34,
  },
]

export const mockCommits: Commit[] = [
  {
    id: "1",
    repo: "e-commerce-api",
    branch: "main",
    author: "Alice Johnson",
    date: new Date(2024, 10, 2, 14, 30),
    message: "Fix payment processing logic",
  },
  {
    id: "2",
    repo: "dashboard-ui",
    branch: "feature/charts",
    author: "Bob Smith",
    date: new Date(2024, 10, 2, 10, 15),
    message: "Add new chart components",
  },
  {
    id: "3",
    repo: "mobile-app",
    branch: "develop",
    author: "Carol White",
    date: new Date(2024, 10, 1, 16, 45),
    message: "Update navigation flow",
  },
  {
    id: "4",
    repo: "e-commerce-api",
    branch: "hotfix/database-conn",
    author: "David Brown",
    date: new Date(2024, 10, 1, 9, 20),
    message: "Improve database connection pooling",
  },
  {
    id: "5",
    repo: "utils-library",
    branch: "main",
    author: "Eve Davis",
    date: new Date(2024, 9, 30, 13, 10),
    message: "Add utility functions for string manipulation",
  },
]

export const mockCommitFrequency: CommitFrequency[] = [
  { date: "Oct 25", commits: 8 },
  { date: "Oct 26", commits: 12 },
  { date: "Oct 27", commits: 10 },
  { date: "Oct 28", commits: 15 },
  { date: "Oct 29", commits: 11 },
  { date: "Oct 30", commits: 14 },
  { date: "Nov 1", commits: 18 },
  { date: "Nov 2", commits: 16 },
]

export const mockStackStats: StackStats[] = [
  { name: "Node.js", count: 4 },
  { name: "Python", count: 3 },
  { name: "React", count: 3 },
  { name: "TypeScript", count: 3 },
  { name: "PostgreSQL", count: 2 },
  { name: "FastAPI", count: 1 },
  { name: "TensorFlow", count: 1 },
  { name: "Firebase", count: 1 },
  { name: "Tailwind", count: 1 },
]
