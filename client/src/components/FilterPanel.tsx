import type React from "react"
import { useState } from "react"
import type { FilterState } from "../types"

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableStacks: string[]
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, availableStacks }) => {
  const [showStackDropdown, setShowStackDropdown] = useState(false)

  const handleStackToggle = (stack: string) => {
    const updatedStacks = filters.selectedStack.includes(stack)
      ? filters.selectedStack.filter((s) => s !== stack)
      : [...filters.selectedStack, stack]
    onFiltersChange({ ...filters, selectedStack: updatedStacks })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-6 shadow-sm mb-4 md:mb-6">
      <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Technology Stack</label>
          <div className="relative">
            <button
              onClick={() => setShowStackDropdown(!showStackDropdown)}
              className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm bg-white text-left cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            >
              <span>
                {filters.selectedStack.length > 0 ? `${filters.selectedStack.length} selected` : "Select stacks"}
              </span>
              <span className="text-xs">▼</span>
            </button>
            {showStackDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-md bg-white shadow-lg z-10 max-h-48 overflow-y-auto">
                {availableStacks.map((stack) => (
                  <label
                    key={stack}
                    className="flex items-center px-2 md:px-3 py-1 md:py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedStack.includes(stack)}
                      onChange={() => handleStackToggle(stack)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-xs md:text-sm text-gray-700">{stack}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
