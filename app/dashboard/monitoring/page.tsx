"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wifi,
  Download,
  Upload,
  AlertCircle,
  Settings,
  Database,
  Zap,
  Shield,
  Globe,
  Timer,
  Pause,
  Play,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { EnhancedSystemInfo } from "@/components/enhanced-system-info"
import { ProcessesServices } from "@/components/processes-services"
import { QuickActions } from "@/components/quick-actions"

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [nextRefresh, setNextRefresh] = useState<number>(30)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null)

  const testConnection = async () => {
    setIsTesting(true)
    try {
      const response = await fetch("/api/vps/test")
      const data = await response.json()

      if (response.ok) {
        if (data.connectionTest === "success") {
          toast({
            title: "Connection Successful! ✅",
            description: `Connected to ${data.systemInfo?.split("\n")[0] || "VPS"} in ${data.responseTime}ms`,
          })
        } else {
          toast({
            title: "Connection Test Results",
            description: data.error || data.message || "Test completed",
            variant: data.connectionTest === "failed" ? "destructive" : "default",
          })
        }
        console.log("Connection test results:", data)
      } else {
        toast({
          title: "Test Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to run connection test",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null)
      console.log("Fetching comprehensive VPS metrics...")

      const [metricsResponse, statusResponse] = await Promise.allSettled([
        fetch("/api/vps/metrics"),
        fetch("/api/vps/status"),
      ])

      // Handle metrics response
      if (metricsResponse.status === "fulfilled" && metricsResponse.value.ok) {
        const metricsData = await metricsResponse.value.json()
        if (metricsData.error) {
          setError(`Metrics Error: ${metricsData.error}${metricsData.details ? ` - ${metricsData.details}` : ""}`)
        } else {
          setMetrics(metricsData)
          setLastUpdate(new Date())
          console.log("Comprehensive VPS metrics fetched successfully from", metricsData.system?.hostname || "VPS")
        }
      } else if (metricsResponse.status === "fulfilled") {
        const errorData = await metricsResponse.value.json()
        setError(`API Error: ${errorData.error || "Unknown error"}`)
      } else {
        setError(`Network Error: ${metricsResponse.reason?.message || "Failed to fetch metrics"}`)
      }

      // Handle status response
      if (statusResponse.status === "fulfilled" && statusResponse.value.ok) {
        const statusData = await statusResponse.value.json()
        setStatus(statusData)
      } else if (statusResponse.status === "fulfilled") {
        const statusData = await statusResponse.value.json()
        setStatus(statusData)
      } else {
        setStatus({
          status: "offline",
          error: statusResponse.reason?.message || "Network error",
          timestamp: Date.now(),
        })
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
      const errorMessage = error instanceof Error ? error.message : "Network error occurred"
      setError(`Connection failed: ${errorMessage}`)

      setStatus({
        status: "offline",
        error: errorMessage,
        timestamp: Date.now(),
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setNextRefresh(30) // Reset countdown
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchMetrics()

    if (!error) {
      toast({
        title: "Refreshed ✅",
        description: `VPS metrics updated from ${metrics?.system?.hostname || "server"}`,
      })
    }
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
    if (!autoRefresh) {
      toast({
        title: "Auto-refresh enabled",
        description: "Metrics will update every 30 seconds",
      })
    } else {
      toast({
        title: "Auto-refresh disabled",
        description: "Metrics will only update manually",
      })
    }
  }

  // Setup auto-refresh and countdown
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  useEffect(() => {
    // Clear existing intervals
    if (refreshInterval) clearInterval(refreshInterval)
    if (countdownInterval) clearInterval(countdownInterval)

    if (autoRefresh) {
      // Set up refresh interval
      const refresh = setInterval(() => {
        fetchMetrics()
      }, 30000)
      setRefreshInterval(refresh)

      // Set up countdown interval
      const countdown = setInterval(() => {
        setNextRefresh((prev) => {
          if (prev <= 1) {
            return 30 // Reset to 30 when it reaches 0
          }
          return prev - 1
        })
      }, 1000)
      setCountdownInterval(countdown)

      return () => {
        clearInterval(refresh)
        clearInterval(countdown)
      }
    } else {
      setNextRefresh(0)
    }
  }, [autoRefresh, fetchMetrics])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Connecting to your VPS...</p>
          <p className="text-sm text-muted-foreground">Gathering comprehensive system metrics</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                VPS Monitoring
                {metrics?.system?.hostname && (
                  <span className="text-lg text-muted-foreground ml-2">({metrics.system.hostname})</span>
                )}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                {lastUpdate && (
                  <p className="text-sm text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</p>
                )}
                {autoRefresh && nextRefresh > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    <span>Next update in {nextRefresh}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={testConnection} disabled={isTesting} title="Test Connection">
            <Settings className={`h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={toggleAutoRefresh}
            className="w-full sm:w-auto"
          >
            {autoRefresh ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            Auto Refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{error}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={testConnection} disabled={isTesting}>
                  <Settings className="mr-2 h-3 w-3" />
                  Test Connection
                </Button>
                <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Retry
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced System Overview */}
      {metrics && status && !error && <EnhancedSystemInfo metrics={metrics} status={status} />}

      {/* Connection Status */}
      {status && (
        <Card className={`border-l-4 ${status.status === "online" ? "border-l-green-500" : "border-l-red-500"}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.status)}
                <div>
                  <p className="font-medium capitalize">{status.status}</p>
                  {status.error && <p className="text-sm text-muted-foreground">{status.error}</p>}
                </div>
              </div>
              {status.responseTime && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-medium">{status.responseTime}ms</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processes and Services */}
      {metrics && !error && <ProcessesServices metrics={metrics} />}

      {/* Enhanced Metrics Grid */}
      {metrics && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
            {/* Enhanced CPU Usage */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded">
                    <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  CPU Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span className="font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.cpu.usage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">CPU Model</p>
                  <p className="text-sm font-medium">{metrics.cpu.model}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">1m Load</p>
                    <p className="font-medium">{metrics.performance.load_1m?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">5m Load</p>
                    <p className="font-medium">{metrics.performance.load_5m?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">15m Load</p>
                    <p className="font-medium">{metrics.performance.load_15m?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>

                {metrics.performance.disk_io_wait > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">I/O Wait</span>
                      <span className="font-medium">{metrics.performance.disk_io_wait.toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Memory Usage */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded">
                    <MemoryStick className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>RAM Usage</span>
                    <span className="font-medium">{metrics.memory.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.memory.usage} className="h-2" />
                </div>

                {metrics.memory.swap.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Swap Usage</span>
                      <span className="font-medium">{metrics.memory.swap.usage.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.memory.swap.usage} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="font-medium">{formatBytes(metrics.memory.used)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium">{formatBytes(metrics.memory.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="font-medium">{formatBytes(metrics.memory.available)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cached</p>
                    <p className="font-medium">{formatBytes(metrics.memory.cached)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Disk Usage */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded">
                    <HardDrive className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  Storage & I/O
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage ({metrics.disk.mountpoint})</span>
                    <span className="font-medium">{metrics.disk.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.disk.usage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inodes Usage</span>
                    <span className="font-medium">{metrics.disk.inodes.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.disk.inodes.usage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Filesystem</p>
                  <p className="text-sm font-medium">{metrics.disk.filesystem}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="font-medium">{formatBytes(metrics.disk.used)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Free</p>
                    <p className="font-medium">{formatBytes(metrics.disk.free)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reads</p>
                    <p className="font-medium">{metrics.disk.io.reads.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Writes</p>
                    <p className="font-medium">{metrics.disk.io.writes.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Network Interfaces */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded">
                    <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Network Connections Summary */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Active Connections</p>
                      <p className="font-medium text-lg">{metrics.network.connections.established}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Listening Ports</p>
                      <p className="font-medium text-lg">{metrics.network.connections.listen}</p>
                    </div>
                  </div>

                  {/* Network Interfaces */}
                  {metrics.network.interfaces.map((interface_: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{interface_.name}</span>
                        </div>
                        <Badge
                          variant={interface_.status === "healthy" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {interface_.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Download className="h-3 w-3 text-green-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">RX</p>
                            <p className="font-medium">{formatBytes(interface_.rx_bytes)}</p>
                            <p className="text-xs text-muted-foreground">
                              {interface_.rx_packets.toLocaleString()} packets
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Upload className="h-3 w-3 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">TX</p>
                            <p className="font-medium">{formatBytes(interface_.tx_bytes)}</p>
                            <p className="text-xs text-muted-foreground">
                              {interface_.tx_packets.toLocaleString()} packets
                            </p>
                          </div>
                        </div>
                      </div>

                      {(interface_.rx_errors > 0 || interface_.tx_errors > 0) && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          Errors: RX {interface_.rx_errors}, TX {interface_.tx_errors}
                        </div>
                      )}

                      {index < metrics.network.interfaces.length - 1 && <div className="border-b border-border/40" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div>
            <QuickActions />
          </div>
        </div>
      )}

      {/* Additional System Information */}
      {metrics && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* System Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded">
                  <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                System Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distribution</span>
                  <span className="font-medium text-xs">{metrics.system.distribution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture</span>
                  <span className="font-medium">{metrics.system.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="font-medium">{metrics.system.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Boot</span>
                  <span className="font-medium text-xs">{metrics.system.last_boot}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded">
                  <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Load Average</span>
                  <span className="font-medium">{metrics.performance.load_1m?.toFixed(2)}</span>
                </div>
                {metrics.performance.cpu_temp && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU Temp</span>
                    <span className="font-medium">{metrics.performance.cpu_temp}°C</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">I/O Wait</span>
                  <span className="font-medium">{metrics.performance.disk_io_wait?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU Frequency</span>
                  <span className="font-medium text-xs">{metrics.cpu.frequency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded">
                  <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
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
                  <span className="text-muted-foreground">Failed Logins</span>
                  <span
                    className={`font-medium ${metrics.security.failed_logins > 10 ? "text-red-600" : "text-green-600"}`}
                  >
                    {metrics.security.failed_logins}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Sessions</span>
                  <span className="font-medium">{metrics.security.active_sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium text-xs">{metrics.security.last_login}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fallback when no metrics */}
      {!metrics && !error && !isLoading && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No Metrics Available</h3>
              <p className="text-muted-foreground">
                Unable to retrieve system metrics. Please check your VPS connection.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={testConnection} disabled={isTesting} variant="outline">
                <Settings className={`mr-2 h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
                Test Connection
              </Button>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}



// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   Server,
//   Cpu,
//   MemoryStick,
//   HardDrive,
//   Network,
//   RefreshCw,
//   Activity,
//   AlertTriangle,
//   CheckCircle2,
//   XCircle,
//   Wifi,
//   Download,
//   Upload,
//   AlertCircle,
//   Settings,
//   Info,
//   Play,
// } from "lucide-react"
// import { toast } from "@/hooks/use-toast"
// import { SystemInfoCard } from "@/components/system-info-card"
// import { QuickActions } from "@/components/quick-actions"

// interface SystemMetrics {
//   cpu: {
//     usage: number
//     cores: number
//     loadAverage: number[]
//   }
//   memory: {
//     total: number
//     used: number
//     free: number
//     available: number
//     usage: number
//   }
//   disk: {
//     total: number
//     used: number
//     free: number
//     usage: number
//   }
//   network: {
//     interfaces: Array<{
//       name: string
//       rx_bytes: number
//       tx_bytes: number
//       rx_packets: number
//       tx_packets: number
//     }>
//   }
//   uptime: number
//   timestamp: number
//   demo?: boolean
//   message?: string
//   error?: string
//   details?: string
// }

// interface ServerStatus {
//   status: "online" | "offline" | "timeout" | "demo"
//   responseTime?: number
//   error?: string
//   message?: string
//   timestamp: number
// }

// export default function MonitoringPage() {
//   const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
//   const [status, setStatus] = useState<ServerStatus | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [isTesting, setIsTesting] = useState(false)
//   const [autoRefresh, setAutoRefresh] = useState(true)
//   const [isDemoMode, setIsDemoMode] = useState(false)

//   const testConnection = async () => {
//     setIsTesting(true)
//     try {
//       const response = await fetch("/api/vps/test")
//       const data = await response.json()

//       if (response.ok) {
//         toast({
//           title: "Connection Test Results",
//           description: data.message || "Test completed",
//         })
//         console.log("Connection test results:", data)
//       } else {
//         toast({
//           title: "Test Failed",
//           description: data.error || "Unknown error",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Test Error",
//         description: "Failed to run connection test",
//         variant: "destructive",
//       })
//     } finally {
//       setIsTesting(false)
//     }
//   }

//   const fetchMetrics = async () => {
//     try {
//       setError(null)
//       console.log("Fetching VPS metrics...")

//       // Fetch metrics with proper error handling
//       const metricsResponse = await fetch("/api/vps/metrics")
//       const statusResponse = await fetch("/api/vps/status")

//       // Handle metrics response
//       if (metricsResponse.ok) {
//         const contentType = metricsResponse.headers.get("content-type")
//         if (contentType && contentType.includes("application/json")) {
//           const metricsData = await metricsResponse.json()

//           // Check if we're in demo mode
//           if (metricsData.demo) {
//             setIsDemoMode(true)
//             if (metricsData.error) {
//               setError(`Demo Mode: ${metricsData.message || metricsData.error}`)
//             }
//           }

//           setMetrics(metricsData)
//           console.log("Metrics fetched successfully", metricsData.demo ? "(demo mode)" : "")
//         } else {
//           const textResponse = await metricsResponse.text()
//           console.error("Non-JSON response from metrics API:", textResponse.substring(0, 200))
//           setError("Server returned invalid response format. Please check server logs.")
//         }
//       } else {
//         const contentType = metricsResponse.headers.get("content-type")
//         if (contentType && contentType.includes("application/json")) {
//           const errorData = await metricsResponse.json()
//           setError(`API Error: ${errorData.error || "Unknown error"}`)
//         } else {
//           setError(`HTTP Error: ${metricsResponse.status} ${metricsResponse.statusText}`)
//         }
//       }

//       // Handle status response
//       if (statusResponse.ok) {
//         const contentType = statusResponse.headers.get("content-type")
//         if (contentType && contentType.includes("application/json")) {
//           const statusData = await statusResponse.json()
//           setStatus(statusData)
//         } else {
//           setStatus({
//             status: "offline",
//             error: "Invalid response format",
//             timestamp: Date.now(),
//           })
//         }
//       } else {
//         const contentType = statusResponse.headers.get("content-type")
//         if (contentType && contentType.includes("application/json")) {
//           const statusData = await statusResponse.json()
//           setStatus(statusData)
//         } else {
//           setStatus({
//             status: "offline",
//             error: `HTTP ${statusResponse.status}`,
//             timestamp: Date.now(),
//           })
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch metrics:", error)
//       const errorMessage = error instanceof Error ? error.message : "Network error occurred"
//       setError(`Connection failed: ${errorMessage}`)

//       setStatus({
//         status: "offline",
//         error: errorMessage,
//         timestamp: Date.now(),
//       })
//     } finally {
//       setIsLoading(false)
//       setIsRefreshing(false)
//     }
//   }

//   const handleRefresh = async () => {
//     setIsRefreshing(true)
//     await fetchMetrics()

//     if (!error) {
//       toast({
//         title: "Refreshed",
//         description: isDemoMode ? "Demo data updated" : "VPS metrics have been updated",
//       })
//     }
//   }

//   useEffect(() => {
//     fetchMetrics()
//   }, [])

//   useEffect(() => {
//     if (!autoRefresh) return

//     const interval = setInterval(fetchMetrics, 30000)
//     return () => clearInterval(interval)
//   }, [autoRefresh])

//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "online":
//         return <CheckCircle2 className="h-4 w-4 text-green-500" />
//       case "demo":
//         return <Play className="h-4 w-4 text-blue-500" />
//       case "offline":
//         return <XCircle className="h-4 w-4 text-red-500" />
//       default:
//         return <AlertTriangle className="h-4 w-4 text-amber-500" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="text-muted-foreground">Connecting to VPS...</p>
//           <p className="text-sm text-muted-foreground">This may take a few moments</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-8"
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
//               <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               VPS Monitoring {isDemoMode && <span className="text-blue-600">(Demo)</span>}
//             </h1>
//           </div>
//           <p className="text-muted-foreground mt-1">
//             {isDemoMode
//               ? "Demo mode - showing simulated metrics"
//               : "Real-time system metrics and performance monitoring"}
//           </p>
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <Button variant="outline" size="icon" onClick={testConnection} disabled={isTesting} title="Test Connection">
//             <Settings className={`h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
//           </Button>
//           <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
//             <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//           </Button>
//           <Button
//             variant={autoRefresh ? "default" : "outline"}
//             onClick={() => setAutoRefresh(!autoRefresh)}
//             className="w-full sm:w-auto"
//           >
//             <Activity className="mr-2 h-4 w-4" />
//             Auto Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Demo Mode Alert */}
//       {isDemoMode && (
//         <Alert>
//           <Info className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-2">
//               <p className="font-medium">Demo Mode Active</p>
//               <p className="text-sm">
//                 This is showing simulated VPS metrics. SSH connections are not supported in the v0 runtime environment.
//                 To monitor a real VPS, deploy this application to a server environment.
//               </p>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Error Alert */}
//       {error && !isDemoMode && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-2">
//               <p className="font-medium">Connection Error</p>
//               <p className="text-sm">{error}</p>
//               <div className="flex gap-2 mt-3">
//                 <Button size="sm" variant="outline" onClick={testConnection} disabled={isTesting}>
//                   <Settings className="mr-2 h-3 w-3" />
//                   Test Connection
//                 </Button>
//                 <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
//                   <RefreshCw className="mr-2 h-3 w-3" />
//                   Retry
//                 </Button>
//               </div>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* System Overview */}
//       {metrics && status && <SystemInfoCard metrics={metrics} status={status} />}

//       {/* Connection Status */}
//       {status && (
//         <Card
//           className={`border-l-4 ${status.status === "online"
//               ? "border-l-green-500"
//               : status.status === "demo"
//                 ? "border-l-blue-500"
//                 : "border-l-red-500"
//             }`}
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2">
//               <Server className="h-5 w-5" />
//               Connection Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {getStatusIcon(status.status)}
//                 <div>
//                   <p className="font-medium capitalize">{status.status}</p>
//                   {status.message && <p className="text-sm text-muted-foreground">{status.message}</p>}
//                   {status.error && <p className="text-sm text-muted-foreground">{status.error}</p>}
//                 </div>
//               </div>
//               {status.responseTime && (
//                 <div className="text-right">
//                   <p className="text-sm text-muted-foreground">Response Time</p>
//                   <p className="font-medium">{status.responseTime.toFixed(0)}ms</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Metrics Grid */}
//       {metrics && (
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
//             {/* CPU Usage */}
//             <Card className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded">
//                     <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
//                   </div>
//                   CPU Usage
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Usage</span>
//                     <span className="font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={metrics.cpu.usage} className="h-2" />
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 pt-2 border-t">
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">1m Load</p>
//                     <p className="font-medium">{metrics.cpu.loadAverage[0]?.toFixed(2) || "0.00"}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">5m Load</p>
//                     <p className="font-medium">{metrics.cpu.loadAverage[1]?.toFixed(2) || "0.00"}</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">15m Load</p>
//                     <p className="font-medium">{metrics.cpu.loadAverage[2]?.toFixed(2) || "0.00"}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Memory Usage */}
//             <Card className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded">
//                     <MemoryStick className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   Memory Usage
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Usage</span>
//                     <span className="font-medium">{metrics.memory.usage.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={metrics.memory.usage} className="h-2" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 pt-2 border-t">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Used</p>
//                     <p className="font-medium">{formatBytes(metrics.memory.used)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Total</p>
//                     <p className="font-medium">{formatBytes(metrics.memory.total)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Free</p>
//                     <p className="font-medium">{formatBytes(metrics.memory.free)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Available</p>
//                     <p className="font-medium">{formatBytes(metrics.memory.available)}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Disk Usage */}
//             <Card className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded">
//                     <HardDrive className="h-4 w-4 text-green-600 dark:text-green-400" />
//                   </div>
//                   Disk Usage
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Usage</span>
//                     <span className="font-medium">{metrics.disk.usage.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={metrics.disk.usage} className="h-2" />
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 pt-2 border-t">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Used</p>
//                     <p className="font-medium">{formatBytes(metrics.disk.used)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Free</p>
//                     <p className="font-medium">{formatBytes(metrics.disk.free)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Total</p>
//                     <p className="font-medium">{formatBytes(metrics.disk.total)}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Network Interfaces */}
//             <Card className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded">
//                     <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   Network Interfaces
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {metrics.network.interfaces.map((interface_, index) => (
//                     <div key={index} className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Wifi className="h-4 w-4 text-muted-foreground" />
//                           <span className="font-medium">{interface_.name}</span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Download className="h-3 w-3 text-green-500" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">RX</p>
//                             <p className="font-medium">{formatBytes(interface_.rx_bytes)}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Upload className="h-3 w-3 text-blue-500" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">TX</p>
//                             <p className="font-medium">{formatBytes(interface_.tx_bytes)}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {index < metrics.network.interfaces.length - 1 && <div className="border-b border-border/40" />}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <div>
//             <QuickActions />
//           </div>
//         </div>
//       )}

//       {/* Fallback when no metrics */}
//       {!metrics && !isLoading && (
//         <Card className="p-8 text-center">
//           <div className="space-y-4">
//             <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
//             <div>
//               <h3 className="text-lg font-semibold">No Metrics Available</h3>
//               <p className="text-muted-foreground">
//                 Unable to retrieve system metrics. Please check your VPS connection.
//               </p>
//             </div>
//             <div className="flex gap-2 justify-center">
//               <Button onClick={testConnection} disabled={isTesting} variant="outline">
//                 <Settings className={`mr-2 h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
//                 Test Connection
//               </Button>
//               <Button onClick={handleRefresh} disabled={isRefreshing}>
//                 <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//                 Try Again
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}
//     </motion.div>
//   )
// }
