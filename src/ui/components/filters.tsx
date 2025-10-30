  import { useState } from "react"
  import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
  import { Button } from "../components/button"
  import type { DashboardFilters, RepositoryType, TechStack } from "../../lib/types"

  interface FiltersProps {
    onFiltersChange: (filters: DashboardFilters) => void
    availableStacks: TechStack[]
  }

  export function Filters({ onFiltersChange, availableStacks }: FiltersProps) {
    const [filters, setFilters] = useState<DashboardFilters>({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      repoType: "all",
      selectedStacks: [],
    })

    const handleRepoTypeChange = (type: RepositoryType | "all") => {
      const newFilters = { ...filters, repoType: type }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    }

    const handleStackToggle = (stack: TechStack) => {
      const newStacks = filters.selectedStacks.includes(stack)
        ? filters.selectedStacks.filter((s) => s !== stack)
        : [...filters.selectedStacks, stack]

      const newFilters = { ...filters, selectedStacks: newStacks }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    }

    const handleDateRangeChange = (days: number) => {
      const end = new Date()
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
      const newFilters = { ...filters, dateRange: { start, end } }
      setFilters(newFilters)
      onFiltersChange(newFilters)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Date Range</h4>
            <div className="flex gap-2">
              {[7, 14, 30, 60].map((days) => (
                <Button
                  key={days}
                  variant={
                    filters.dateRange.start.getTime() === new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime()
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleDateRangeChange(days)}
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>

          {/* Repository Type */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Repository Type</h4>
            <div className="flex gap-2">
              {(["all", "local", "remote"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filters.repoType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRepoTypeChange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Tech Stacks */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Tech Stacks</h4>
            <div className="flex flex-wrap gap-2">
              {availableStacks.map((stack) => (
                <Button
                  key={stack}
                  variant={filters.selectedStacks.includes(stack) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStackToggle(stack)}
                >
                  {stack}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
