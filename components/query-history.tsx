"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Clock, Database, Play } from "lucide-react"

export function QueryHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Mock query history
    setHistory([
      {
        id: 1,
        query: "SELECT * FROM users WHERE is_active = true LIMIT 10;",
        database: "ecommerce_prod",
        executionTime: "23ms",
        timestamp: "2 minutes ago",
        status: "success",
        rowCount: 8,
      },
      {
        id: 2,
        query: "SHOW TABLES;",
        database: "analytics_warehouse",
        executionTime: "12ms",
        timestamp: "5 minutes ago",
        status: "success",
        rowCount: 7,
      },
      {
        id: 3,
        query: "SELECT COUNT(*) FROM orders WHERE created_at > '2024-01-01';",
        database: "ecommerce_prod",
        executionTime: "156ms",
        timestamp: "8 minutes ago",
        status: "success",
        rowCount: 1,
      },
      {
        id: 4,
        query: "SELECT * FROM non_existent_table;",
        database: "user_sessions",
        executionTime: "5ms",
        timestamp: "12 minutes ago",
        status: "error",
        rowCount: 0,
      },
      {
        id: 5,
        query: "SELECT p.name, c.name as category FROM products p JOIN categories c ON p.category_id = c.id;",
        database: "ecommerce_prod",
        executionTime: "89ms",
        timestamp: "15 minutes ago",
        status: "success",
        rowCount: 45,
      },
    ])
  }, [])

  const rerunQuery = (query: string) => {
    // In a real app, this would execute the query
    console.log("Rerunning query:", query)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Query History</span>
        </CardTitle>
        <CardDescription>Recent SQL queries</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => rerunQuery(item.query)}>
                    <Play className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-sm font-mono bg-muted p-2 rounded text-xs mb-2">
                  {item.query.length > 60 ? `${item.query.substring(0, 60)}...` : item.query}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Database className="h-3 w-3" />
                    <span>{item.database}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{item.executionTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{item.rowCount} rows</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
