"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemMetrics } from "@/components/system-metrics"
import { DatabaseOverview } from "@/components/database-overview"
import { RecentActivity } from "@/components/recent-activity"
import { AlertsPanel } from "@/components/alerts-panel"
import { Database, Server, Users, Activity } from "lucide-react"
import ServerDashboard from "@/components/server-dashboard"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    databases: 0,
    connections: 0,
    users: 0,
    uptime: "0h 0m",
  })

  useEffect(() => {
    // Simulate fetching metrics
    const fetchMetrics = async () => {
      // In a real app, this would fetch from your API
      setMetrics({
        databases: 12,
        connections: 45,
        users: 8,
        uptime: "15d 4h 23m",
      })
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    // <ServerDashboard/>
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your PostgreSQL databases and system status</p>
      </div>

      {/* Metrics Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-2xl font-bold"
            >
              {metrics.databases}
            </motion.div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-2xl font-bold"
            >
              {metrics.connections}
            </motion.div>
            <p className="text-xs text-muted-foreground">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-2xl font-bold"
            >
              {metrics.users}
            </motion.div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-2xl font-bold"
            >
              {metrics.uptime}
            </motion.div>
            <p className="text-xs text-muted-foreground">99.9% availability</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SystemMetrics />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AlertsPanel />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <DatabaseOverview />
        </motion.div>

        <motion.div variants={itemVariants}>
          <RecentActivity />
        </motion.div>
      </div>
    </motion.div>
  )
}
