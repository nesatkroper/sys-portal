"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileText, Database, Clock, CheckCircle, XCircle, Plus, Trash2, Eye } from "lucide-react"
import { useExportStore, useDatabaseStore } from "@/lib/store"
import { CreateExportDialog } from "@/components/create-export-dialog"
import { formatDistanceToNow } from "date-fns"

export default function ExportPage() {
  const { exports, downloadExport, deleteExport } = useExportStore()
  const { databases } = useDatabaseStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "xlsx":
        return "📊"
      case "csv":
        return "📄"
      case "json":
        return "🔧"
      case "sql":
        return "🗃️"
      default:
        return "📁"
    }
  }

  const completedExports = exports.filter((exp) => exp.status === "completed")
  const processingExports = exports.filter((exp) => exp.status === "processing")
  const failedExports = exports.filter((exp) => exp.status === "failed")

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Export Center</h2>
          <p className="text-muted-foreground">Export database content in various formats</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exports.length}</div>
            <p className="text-xs text-muted-foreground">All time exports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedExports.length}</div>
            <p className="text-xs text-muted-foreground">Ready for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingExports.length}</div>
            <p className="text-xs text-muted-foreground">Currently generating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(exports.filter((exp) => exp.size).reduce((total, exp) => total + (exp.size || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
      </div>

      {/* Export List */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Manage your database exports and downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({exports.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedExports.length})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingExports.length})</TabsTrigger>
              <TabsTrigger value="failed">Failed ({failedExports.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {exports.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getFormatIcon(exportItem.format)}</div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{exportItem.name}</h4>
                            <Badge variant={getStatusColor(exportItem.status) as any}>
                              {getStatusIcon(exportItem.status)}
                              <span className="ml-1 capitalize">{exportItem.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Database: {exportItem.database}</span>
                            <span>Format: {exportItem.format.toUpperCase()}</span>
                            {exportItem.size && <span>Size: {formatFileSize(exportItem.size)}</span>}
                            <span>{formatDistanceToNow(new Date(exportItem.createdAt), { addSuffix: true })}</span>
                          </div>
                          {exportItem.status === "processing" && exportItem.progress !== undefined && (
                            <div className="w-64">
                              <Progress value={exportItem.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.round(exportItem.progress)}% complete
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {exportItem.status === "completed" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => downloadExport(exportItem.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => deleteExport(exportItem.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {completedExports.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getFormatIcon(exportItem.format)}</div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{exportItem.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Database: {exportItem.database}</span>
                            <span>Format: {exportItem.format.toUpperCase()}</span>
                            {exportItem.size && <span>Size: {formatFileSize(exportItem.size)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => downloadExport(exportItem.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteExport(exportItem.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {processingExports.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getFormatIcon(exportItem.format)}</div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{exportItem.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Database: {exportItem.database}</span>
                            <span>Format: {exportItem.format.toUpperCase()}</span>
                          </div>
                          {exportItem.progress !== undefined && (
                            <div className="w-64">
                              <Progress value={exportItem.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.round(exportItem.progress)}% complete
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="failed" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {failedExports.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No Failed Exports</h3>
                      <p className="text-muted-foreground">All your exports have completed successfully!</p>
                    </div>
                  ) : (
                    failedExports.map((exportItem) => (
                      <div
                        key={exportItem.id}
                        className="flex items-center justify-between p-4 border rounded-lg border-red-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getFormatIcon(exportItem.format)}</div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{exportItem.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Database: {exportItem.database}</span>
                              <span>Format: {exportItem.format.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Retry
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteExport(exportItem.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateExportDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
