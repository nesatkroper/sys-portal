"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatabaseList } from "@/components/database-list"
import { CreateDatabaseDialog } from "@/components/create-database-dialog"
import { Plus, Search, Grid, List, DatabaseIcon, RefreshCw, Filter } from "lucide-react"
import type { Schema } from "@/lib/generated/prisma"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function SchemaPage() {
  const [databases, setDatabases] = useState<Schema[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchDatabases()
  }, [])

  const fetchDatabases = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/schemas")
      const data = await response.json()
      setDatabases(data)
    } catch (error) {
      console.error("Failed to fetch databases:", error)
      toast({
        title: "Error",
        description: "Failed to fetch schemas. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDatabases = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/schemas")
      const data = await response.json()
      setDatabases(data)
      toast({
        title: "Refreshed",
        description: "Schema list has been updated",
      })
    } catch (error) {
      console.error("Failed to refresh databases:", error)
      toast({
        title: "Error",
        description: "Failed to refresh schemas. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const filteredDatabases = databases
    .filter((db) => {
      const matchesSearch = db.schema_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || db.connection_status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.schema_name.localeCompare(b.schema_name)
      } else if (sortBy === "size") {
        return Number.parseFloat(b.size_bytes) - Number.parseFloat(a.size_bytes)
      } else if (sortBy === "tables") {
        return b.num_tables - a.num_tables
      } else {
        return 0
      }
    })

  // Calculate statistics
  const totalSchemas = databases.length
  const totalTables = databases.reduce((sum, db) => sum + db.num_tables, 0)
  const totalSize = databases.reduce((sum, db) => sum + Number.parseFloat(db.size_bytes), 0)
  const connectedSchemas = databases.filter((db) => db.connection_status === "Connected").length

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <DatabaseIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Schemas</h1>
          </div>
          <p className="text-muted-foreground mt-1">Manage your PostgreSQL schemas and databases</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={refreshDatabases} disabled={isRefreshing} className="relative">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Schema
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Schemas</p>
              <DatabaseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">{totalSchemas}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Connected</p>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
              >
                {connectedSchemas}/{totalSchemas}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${totalSchemas ? (connectedSchemas / totalSchemas) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Tables</p>
              <Grid className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">{totalTables}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Size</p>
              <Badge variant="outline">{formatSize(totalSize)}</Badge>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold">{formatSize(totalSize)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="tables">Tables</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Database List */}
      <DatabaseList
        databases={filteredDatabases}
        isLoading={isLoading}
        viewMode={viewMode}
        onRefresh={fetchDatabases}
      />

      {/* Create Dialog */}
      <CreateDatabaseDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={fetchDatabases} />
    </motion.div>
  )
}





// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { DatabaseList } from "@/components/database-list"
// import { CreateDatabaseDialog } from "@/components/create-database-dialog"
// import { Plus, Search } from "lucide-react"
// import { Schema } from "@/lib/generated/prisma"

// export default function SchemaPage() {
//   const [databases, setDatabases] = useState<Schema[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     fetchDatabases()
//   }, [])

//   const fetchDatabases = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch("/api/schemas")
//       const data = await response.json()
//       setDatabases(data)
//     } catch (error) {
//       console.error("Failed to fetch databases:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredDatabases = databases.filter((db) => db.schema_name.toLowerCase().includes(searchTerm.toLowerCase()))

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-6"
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Schema</h1>
//           <p className="text-muted-foreground">Manage your PostgreSQL schemas</p>
//         </div>
//         <Button onClick={() => setIsCreateDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Create Schema
//         </Button>
//       </div>

//       <div className="flex items-center space-x-2">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search schemas..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8"
//           />
//         </div>
//       </div>

//       <DatabaseList databases={filteredDatabases} isLoading={isLoading} onRefresh={fetchDatabases} />

//       <CreateDatabaseDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={fetchDatabases} />
//     </motion.div>
//   )
// }
