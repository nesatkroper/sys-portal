"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemResourceChart } from "@/components/system-resource-chart"
import { ProcessMonitor } from "@/components/process-monitor"
import { ConnectionMonitor } from "@/components/connection-monitor"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { Cpu, HardDrive, Wifi, Server, Database } from "lucide-react"

export default function SystemPage() {
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 45, cores: 8, frequency: "3.2 GHz" },
    memory: { used: 12.4, total: 32, usage: 38.75 },
    disk: { used: 156, total: 500, usage: 31.2 },
    network: { in: 1.2, out: 0.8, usage: 15 },
    uptime: "15d 4h 23m",
    load: [1.2, 1.5, 1.8],
    temperature: 42,
  })

  const [postgresStats, setPostgresStats] = useState({
    version: "PostgreSQL 15.4",
    status: "running",
    uptime: "15d 4h 20m",
    connections: { active: 45, max: 200, idle: 12 },
    databases: 6,
    totalSize: "68.2 GB",
    transactions: { commits: 1247892, rollbacks: 234 },
    cache: { hit: 98.7, miss: 1.3 },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.max(0, Math.min(100, prev.cpu.usage + (Math.random() - 0.5) * 10)) },
        memory: { ...prev.memory, usage: Math.max(0, Math.min(100, prev.memory.usage + (Math.random() - 0.5) * 5)) },
        network: {
          ...prev.network,
          usage: Math.max(0, Math.min(100, prev.network.usage + (Math.random() - 0.5) * 20)),
        },
        temperature: Math.max(30, Math.min(80, prev.temperature + (Math.random() - 0.5) * 5)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          System Monitor
        </h1>
        <p className="text-muted-foreground mt-2">Real-time system and PostgreSQL performance monitoring</p>
      </div>

      {/* System Overview Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.cpu.usage.toFixed(1)}%</div>
            <Progress value={systemStats.cpu.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemStats.cpu.cores} cores @ {systemStats.cpu.frequency}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.memory.usage.toFixed(1)}%</div>
            <Progress value={systemStats.memory.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemStats.memory.used} GB / {systemStats.memory.total} GB
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <Server className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.disk.usage.toFixed(1)}%</div>
            <Progress value={systemStats.disk.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemStats.disk.used} GB / {systemStats.disk.total} GB
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Wifi className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.network.usage.toFixed(1)}%</div>
            <Progress value={systemStats.network.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              ↓ {systemStats.network.in} MB/s ↑ {systemStats.network.out} MB/s
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* PostgreSQL Status */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>PostgreSQL Status</span>
            </CardTitle>
            <CardDescription>Database server information and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="default" className="bg-green-500">
                    {postgresStats.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm font-medium">{postgresStats.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium">{postgresStats.uptime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connections</span>
                  <span className="text-sm font-medium">
                    {postgresStats.connections.active}/{postgresStats.connections.max}
                  </span>
                </div>
                <Progress
                  value={(postgresStats.connections.active / postgresStats.connections.max) * 100}
                  className="h-2"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Idle</span>
                  <span className="text-xs text-muted-foreground">{postgresStats.connections.idle}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Ratio</span>
                  <span className="text-sm font-medium">{postgresStats.cache.hit}%</span>
                </div>
                <Progress value={postgresStats.cache.hit} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Miss Rate</span>
                  <span className="text-xs text-muted-foreground">{postgresStats.cache.miss}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Databases</span>
                  <span className="text-sm font-medium">{postgresStats.databases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Size</span>
                  <span className="text-sm font-medium">{postgresStats.totalSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Commits</span>
                  <span className="text-xs text-muted-foreground">
                    {postgresStats.transactions.commits.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="processes">Processes</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <motion.div variants={itemVariants}>
            <SystemResourceChart />
          </motion.div>
        </TabsContent>

        <TabsContent value="processes">
          <motion.div variants={itemVariants}>
            <ProcessMonitor />
          </motion.div>
        </TabsContent>

        <TabsContent value="connections">
          <motion.div variants={itemVariants}>
            <ConnectionMonitor />
          </motion.div>
        </TabsContent>

        <TabsContent value="performance">
          <motion.div variants={itemVariants}>
            <PerformanceMetrics />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
