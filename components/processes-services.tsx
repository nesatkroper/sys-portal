"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, MemoryStick, Play, Pause, Square, Skull, Settings } from "lucide-react"

interface ProcessesServicesProps {
  metrics: any
}

export function ProcessesServices({ metrics }: ProcessesServicesProps) {
  const getProcessIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-3 w-3 text-green-500" />
      case "sleeping":
        return <Pause className="h-3 w-3 text-blue-500" />
      case "stopped":
        return <Square className="h-3 w-3 text-amber-500" />
      case "zombie":
        return <Skull className="h-3 w-3 text-red-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 border-green-200"
      case "stopped":
        return "bg-red-100 text-red-800 border-red-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Process States */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Process States
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getProcessIcon("running")}
                  <span className="text-sm">Running</span>
                </div>
                <span className="font-medium">{metrics.cpu.processes.running}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getProcessIcon("sleeping")}
                  <span className="text-sm">Sleeping</span>
                </div>
                <span className="font-medium">{metrics.cpu.processes.sleeping}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getProcessIcon("stopped")}
                  <span className="text-sm">Stopped</span>
                </div>
                <span className="font-medium">{metrics.cpu.processes.stopped}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getProcessIcon("zombie")}
                  <span className="text-sm">Zombie</span>
                </div>
                <span className={`font-medium ${metrics.cpu.processes.zombie > 0 ? "text-red-600" : ""}`}>
                  {metrics.cpu.processes.zombie}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Processes</span>
              <span className="font-medium">{metrics.system.processes}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Services/Processes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Top Processes & Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.services.slice(0, 8).map((service: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant="outline" className={`text-xs ${getServiceStatusColor(service.status)}`}>
                    {service.status}
                  </Badge>
                  <span className="text-sm font-medium truncate">{service.name}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {service.cpu !== undefined && (
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      <span>{service.cpu.toFixed(1)}%</span>
                    </div>
                  )}
                  {service.memory !== undefined && (
                    <div className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3" />
                      <span>{service.memory.toFixed(1)}%</span>
                    </div>
                  )}
                  {service.pid && <span className="text-xs text-muted-foreground">PID: {service.pid}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
