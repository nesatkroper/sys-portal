"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SecurityAuditLog } from "@/components/security-audit-log"
import { SecuritySettings } from "@/components/security-settings"
import { Shield, AlertTriangle, CheckCircle, XCircle, Globe, Clock, Activity } from "lucide-react"

export default function SecurityPage() {
  const [securityScore, setSecurityScore] = useState(87)
  const [threats, setThreats] = useState([])
  const [connections, setConnections] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  useEffect(() => {
    // Mock security data
    setThreats([
      {
        id: 1,
        type: "Suspicious Login",
        severity: "medium",
        description: "Multiple failed login attempts from IP 192.168.1.100",
        timestamp: "2024-01-30 14:22:15",
        status: "investigating",
        source: "192.168.1.100",
      },
      {
        id: 2,
        type: "SQL Injection Attempt",
        severity: "high",
        description: "Potential SQL injection detected in query",
        timestamp: "2024-01-30 13:45:30",
        status: "blocked",
        source: "203.0.113.45",
      },
      {
        id: 3,
        type: "Unusual Data Access",
        severity: "low",
        description: "User accessed large amount of data outside normal hours",
        timestamp: "2024-01-30 02:15:20",
        status: "resolved",
        source: "analytics_user",
      },
    ])

    setConnections([
      {
        id: 1,
        user: "admin",
        database: "ecommerce_prod",
        ip: "192.168.1.50",
        location: "Office Network",
        duration: "2h 15m",
        status: "active",
        lastActivity: "2024-01-30 14:30:00",
      },
      {
        id: 2,
        user: "analytics_user",
        database: "analytics_warehouse",
        ip: "10.0.0.25",
        location: "VPN - Remote",
        duration: "45m",
        status: "active",
        lastActivity: "2024-01-30 14:28:00",
      },
      {
        id: 3,
        user: "dev_user",
        database: "ecommerce_prod",
        ip: "192.168.1.75",
        location: "Office Network",
        duration: "1h 30m",
        status: "idle",
        lastActivity: "2024-01-30 13:45:00",
      },
    ])

    setAuditLogs([
      {
        id: 1,
        action: "LOGIN",
        user: "admin",
        database: "ecommerce_prod",
        ip: "192.168.1.50",
        timestamp: "2024-01-30 14:22:15",
        status: "success",
        details: "Successful login",
      },
      {
        id: 2,
        action: "CREATE_TABLE",
        user: "dev_user",
        database: "ecommerce_prod",
        ip: "192.168.1.75",
        timestamp: "2024-01-30 14:15:30",
        status: "success",
        details: "Created table 'new_products'",
      },
      {
        id: 3,
        action: "FAILED_LOGIN",
        user: "unknown",
        database: "ecommerce_prod",
        ip: "192.168.1.100",
        timestamp: "2024-01-30 14:10:45",
        status: "failed",
        details: "Invalid credentials",
      },
    ])
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "blocked":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "investigating":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

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
          Security Center
        </h1>
        <p className="text-muted-foreground mt-2">Monitor security threats, audit logs, and access controls</p>
      </div>

      {/* Security Overview */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}/100</div>
            <Progress value={securityScore} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">Excellent security posture</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threats.filter((t) => t.status !== "resolved").length}</div>
            <p className="text-xs text-muted-foreground">
              {threats.filter((t) => t.severity === "high").length} high priority
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connections.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">{connections.length} total connections</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <XCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.filter((log) => log.action === "FAILED_LOGIN").length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="threats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Security Threats</span>
                </CardTitle>
                <CardDescription>Detected security threats and incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Severity</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Source</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {threats.map((threat) => (
                        <TableRow key={threat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{threat.type}</TableCell>
                          <TableCell>
                            <Badge variant={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{threat.description}</TableCell>
                          <TableCell className="font-mono text-sm">{threat.source}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(threat.status)}
                              <span className="text-sm">{threat.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{threat.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Active Connections</span>
                </CardTitle>
                <CardDescription>Current database connections and sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Database</TableHead>
                        <TableHead className="font-semibold">IP Address</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Duration</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connections.map((connection) => (
                        <TableRow key={connection.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{connection.user}</TableCell>
                          <TableCell>{connection.database}</TableCell>
                          <TableCell className="font-mono text-sm">{connection.ip}</TableCell>
                          <TableCell>{connection.location}</TableCell>
                          <TableCell>{connection.duration}</TableCell>
                          <TableCell>
                            <Badge variant={connection.status === "active" ? "default" : "secondary"}>
                              {connection.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Terminate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <motion.div variants={itemVariants}>
            <SecurityAuditLog logs={auditLogs} />
          </motion.div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <motion.div variants={itemVariants}>
            <SecuritySettings />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
