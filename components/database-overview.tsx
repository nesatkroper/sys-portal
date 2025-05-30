"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"

export function DatabaseOverview() {
  const [databases, setDatabases] = useState([])

  useEffect(() => {
    // Mock database overview data
    setDatabases([
      {
        name: "ecommerce_prod",
        status: "online",
        connections: 23,
        maxConnections: 100,
        size: "15.4 GB",
        tables: 45,
        activity: "high",
      },
      {
        name: "analytics_warehouse",
        status: "online",
        connections: 12,
        maxConnections: 50,
        size: "8.7 GB",
        tables: 28,
        activity: "medium",
      },
      {
        name: "user_sessions",
        status: "online",
        connections: 45,
        maxConnections: 200,
        size: "2.1 GB",
        tables: 8,
        activity: "high",
      },
      {
        name: "logs_archive",
        status: "maintenance",
        connections: 0,
        maxConnections: 20,
        size: "32.8 GB",
        tables: 12,
        activity: "low",
      },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Overview</CardTitle>
        <CardDescription>Current status of all databases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {databases.map((db, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">{db.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {db.tables} tables • {db.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {db.connections}/{db.maxConnections} connections
                  </div>
                  <Progress value={(db.connections / db.maxConnections) * 100} className="w-20 h-2 mt-1" />
                </div>

                <Badge
                  variant={
                    db.status === "online" ? "default" : db.status === "maintenance" ? "secondary" : "destructive"
                  }
                >
                  {db.status}
                </Badge>

                <Badge
                  variant="outline"
                  className={
                    db.activity === "high"
                      ? "border-red-200 text-red-700"
                      : db.activity === "medium"
                        ? "border-yellow-200 text-yellow-700"
                        : "border-green-200 text-green-700"
                  }
                >
                  {db.activity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
