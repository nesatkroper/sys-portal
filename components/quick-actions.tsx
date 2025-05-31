"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, RotateCcw, Download, Settings, Shield } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QuickActions() {
  const handleAction = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} action would be executed here`,
    })
  }

  const actions = [
    {
      icon: Terminal,
      label: "SSH Terminal",
      description: "Open terminal",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: RotateCcw,
      label: "Restart Server",
      description: "Reboot system",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Download,
      label: "Download Logs",
      description: "Export system logs",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Shield,
      label: "Security Scan",
      description: "Run security check",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all"
              onClick={() => handleAction(action.label)}
            >
              <div className={`p-2 rounded-lg ${action.bg}`}>
                <action.icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
