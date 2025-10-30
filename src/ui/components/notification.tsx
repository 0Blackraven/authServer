import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { AlertCircle, CheckCircle, InfoIcon } from "lucide-react"

interface Notification {
  id: string
  type: "alert" | "success" | "info"
  message: string
}

interface NotificationsProps {
  notifications: Notification[]
}

export function Notifications({ notifications }: NotificationsProps) {
  if (notifications.length === 0) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-2">
              {notif.type === "alert" && <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />}
              {notif.type === "success" && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />}
              {notif.type === "info" && <InfoIcon className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />}
              <p className="text-sm">{notif.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
