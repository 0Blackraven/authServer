import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import type { Commit } from "../../lib/types"

interface CommitsTableProps {
  commits: Commit[]
}

export function CommitsTable({ commits }: CommitsTableProps) {
  const recentCommits = commits.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Commits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-semibold">Repository</th>
                <th className="text-left py-2 px-2 font-semibold">Branch</th>
                <th className="text-left py-2 px-2 font-semibold">Author</th>
                <th className="text-left py-2 px-2 font-semibold">Message</th>
                <th className="text-left py-2 px-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCommits.map((commit) => (
                <tr key={commit.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-2 font-mono text-xs">{commit.repoName}</td>
                  <td className="py-2 px-2">
                    <span className="bg-muted px-2 py-1 rounded text-xs">{commit.branch}</span>
                  </td>
                  <td className="py-2 px-2">{commit.author}</td>
                  <td className="py-2 px-2 text-muted-foreground">{commit.message}</td>
                  <td className="py-2 px-2 text-muted-foreground text-xs">
                    {commit.date.toLocaleDateString()}{" "}
                    {commit.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
