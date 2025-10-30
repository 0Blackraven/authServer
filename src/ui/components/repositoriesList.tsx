import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import type { Repository } from "../../lib/types"

interface RepositoriesListProps {
  repositories: Repository[]
}

export function RepositoriesList({ repositories }: RepositoriesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanned Repositories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {repositories.map((repo) => (
            <div key={repo.id} className="border rounded p-3 hover:bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{repo.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Type: <span className="font-mono">{repo.type}</span> • Commits: {repo.commitCount}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${repo.type === "local" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                >
                  {repo.type === "local" ? "Local" : "Remote"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Last activity: {repo.lastActivity.toLocaleDateString()}</span>
                <div className="flex gap-1">
                  {repo.stacks.map((stack) => (
                    <span key={stack} className="bg-muted px-2 py-1 rounded text-xs">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
