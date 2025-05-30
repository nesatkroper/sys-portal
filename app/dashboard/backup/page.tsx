"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateBackupDialog } from "@/components/create-backup-dialog"
import { RestoreBackupDialog } from "@/components/restore-backup-dialog"
import { ScheduleBackupDialog } from "@/components/schedule-backup-dialog"
import {
  HardDrive,
  Download,
  Upload,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
} from "lucide-react"

export default function BackupPage() {
  const [backups, setBackups] = useState([])
  const [schedules, setSchedules] = useState([])
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [activeBackup, setActiveBackup] = useState(null)

  useEffect(() => {
    // Mock backup data
    setBackups([
      {
        id: 1,
        database: "ecommerce_prod",
        filename: "ecommerce_prod_2024-01-30_14-30-00.sql",
        size: "2.4 GB",
        type: "full",
        status: "completed",
        createdAt: "2024-01-30 14:30:00",
        duration: "4m 32s",
        compression: "gzip",
        location: "/backups/ecommerce_prod/",
      },
      {
        id: 2,
        database: "analytics_warehouse",
        filename: "analytics_warehouse_2024-01-30_02-00-00.sql",
        size: "1.8 GB",
        type: "full",
        status: "completed",
        createdAt: "2024-01-30 02:00:00",
        duration: "3m 15s",
        compression: "gzip",
        location: "/backups/analytics_warehouse/",
      },
      {
        id: 3,
        database: "user_sessions",
        filename: "user_sessions_2024-01-30_06-00-00.sql",
        size: "512 MB",
        type: "incremental",
        status: "completed",
        createdAt: "2024-01-30 06:00:00",
        duration: "1m 45s",
        compression: "gzip",
        location: "/backups/user_sessions/",
      },
      {
        id: 4,
        database: "logs_archive",
        filename: "logs_archive_2024-01-29_23-00-00.sql",
        size: "5.2 GB",
        type: "full",
        status: "failed",
        createdAt: "2024-01-29 23:00:00",
        duration: "0m 30s",
        error: "Insufficient disk space",
        location: "/backups/logs_archive/",
      },
      {
        id: 5,
        database: "inventory_mgmt",
        filename: "inventory_mgmt_2024-01-30_10-15-00.sql",
        size: "890 MB",
        type: "full",
        status: "in_progress",
        createdAt: "2024-01-30 10:15:00",
        progress: 67,
        location: "/backups/inventory_mgmt/",
      },
    ])

    setSchedules([
      {
        id: 1,
        name: "Daily Production Backup",
        database: "ecommerce_prod",
        schedule: "0 2 * * *",
        type: "full",
        retention: "30 days",
        status: "active",
        nextRun: "2024-01-31 02:00:00",
        lastRun: "2024-01-30 02:00:00",
        lastStatus: "success",
      },
      {
        id: 2,
        name: "Weekly Analytics Backup",
        database: "analytics_warehouse",
        schedule: "0 1 * * 0",
        type: "full",
        retention: "12 weeks",
        status: "active",
        nextRun: "2024-02-04 01:00:00",
        lastRun: "2024-01-28 01:00:00",
        lastStatus: "success",
      },
      {
        id: 3,
        name: "Hourly Sessions Backup",
        database: "user_sessions",
        schedule: "0 * * * *",
        type: "incremental",
        retention: "7 days",
        status: "paused",
        nextRun: null,
        lastRun: "2024-01-30 09:00:00",
        lastStatus: "success",
      },
    ])
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "default"
      case "failed":
      case "error":
        return "destructive"
      case "in_progress":
        return "secondary"
      default:
        return "outline"
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Backup & Restore
          </h1>
          <p className="text-muted-foreground mt-2">Manage database backups, restores, and schedules</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" onClick={() => setIsRestoreOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Restore
          </Button>
          <Button onClick={() => setIsCreateBackupOpen(true)} className="shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <HardDrive className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">
              {backups.filter((b) => b.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.8 GB</div>
            <p className="text-xs text-muted-foreground">Across all databases</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.filter((s) => s.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">{schedules.length} total schedules</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="backups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-blue-600" />
                  <span>Backup History</span>
                </CardTitle>
                <CardDescription>Recent database backups and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Database</TableHead>
                        <TableHead className="font-semibold">Filename</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backups.map((backup) => (
                        <TableRow key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{backup.database}</TableCell>
                          <TableCell className="font-mono text-sm">{backup.filename}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{backup.type}</Badge>
                          </TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(backup.status)}
                              <Badge variant={getStatusColor(backup.status)}>{backup.status}</Badge>
                            </div>
                            {backup.status === "in_progress" && backup.progress && (
                              <Progress value={backup.progress} className="mt-2 h-1" />
                            )}
                            {backup.error && <p className="text-xs text-red-600 mt-1">{backup.error}</p>}
                          </TableCell>
                          <TableCell className="text-sm">{backup.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
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

        <TabsContent value="schedules" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Backup Schedules</span>
                </CardTitle>
                <CardDescription>Automated backup schedules and their configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Database</TableHead>
                        <TableHead className="font-semibold">Schedule</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Next Run</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{schedule.name}</TableCell>
                          <TableCell>{schedule.database}</TableCell>
                          <TableCell className="font-mono text-sm">{schedule.schedule}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{schedule.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {schedule.status === "active" ? (
                                <Play className="h-4 w-4 text-green-600" />
                              ) : (
                                <Pause className="h-4 w-4 text-gray-600" />
                              )}
                              <Badge variant={schedule.status === "active" ? "default" : "secondary"}>
                                {schedule.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{schedule.nextRun || "Not scheduled"}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                {schedule.status === "active" ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
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
      </Tabs>

      <CreateBackupDialog
        open={isCreateBackupOpen}
        onOpenChange={setIsCreateBackupOpen}
        onSuccess={() => {
          // Refresh backups list
        }}
      />

      <RestoreBackupDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        backups={backups.filter((b) => b.status === "completed")}
        onSuccess={() => {
          // Handle restore success
        }}
      />

      <ScheduleBackupDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        onSuccess={() => {
          // Refresh schedules list
        }}
      />
    </motion.div>
  )
}
