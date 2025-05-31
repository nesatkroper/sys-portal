"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Cpu, MemoryStick, Thermometer, Shield } from "lucide-react"

interface EnhancedSystemInfoProps {
  metrics: any
  status: any
}

export function EnhancedSystemInfo({ metrics, status }: EnhancedSystemInfoProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 GB"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getPerformanceLevel = () => {
    const avgUsage = (metrics.cpu.usage + metrics.memory.usage + metrics.disk.usage) / 3
    if (avgUsage < 30) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" }
    if (avgUsage < 60) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" }
    if (avgUsage < 80) return { level: "Fair", color: "text-amber-600", bg: "bg-amber-100" }
    return { level: "Poor", color: "text-red-600", bg: "bg-red-100" }
  }

  const performance = getPerformanceLevel()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* System Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded">
              <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Hostname</span>
              <span className="font-medium">{metrics.system.hostname}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Distribution</span>
              <span className="font-medium text-xs">{metrics.system.distribution}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Architecture</span>
              <span className="font-medium">{metrics.system.architecture}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Kernel</span>
              <span className="font-medium">{metrics.system.kernel}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium">{formatUptime(metrics.system.uptime)}</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Performance</span>
              <Badge variant="outline" className={`text-xs ${performance.bg} ${performance.color} border-current/20`}>
                {performance.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CPU Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded">
              <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            CPU Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.cpu.usage} className="h-1.5" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cores</span>
              <span className="font-medium">{metrics.cpu.cores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequency</span>
              <span className="font-medium">{metrics.cpu.frequency}</span>
            </div>
            {metrics.cpu.temperature && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Temp
                </span>
                <span className="font-medium">{metrics.cpu.temperature}°C</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Load (1m)</span>
              <span className="font-medium">{metrics.cpu.loadAverage[0]?.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded">
              <MemoryStick className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Memory Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">RAM Usage</span>
              <span className="font-medium">{metrics.memory.usage.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.memory.usage} className="h-1.5" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">{formatBytes(metrics.memory.used)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available</span>
              <span className="font-medium">{formatBytes(metrics.memory.available)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cached</span>
              <span className="font-medium">{formatBytes(metrics.memory.cached)}</span>
            </div>
            {metrics.memory.swap.total > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Swap</span>
                <span className="font-medium">{metrics.memory.swap.usage.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Firewall</span>
              <Badge
                variant={metrics.security.firewall_status === "active" ? "default" : "destructive"}
                className="text-xs"
              >
                {metrics.security.firewall_status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-medium">{metrics.security.active_sessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failed Logins</span>
              <span
                className={`font-medium ${metrics.security.failed_logins > 10 ? "text-red-600" : "text-green-600"}`}
              >
                {metrics.security.failed_logins}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Users Online</span>
              <span className="font-medium">{metrics.system.users}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
