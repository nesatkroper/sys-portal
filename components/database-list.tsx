


"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Trash2,
  Settings,
  Database,
  HardDrive,
  Table,
  Columns,
  Users,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Copy,
  ExternalLink,
  Plus,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Schema } from "@/lib/generated/prisma"
import { toast } from "@/hooks/use-toast"
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

interface DatabaseListProps {
  databases: Schema[]
  isLoading: boolean
  viewMode: "grid" | "list"
  onRefresh: () => void
}

export function DatabaseList({ databases, isLoading, viewMode, onRefresh }: DatabaseListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState<Schema | null>(null)
  const [newName, setNewName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDelete = async () => {
    if (!selectedDatabase) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/schemas/${selectedDatabase.schema_name}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Schema deleted",
          description: `${selectedDatabase.schema_name} has been deleted successfully`,
        })
        onRefresh()
        setIsDeleteDialogOpen(false)
      } else {
        const error = await response.json()
        toast({
          title: "Failed to delete schema",
          description: error.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schema. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRename = async () => {
    if (!selectedDatabase || !newName) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/schemas/${selectedDatabase.schema_name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName }),
      })

      if (response.ok) {
        toast({
          title: "Schema renamed",
          description: `Schema renamed from ${selectedDatabase.schema_name} to ${newName}`,
        })
        onRefresh()
        setIsRenameDialogOpen(false)
        setNewName("")
      } else {
        const error = await response.json()
        toast({
          title: "Failed to rename schema",
          description: error.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename schema. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatSize = (bytes: string) => {
    const size = Number.parseFloat(bytes)
    if (size === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(size) / Math.log(k))
    return Number.parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "maintenance":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      default:
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-border/40">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (databases.length === 0) {
    return (
      <Card className="border-dashed border-2 p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">No schemas found</h3>
            <p className="text-muted-foreground max-w-sm">
              Get started by creating your first schema or try a different search term.
            </p>
          </div>
          <Button onClick={() => document.dispatchEvent(new CustomEvent("create-schema"))}>
            <Plus className="mr-2 h-4 w-4" />
            Create Schema
          </Button>
        </div>
      </Card>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}
      >
        {databases.map((database) => (
          <motion.div key={database.unique_id} variants={itemVariants} layout>
            {viewMode === "grid" ? (
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4 hover:border-l-blue-500">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded">
                        <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-base font-medium">{database.schema_name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(database.connection_status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(database.connection_status)}
                          {database.connection_status}
                        </span>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDatabase(database)
                              setNewName(database.schema_name)
                              setIsRenameDialogOpen(true)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HardDrive className="mr-2 h-4 w-4" />
                            Backup
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Name
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => {
                              setSelectedDatabase(database)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span>Size</span>
                      </div>
                      <span className="font-medium">{formatSize(database.size_bytes)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Table className="h-3.5 w-3.5" />
                        <span>Tables</span>
                      </div>
                      <span className="font-medium">
                        {database.num_tables === 0
                          ? "No tables"
                          : `${database.num_tables} ${database.num_tables === 1 ? "Table" : "Tables"}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Columns className="h-3.5 w-3.5" />
                        <span>Columns</span>
                      </div>
                      <span className="font-medium">
                        {database.num_columns === 0
                          ? "No columns"
                          : `${database.num_columns} ${database.num_columns === 1 ? "Column" : "Columns"}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>Connections</span>
                      </div>
                      <span className="font-medium">{database.num_connections}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>Owner</span>
                      </div>
                      <span className="font-medium capitalize">{database.owner}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="w-full">
                    <span>View Details</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="flex items-center p-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded mr-4">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{database.schema_name}</h3>
                      <Badge variant="outline" className={`text-xs ml-2 ${getStatusColor(database.connection_status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(database.connection_status)}
                          {database.connection_status}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatSize(database.size_bytes)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Table className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{database.num_tables} Tables</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="capitalize">{database.owner}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center ml-4">
                    <Button variant="outline" size="sm" className="mr-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDatabase(database)
                            setNewName(database.schema_name)
                            setIsRenameDialogOpen(true)
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HardDrive className="mr-2 h-4 w-4" />
                          Backup
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => {
                            setSelectedDatabase(database)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schema</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the schema "{selectedDatabase?.schema_name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Schema</DialogTitle>
            <DialogDescription>Enter a new name for the schema "{selectedDatabase?.schema_name}".</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                New Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                placeholder="new_schema_name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={isProcessing || !newName}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}



// "use client"

// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal, Users, Trash2, Settings, Database, HardDrive } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Schema } from "@/lib/generated/prisma"



// interface DatabaseListProps {
//   databases: Schema[]
//   isLoading: boolean
//   onRefresh: () => void
// }

// export function DatabaseList({ databases, isLoading, onRefresh }: DatabaseListProps) {
//   if (isLoading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <Card key={i}>
//             <CardHeader>
//               <Skeleton className="h-4 w-3/4" />
//               <Skeleton className="h-3 w-1/2" />
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <Skeleton className="h-3 w-full" />
//                 <Skeleton className="h-3 w-2/3" />
//                 <Skeleton className="h-3 w-1/2" />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }



//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   }

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
//     >
//       {databases.map((database) => (
//         <motion.div key={database.unique_id} variants={itemVariants}>
//           <Card className="hover:shadow-md transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <div className="flex items-center space-x-2">
//                 <Database className="h-4 w-4 text-blue-600" />
//                 <CardTitle className="text-base">{database.schema_name.toUpperCase()}</CardTitle>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Badge
//                   variant={
//                     database.connection_status === "Connected"
//                       ? "default"
//                       : database.connection_status === "maintenance"
//                         ? "secondary"
//                         : "destructive"
//                   }
//                   className="text-xs"
//                 >
//                   {database.connection_status}
//                 </Badge>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon" className="h-8 w-8">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Rename
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <HardDrive className="mr-2 h-4 w-4" />
//                       Backup
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600">
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Size:</span>
//                   <span className="font-medium">
//                     {(() => {
//                       const size = parseFloat(database.size_bytes);
//                       if (size == 0) return "0 Byte";
//                       else if (size < 1024)
//                         return `${size.toFixed(2)} Bytes`;
//                       else if (size < 1024 * 1024)
//                         return `${(size / 1024).toFixed(2)} Kilobytes`;
//                       else if (size < 1024 * 1024 * 1024)
//                         return `${(size / (1024 * 1024)).toFixed(2)} Megabytes`;
//                       else
//                         return `${(size / (1024 * 1024 * 1024)).toFixed(2)} Gigabytes`;

//                     })()}
//                   </span>

//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Tables:</span>
//                   <span className="font-medium">{(() => {
//                     const table = database.num_tables;
//                     if (table == 0) return `0 Table`;
//                     else return `${table} Tables`;
//                   })()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Colums:</span>
//                   <span className="font-medium">{(() => {
//                     const column = database.num_columns;
//                     if (column == 0) return `0 Column`;
//                     else return `${column} Columns`;
//                   })()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Connections:</span>
//                   <span className="font-medium">{database.num_connections} Connection</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Owner:</span>
//                   <span className="font-medium capitalize">{database.owner}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ))}
//     </motion.div>
//   )
// }
