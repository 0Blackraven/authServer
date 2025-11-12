import type React from "react"

interface NotificationCardProps {
  alerts: string[]
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-4 mb-3 md:mb-6">
      <h3 className="font-semibold text-blue-900 mb-1 md:mb-2 text-xs md:text-base">Alerts</h3>
      <ul className="space-y-0.5 md:space-y-1">
        {alerts.map((alert, index) => (
          <li key={index} className="text-xs md:text-sm text-blue-800 flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>{alert}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
