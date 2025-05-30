"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Info, XCircle, CheckCircle, X } from "lucide-react"

export function AlertsPanel() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Mock alerts data
    setAlerts([
      {
        id: 1,
        type: "warning",
        title: "High Connection Usage",
        message: "user_sessions database is using 90% of available connections",
        timestamp: "5 minutes ago",
        resolved: false,
      },
      {
        id: 2,
        type: "error",
        title: "Backup Failed",
        message: "Scheduled backup for logs_archive failed due to insufficient disk space",
        timestamp: "1 hour ago",
        resolved: false,
      },
      {
        id: 3,
        type: "info",
        title: "Maintenance Scheduled",
        message: "System maintenance scheduled for tomorrow 2:00 AM - 4:00 AM",
        timestamp: "2 hours ago",
        resolved: false,
      },
      {
        id: 4,
        type: "success",
        title: "Performance Improved",
        message: "Query optimization completed, average response time improved by 40%",
        timestamp: "3 hours ago",
        resolved: true,
      },
    ])
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle
      case "error":
        return XCircle
      case "success":
        return CheckCircle
      default:
        return Info
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "default"
      default:
        return "default"
    }
  }

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const activeAlerts = alerts.filter((alert) => !alert.resolved)
  const resolvedAlerts = alerts.filter((alert) => alert.resolved)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>{activeAlerts.length} active alerts</CardDescription>
          </div>
          <Badge variant="outline">
            {activeAlerts.length} / {alerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type)
              return (
                <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <Icon className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alert.title}</div>
                        <AlertDescription className="text-xs mt-1">{alert.message}</AlertDescription>
                        <div className="text-xs text-muted-foreground mt-2">{alert.timestamp}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => dismissAlert(alert.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </Alert>
              )
            })}

            {resolvedAlerts.length > 0 && (
              <>
                <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">Resolved</div>
                {resolvedAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type)
                  return (
                    <div key={alert.id} className="p-3 border rounded-lg bg-muted/30 opacity-60">
                      <div className="flex items-start space-x-2">
                        <Icon className="h-4 w-4 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.message}</div>
                          <div className="text-xs text-muted-foreground mt-2">{alert.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
