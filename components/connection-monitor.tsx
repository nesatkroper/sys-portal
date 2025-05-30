"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, X } from "lucide-react"

export function ConnectionMonitor() {
  const [connections, setConnections] = useState([])

  useEffect(() => {
    // Mock connection data
    setConnections([
      {
        id: 1,
        database: "ecommerce_prod",
        user: "admin",
        clientAddr: "192.168.1.50",
        state: "active",
        query: "SELECT * FROM products WHERE category_id = 5",
        duration: "00:02:15",
        waitEvent: null,
        backend: "client backend",
      },
      {
        id: 2,
        database: "analytics_warehouse",
        user: "analytics_user",
        clientAddr: "10.0.0.25",
        state: "idle",
        query: "SELECT COUNT(*) FROM user_events",
        duration: "00:00:45",
        waitEvent: null,
        backend: "client backend",
      },
      {
        id: 3,
        database: "ecommerce_prod",
        user: "dev_user",
        clientAddr: "192.168.1.75",
        state: "active",
        query: "UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123",
        duration: "00:00:12",
        waitEvent: "DataFileRead",
        backend: "client backend",
      },
      {
        id: 4,
        database: "user_sessions",
        user: "session_manager",
        clientAddr: "172.16.0.10",
        state: "idle in transaction",
        query: "BEGIN; INSERT INTO sessions (user_id, token) VALUES (456, 'abc123')",
        duration: "00:01:30",
        waitEvent: null,
        backend: "client backend",
      },
      {
        id: 5,
        database: "logs_archive",
        user: "log_admin",
        clientAddr: "192.168.1.100",
        state: "active",
        query: "DELETE FROM access_logs WHERE created_at < '2024-01-01'",
        duration: "00:05:22",
        waitEvent: "IO",
        backend: "client backend",
      },
    ])
  }, [])

  const getStateColor = (state: string) => {
    switch (state) {
      case "active":
        return "default"
      case "idle":
        return "secondary"
      case "idle in transaction":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <span>Active Connections</span>
        </CardTitle>
        <CardDescription>Current database connections and their activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-semibold">Database</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Client IP</TableHead>
                <TableHead className="font-semibold">State</TableHead>
                <TableHead className="font-semibold">Current Query</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">{connection.database}</TableCell>
                  <TableCell>{connection.user}</TableCell>
                  <TableCell className="font-mono text-sm">{connection.clientAddr}</TableCell>
                  <TableCell>
                    <Badge variant={getStateColor(connection.state)}>{connection.state}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-mono text-xs" title={connection.query}>
                      {connection.query}
                    </div>
                    {connection.waitEvent && (
                      <div className="text-xs text-muted-foreground mt-1">Wait: {connection.waitEvent}</div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{connection.duration}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
