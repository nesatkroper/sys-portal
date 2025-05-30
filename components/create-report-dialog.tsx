"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, BarChart3, Shield, HardDrive, Calendar, Clock } from "lucide-react"
import { useReportStore, useDatabaseStore } from "@/lib/store"

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateReportDialog({ open, onOpenChange, onSuccess }: CreateReportDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "performance" as "performance" | "usage" | "security" | "backup",
    database: "",
    format: "pdf" as "pdf" | "xlsx" | "csv",
    dateRange: "last_7_days",
    includeCharts: true,
    includeRawData: false,
    customQuery: "",
    schedule: false,
    scheduleFrequency: "weekly",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { generateReport } = useReportStore()
  const { databases } = useDatabaseStore()

  const reportTypes = [
    {
      type: "performance",
      title: "Performance Report",
      description: "Query performance, slow queries, and optimization recommendations",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      type: "usage",
      title: "Usage Report",
      description: "Database usage statistics, connection patterns, and resource utilization",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      type: "security",
      title: "Security Report",
      description: "Security audit, failed logins, and access patterns",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      type: "backup",
      title: "Backup Report",
      description: "Backup status, success rates, and storage usage",
      icon: HardDrive,
      color: "bg-purple-500",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await generateReport({
        name: formData.name,
        type: formData.type,
        database: formData.database,
        format: formData.format,
      })
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        type: "performance",
        database: "",
        format: "pdf",
        dateRange: "last_7_days",
        includeCharts: true,
        includeRawData: false,
        customQuery: "",
        schedule: false,
        scheduleFrequency: "weekly",
      })
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generate Report</span>
          </DialogTitle>
          <DialogDescription>
            Create comprehensive reports with professional templates and export options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* Report Type Selection */}
                <div className="space-y-4">
                  <Label>Report Type</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {reportTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Card
                          key={type.type}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            formData.type === type.type ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, type: type.type as any }))}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${type.color} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <CardTitle className="text-sm">{type.title}</CardTitle>
                                <CardDescription className="text-xs">{type.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Basic Configuration */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Report Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Monthly Performance Report"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="database">Database</Label>
                    <Select
                      value={formData.database}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, database: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        {databases.map((db) => (
                          <SelectItem key={db.id} value={db.name}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  db.status === "connected" ? "bg-green-500" : "bg-gray-400"
                                }`}
                              />
                              <span>{db.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {db.environment}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, format: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>PDF - Professional Report</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="xlsx">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Excel - Data Analysis</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="csv">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>CSV - Raw Data</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select
                      value={formData.dateRange}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, dateRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                        <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                        <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                        <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Label>Report Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCharts"
                        checked={formData.includeCharts}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, includeCharts: checked as boolean }))
                        }
                      />
                      <Label htmlFor="includeCharts">Include charts and visualizations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRawData"
                        checked={formData.includeRawData}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, includeRawData: checked as boolean }))
                        }
                      />
                      <Label htmlFor="includeRawData">Include raw data tables</Label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customQuery">Custom SQL Query (Optional)</Label>
                <Textarea
                  id="customQuery"
                  value={formData.customQuery}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customQuery: e.target.value }))}
                  placeholder="SELECT * FROM your_table WHERE condition..."
                  className="min-h-[100px] font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Add custom SQL queries to include specific data in your report
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Template Customization</CardTitle>
                  <CardDescription>Customize the report template and styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <Select defaultValue="blue">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Professional Blue</SelectItem>
                          <SelectItem value="green">Corporate Green</SelectItem>
                          <SelectItem value="purple">Modern Purple</SelectItem>
                          <SelectItem value="gray">Minimal Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Logo Position</Label>
                      <Select defaultValue="top-left">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="none">No Logo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schedule"
                  checked={formData.schedule}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, schedule: checked as boolean }))}
                />
                <Label htmlFor="schedule">Schedule automatic report generation</Label>
              </div>

              {formData.schedule && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule Configuration</span>
                    </CardTitle>
                    <CardDescription>Set up automatic report generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={formData.scheduleFrequency}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, scheduleFrequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Select defaultValue="09:00">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700 dark:text-blue-400">
                        Next report will be generated on{" "}
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !formData.name || !formData.database} onClick={handleSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
