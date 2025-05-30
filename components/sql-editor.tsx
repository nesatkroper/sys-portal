"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Play, Save, Loader2, FileText } from "lucide-react"

interface SqlEditorProps {
  onExecute: (query: string, database: string) => void
  isExecuting: boolean
}

const sampleQueries = [
  {
    name: "List all users",
    query: "SELECT * FROM users LIMIT 10;",
  },
  {
    name: "Show products",
    query: "SELECT * FROM products WHERE price > 50 ORDER BY price DESC LIMIT 10;",
  },
  {
    name: "Show tables",
    query: "SHOW TABLES;",
  },
  {
    name: "User count by status",
    query: "SELECT is_active, COUNT(*) as user_count FROM users GROUP BY is_active;",
  },
  {
    name: "Recent orders",
    query:
      "SELECT o.id, u.username, o.total_amount, o.created_at FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10;",
  },
]

const databases = [
  { id: "ecommerce_prod", name: "ecommerce_prod", status: "online" },
  { id: "analytics_warehouse", name: "analytics_warehouse", status: "online" },
  { id: "user_sessions", name: "user_sessions", status: "online" },
  { id: "logs_archive", name: "logs_archive", status: "maintenance" },
  { id: "inventory_mgmt", name: "inventory_mgmt", status: "online" },
  { id: "customer_support", name: "customer_support", status: "online" },
]

export function SqlEditor({ onExecute, isExecuting }: SqlEditorProps) {
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;")
  const [selectedDatabase, setSelectedDatabase] = useState("ecommerce_prod")

  const handleExecute = () => {
    if (query.trim() && selectedDatabase) {
      onExecute(query, selectedDatabase)
    }
  }

  const loadSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SQL Query Editor</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db.id} value={db.id} disabled={db.status === "maintenance"}>
                      <div className="flex items-center space-x-2">
                        <span>{db.name}</span>
                        <Badge variant={db.status === "online" ? "default" : "secondary"} className="text-xs">
                          {db.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleExecute} disabled={!query.trim() || !selectedDatabase || isExecuting}>
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Execute
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Sample Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {sampleQueries.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-3"
                onClick={() => loadSampleQuery(sample.query)}
              >
                <div>
                  <div className="font-medium text-sm">{sample.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{sample.query.substring(0, 40)}...</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
