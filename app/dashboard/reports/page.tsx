"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateReportDialog } from "@/components/create-report-dialog"
import { ReportTemplates } from "@/components/report-templates"
import { useReportStore, useDatabaseStore } from "@/lib/store"
import {
  BarChart3,
  FileText,
  Download,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Calendar,
} from "lucide-react"

export default function ReportsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { reports, generateReport, downloadReport, deleteReport } = useReportStore()
  const { databases } = useDatabaseStore()

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "generating":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "generating":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const reportTypes = [
    { type: "performance", count: reports.filter((r) => r.type === "performance").length },
    { type: "usage", count: reports.filter((r) => r.type === "usage").length },
    { type: "security", count: reports.filter((r) => r.type === "security").length },
    { type: "backup", count: reports.filter((r) => r.type === "backup").length },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Generate comprehensive reports and export data</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter((r) => r.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((r) => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Databases</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databases.length}</div>
            <p className="text-xs text-muted-foreground">Available for reporting</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8 MB</div>
            <p className="text-xs text-muted-foreground">Report files</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Generated Reports</span>
                    </CardTitle>
                    <CardDescription>View and manage your generated reports</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Report Name</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Database</TableHead>
                        <TableHead className="font-semibold">Format</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.database}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="uppercase">
                              {report.format}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(report.status)}
                              <Badge variant={getStatusColor(report.status)} className="capitalize">
                                {report.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(report.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{report.size || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {report.status === "completed" && (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => downloadReport(report.id)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteReport(report.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {reports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports generated yet. Create your first report to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <motion.div variants={itemVariants}>
            <ReportTemplates
              onSelectTemplate={(template) => {
                // Handle template selection
                setIsCreateDialogOpen(true)
              }}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle>Report Types Distribution</CardTitle>
                <CardDescription>Breakdown of generated reports by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTypes.map((type) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="capitalize">{type.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(type.count / reports.length) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest report generation activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center space-x-3">
                      {getStatusIcon(report.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.format.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <CreateReportDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          // Report generation initiated
        }}
      />
    </motion.div>
  )
}
