"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Activity } from "lucide-react"

export function SystemResourceChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // Generate initial data
    const generateData = () => {
      const now = new Date()
      const newData = []

      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000) // 1 minute intervals
        newData.push({
          time: time.toLocaleTimeString(),
          cpu: Math.random() * 40 + 30,
          memory: Math.random() * 30 + 50,
          disk: Math.random() * 20 + 20,
          network: Math.random() * 50 + 10,
        })
      }
      return newData
    }

    setData(generateData())

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData((prevData) => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          cpu: Math.random() * 40 + 30,
          memory: Math.random() * 30 + 50,
          disk: Math.random() * 20 + 20,
          network: Math.random() * 50 + 10,
        }
        return [...prevData.slice(1), newPoint]
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Resource Usage Over Time</span>
        </CardTitle>
        <CardDescription>Real-time system resource monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="memory" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="disk" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="network" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
