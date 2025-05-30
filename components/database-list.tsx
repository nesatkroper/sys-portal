"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, Trash2, Settings, Database, HardDrive } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DatabaseType {
  id: string
  name: string
  size: string
  tables: number
  connections: number
  status: "online" | "offline" | "maintenance"
  owner: string
  createdAt: string
  lastBackup: string | null
  encoding: string
  collation: string
}

interface DatabaseListProps {
  databases: DatabaseType[]
  isLoading: boolean
  onRefresh: () => void
}

export function DatabaseList({ databases, isLoading, onRefresh }: DatabaseListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {databases.map((database) => (
        <motion.div key={database.id} variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-base">{database.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    database.status === "online"
                      ? "default"
                      : database.status === "maintenance"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {database.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HardDrive className="mr-2 h-4 w-4" />
                      Backup
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{database.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tables:</span>
                  <span className="font-medium">{database.tables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections:</span>
                  <span className="font-medium">{database.connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{database.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{database.createdAt}</span>
                </div>
                {database.lastBackup && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Backup:</span>
                    <span className="font-medium text-xs">{database.lastBackup}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
