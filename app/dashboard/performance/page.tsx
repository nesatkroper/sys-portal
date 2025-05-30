"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Network,
  MemoryStick,
  Timer,
  Users,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { useDatabaseStore, useSystemStore } from "@/lib/store"

// Mock performance data
const performanceData = [
  { time: "00:00", cpu: 45, memory: 62, connections: 23, queries: 156 },
  { time: "04:00", cpu: 52, memory: 58, connections: 18, queries: 134 },
  { time: "08:00", cpu: 78, memory: 71, connections: 45, queries: 289 },
  { time: "12:00", cpu: 85, memory: 76, connections: 67, queries: 412 },
  { time: "16:00", cpu: 92, memory: 82, connections: 78, queries: 523 },
  { time: "20:00", cpu: 67, memory: 69, connections: 56, queries: 345 },
]

const slowQueries = [
  {
    id: 1,
    query: "SELECT * FROM orders o JOIN users u ON o.user_id = u.id WHERE o.created_at > '2024-01-01'",
    duration: 2.45,
    executions: 156,
    avgDuration: 2.12,
    database: "ecommerce_prod",
    lastExecuted: "2 minutes ago",
  },
  {
    id: 2,
    query: "SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id",
    duration: 1.89,
    executions: 89,
    avgDuration: 1.67,
    database: "ecommerce_prod",
    lastExecuted: "5 minutes ago",
  },
  {
    id: 3,
    query: "UPDATE inventory SET stock = stock - 1 WHERE product_id IN (SELECT id FROM products WHERE category_id = 5)",
    duration: 3.21,
    executions: 23,
    avgDuration: 2.98,
    database: "ecommerce_prod",
    lastExecuted: "8 minutes ago",
  },
]

const connectionStats = [
  { database: "ecommerce_prod", active: 23, idle: 12, total: 35, maxConnections: 100 },
  { database: "analytics_warehouse", active: 8, idle: 4, total: 12, maxConnections: 50 },
  { database: "staging_app", active: 2, idle: 1, total: 3, maxConnections: 25 },
]

export default function PerformancePage() {
  const { databases } = useDatabaseStore()
  const { metrics, isMonitoring, toggleMonitoring } = useSystemStore()
  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 67,
    memory: 74,
    disk: 45,
    network: 23,
    activeConnections: 89,
    queriesPerSecond: 156,
    avgResponseTime: 2.3,
    cacheHitRatio: 94.2,
  })

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setCurrentMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 10)),
        queriesPerSecond: Math.max(0, prev.queriesPerSecond + Math.floor((Math.random() - 0.5) * 50)),
        avgResponseTime: Math.max(0.1, prev.avgResponseTime + (Math.random() - 0.5) * 0.5),
        cacheHitRatio: Math.max(0, Math.min(100, prev.cacheHitRatio + (Math.random() - 0.5) * 2)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-500"
    if (value >= thresholds.warning) return "text-yellow-500"
    return "text-green-500"
  }

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (value >= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time database performance metrics and optimization insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={isMonitoring ? "destructive" : "default"} onClick={toggleMonitoring}>
            <Activity className="mr-2 h-4 w-4" />
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{currentMetrics.cpu.toFixed(1)}%</div>
              {getStatusIcon(currentMetrics.cpu, { warning: 70, critical: 85 })}
            </div>
            <Progress value={currentMetrics.cpu} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {isMonitoring ? "Live monitoring" : "Last updated 5 min ago"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{currentMetrics.memory.toFixed(1)}%</div>
              {getStatusIcon(currentMetrics.memory, { warning: 75, critical: 90 })}
            </div>
            <Progress value={currentMetrics.memory} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">12.4 GB / 16 GB used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{currentMetrics.activeConnections}</div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries/sec</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{currentMetrics.queriesPerSecond}</div>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground">-5% from last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>System metrics over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cpu">CPU</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="queries">Queries</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="connections" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="cpu" className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="memory" className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="memory" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="queries" className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="queries" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slow Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="mr-2 h-5 w-5" />
              Slow Queries
            </CardTitle>
            <CardDescription>Queries taking longer than 1 second to execute</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {slowQueries.map((query) => (
                  <div key={query.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="text-xs">
                        {query.duration}s
                      </Badge>
                      <span className="text-xs text-muted-foreground">{query.lastExecuted}</span>
                    </div>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {query.query.length > 80 ? `${query.query.substring(0, 80)}...` : query.query}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Executions: {query.executions}</span>
                      <span>Avg: {query.avgDuration}s</span>
                      <span>{query.database}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Connection Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5" />
              Connection Statistics
            </CardTitle>
            <CardDescription>Active database connections by database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionStats.map((stat) => (
                <div key={stat.database} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{stat.database}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.total}/{stat.maxConnections}
                    </span>
                  </div>
                  <Progress value={(stat.total / stat.maxConnections) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Active: {stat.active}</span>
                    <span>Idle: {stat.idle}</span>
                    <span>Usage: {((stat.total / stat.maxConnections) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <div className="font-medium">{currentMetrics.avgResponseTime.toFixed(2)}s</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Cache Hit Ratio</span>
                  <div className="font-medium">{currentMetrics.cacheHitRatio.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Disk Usage</span>
                  <div className="font-medium">{currentMetrics.disk.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Network I/O</span>
                  <div className="font-medium">{currentMetrics.network.toFixed(1)} MB/s</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
