"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Cpu, X } from "lucide-react"

export function ProcessMonitor() {
  const [processes, setProcesses] = useState([])

  useEffect(() => {
    // Mock process data
    setProcesses([
      {
        pid: 1234,
        name: "postgres: main process",
        user: "postgres",
        cpu: 15.2,
        memory: 8.5,
        status: "running",
        startTime: "2024-01-15 10:30:00",
        command: "/usr/bin/postgres -D /var/lib/postgresql/data",
      },
      {
        pid: 1235,
        name: "postgres: writer process",
        user: "postgres",
        cpu: 5.8,
        memory: 4.2,
        status: "running",
        startTime: "2024-01-15 10:30:01",
        command: "postgres: background writer",
      },
      {
        pid: 1236,
        name: "postgres: wal writer",
        user: "postgres",
        cpu: 2.1,
        memory: 2.8,
        status: "running",
        startTime: "2024-01-15 10:30:01",
        command: "postgres: wal writer",
      },
      {
        pid: 1237,
        name: "postgres: autovacuum launcher",
        user: "postgres",
        cpu: 0.5,
        memory: 1.9,
        status: "sleeping",
        startTime: "2024-01-15 10:30:02",
        command: "postgres: autovacuum launcher",
      },
      {
        pid: 1238,
        name: "postgres: stats collector",
        user: "postgres",
        cpu: 1.2,
        memory: 3.1,
        status: "running",
        startTime: "2024-01-15 10:30:02",
        command: "postgres: stats collector",
      },
      {
        pid: 1239,
        name: "postgres: logical replication",
        user: "postgres",
        cpu: 0.8,
        memory: 2.5,
        status: "running",
        startTime: "2024-01-15 10:30:03",
        command: "postgres: logical replication launcher",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "default"
      case "sleeping":
        return "secondary"
      case "stopped":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-blue-600" />
          <span>PostgreSQL Processes</span>
        </CardTitle>
        <CardDescription>Active PostgreSQL server processes and their resource usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-semibold">PID</TableHead>
                <TableHead className="font-semibold">Process Name</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">CPU %</TableHead>
                <TableHead className="font-semibold">Memory %</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Start Time</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.pid} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-mono">{process.pid}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{process.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{process.command}</div>
                    </div>
                  </TableCell>
                  <TableCell>{process.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{process.cpu}%</span>
                      <Progress value={process.cpu} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{process.memory}%</span>
                      <Progress value={process.memory} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(process.status)}>{process.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{process.startTime}</TableCell>
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
