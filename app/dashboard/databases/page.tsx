"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatabaseList } from "@/components/database-list"
import { CreateDatabaseDialog } from "@/components/create-database-dialog"
import { Plus, Search } from "lucide-react"

export default function DatabasesPage() {
  const [databases, setDatabases] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDatabases()
  }, [])

  const fetchDatabases = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/databases")
      const data = await response.json()
      setDatabases(data)
    } catch (error) {
      console.error("Failed to fetch databases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDatabases = databases.filter((db) => db.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
          <p className="text-muted-foreground">Manage your PostgreSQL databases</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Database
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search databases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DatabaseList databases={filteredDatabases} isLoading={isLoading} onRefresh={fetchDatabases} />

      <CreateDatabaseDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={fetchDatabases} />
    </motion.div>
  )
}
