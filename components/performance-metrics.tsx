"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Clock, Database } from "lucide-react"

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    queryPerformance: [
      { name: "SELECT", count: 1247, avgTime: 45 },
      { name: "INSERT", count: 892, avgTime: 23 },
      { name: "UPDATE", count: 456, avgTime: 67 },
      { name: "DELETE", count: 123, avgTime: 89 },
    ],
    cacheHitRatio: 98.7,
    indexUsage: [
      { name: "Used", value: 85, color: "#10b981" },
      { name: "Unused", value: 15, color: "#ef4444" },
    ],
    slowQueries: [
      {
        query: "SELECT * FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.created_at > '2024-01-01'",
        duration: "2.45s",
        calls: 23,
        database: "ecommerce_prod",
      },
      {
        query: "UPDATE inventory SET quantity = quantity - 1 WHERE product_id IN (SELECT...)",
        duration: "1.89s",
        calls: 45,
        database: "ecommerce_prod",
      },
      {
        query: "DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '7 days'",
        duration: "1.23s",
        calls: 12,
        database: "user_sessions",
      },
    ],
  })

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRatio}%</div>
            <Progress value={metrics.cacheHitRatio} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Query Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45ms</div>
            <p className="text-xs text-muted-foreground">-12% from last hour</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries/sec</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8% from last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle>Query Performance by Type</CardTitle>
            <CardDescription>Average execution time and frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.queryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgTime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle>Index Usage</CardTitle>
            <CardDescription>Percentage of indexes being utilized</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.indexUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.indexUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {metrics.indexUsage.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slow Queries */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Slow Queries</CardTitle>
          <CardDescription>Queries taking longer than expected to execute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.slowQueries.map((query, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Duration: {query.duration}</span>
                    <span className="text-sm text-muted-foreground">Calls: {query.calls}</span>
                    <span className="text-sm text-muted-foreground">DB: {query.database}</span>
                  </div>
                </div>
                <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">{query.query}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
