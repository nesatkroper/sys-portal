"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function SystemMetrics() {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 15,
  })

  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 20)),
      }))

      setChartData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            cpu: metrics.cpu,
            memory: metrics.memory,
          },
        ].slice(-20)
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [metrics.cpu, metrics.memory])

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Real-time system resource usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span>{metrics.cpu.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.cpu} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memory Usage</span>
              <span>{metrics.memory.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.memory} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Disk Usage</span>
              <span>{metrics.disk.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.disk} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Network I/O</span>
              <span>{metrics.network.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.network} className="h-2" />
          </div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
