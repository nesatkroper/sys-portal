"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileSpreadsheet, FileText, Code, Database } from "lucide-react"
import { useDatabaseStore, useExportStore } from "@/lib/store"

interface CreateExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockTables = [
  { name: "users", rows: 15420, size: "2.3 MB" },
  { name: "orders", rows: 45230, size: "8.7 MB" },
  { name: "products", rows: 2340, size: "1.2 MB" },
  { name: "categories", rows: 45, size: "12 KB" },
  { name: "order_items", rows: 89450, size: "15.4 MB" },
  { name: "reviews", rows: 12340, size: "3.1 MB" },
]

export function CreateExportDialog({ open, onOpenChange }: CreateExportDialogProps) {
  const { databases, selectedDatabase } = useDatabaseStore()
  const { createExport } = useExportStore()
  const [exportName, setExportName] = useState("")
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv" | "json" | "sql">("xlsx")
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [exportDatabase, setExportDatabase] = useState(selectedDatabase || databases[0]?.id || "")
  const [isCreating, setIsCreating] = useState(false)

  const formatOptions = [
    {
      value: "xlsx",
      label: "Excel (XLSX)",
      description: "Spreadsheet format with multiple sheets",
      icon: FileSpreadsheet,
      color: "text-green-600",
    },
    {
      value: "csv",
      label: "CSV",
      description: "Comma-separated values for data analysis",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      value: "json",
      label: "JSON",
      description: "JavaScript Object Notation for APIs",
      icon: Code,
      color: "text-purple-600",
    },
    {
      value: "sql",
      label: "SQL Dump",
      description: "Complete database backup with structure",
      icon: Database,
      color: "text-orange-600",
    },
  ]

  const handleTableToggle = (tableName: string) => {
    setSelectedTables((prev) => (prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]))
  }

  const handleSelectAll = () => {
    setSelectedTables(mockTables.map((t) => t.name))
  }

  const handleSelectNone = () => {
    setSelectedTables([])
  }

  const handleCreateExport = async () => {
    if (!exportName.trim()) return

    setIsCreating(true)

    try {
      await createExport({
        name: exportName,
        format: exportFormat,
        database: exportDatabase,
        tables: selectedTables,
      })

      // Reset form
      setExportName("")
      setExportFormat("xlsx")
      setSelectedTables([])
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create export:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const selectedFormat = formatOptions.find((f) => f.value === exportFormat)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Export</DialogTitle>
          <DialogDescription>Export your database content in various formats for analysis or backup</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-name">Export Name</Label>
              <Input
                id="export-name"
                placeholder="e.g., Monthly User Report"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Select value={exportDatabase} onValueChange={setExportDatabase}>
                <SelectTrigger>
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            db.status === "connected" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span>{db.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="grid grid-cols-1 gap-2">
                {formatOptions.map((format) => (
                  <Card
                    key={format.value}
                    className={`cursor-pointer transition-colors ${
                      exportFormat === format.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setExportFormat(format.value as any)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <format.icon className={`h-5 w-5 ${format.color}`} />
                        <div className="flex-1">
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-muted-foreground">{format.description}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            exportFormat === format.value ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Tables</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectNone}>
                  Select None
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  Tables ({selectedTables.length} of {mockTables.length} selected)
                </CardTitle>
                <CardDescription>Choose which tables to include in your export</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {mockTables.map((table) => (
                      <div
                        key={table.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={table.name}
                            checked={selectedTables.includes(table.name)}
                            onCheckedChange={() => handleTableToggle(table.name)}
                          />
                          <div>
                            <label htmlFor={table.name} className="font-medium cursor-pointer">
                              {table.name}
                            </label>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{table.rows.toLocaleString()} rows</span>
                              <span>•</span>
                              <span>{table.size}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {table.size}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {selectedFormat && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <selectedFormat.icon className={`mr-2 h-4 w-4 ${selectedFormat.color}`} />
                    {selectedFormat.label} Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exportFormat === "xlsx" && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-headers" defaultChecked />
                        <label htmlFor="include-headers" className="text-sm">
                          Include column headers
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="separate-sheets" defaultChecked />
                        <label htmlFor="separate-sheets" className="text-sm">
                          Separate sheet per table
                        </label>
                      </div>
                    </div>
                  )}
                  {exportFormat === "csv" && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-headers-csv" defaultChecked />
                        <label htmlFor="include-headers-csv" className="text-sm">
                          Include column headers
                        </label>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Delimiter</Label>
                        <Select defaultValue="comma">
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comma">Comma (,)</SelectItem>
                            <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                            <SelectItem value="tab">Tab</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {exportFormat === "sql" && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-structure" defaultChecked />
                        <label htmlFor="include-structure" className="text-sm">
                          Include table structure
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-data" defaultChecked />
                        <label htmlFor="include-data" className="text-sm">
                          Include table data
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateExport}
            disabled={!exportName.trim() || selectedTables.length === 0 || isCreating}
          >
            {isCreating ? "Creating..." : "Create Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
