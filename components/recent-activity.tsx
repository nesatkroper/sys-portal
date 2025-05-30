"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Database, Users, Settings, AlertTriangle } from "lucide-react"

export function RecentActivity() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // Mock recent activity data
    setActivities([
      {
        id: 1,
        type: "database",
        action: "Database created",
        details: "inventory_mgmt database created by admin",
        timestamp: "2 minutes ago",
        icon: Database,
        severity: "info",
      },
      {
        id: 2,
        type: "query",
        action: "Long running query",
        details: "SELECT query on ecommerce_prod taking 45s",
        timestamp: "5 minutes ago",
        icon: AlertTriangle,
        severity: "warning",
      },
      {
        id: 3,
        type: "user",
        action: "User login",
        details: "analytics_user logged in from 192.168.1.100",
        timestamp: "8 minutes ago",
        icon: Users,
        severity: "info",
      },
      {
        id: 4,
        type: "backup",
        action: "Backup completed",
        details: "Scheduled backup of customer_support completed",
        timestamp: "15 minutes ago",
        icon: Settings,
        severity: "success",
      },
      {
        id: 5,
        type: "connection",
        action: "High connection count",
        details: "user_sessions reached 80% connection limit",
        timestamp: "22 minutes ago",
        icon: Activity,
        severity: "warning",
      },
      {
        id: 6,
        type: "maintenance",
        action: "Maintenance started",
        details: "logs_archive database entered maintenance mode",
        timestamp: "1 hour ago",
        icon: Settings,
        severity: "info",
      },
    ])
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <div className={`p-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                  <activity.icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.timestamp}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
