"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SqlEditor } from "@/components/sql-editor"
import { QueryResults } from "@/components/query-results"
import { QueryHistory } from "@/components/query-history"

export default function SqlEditorPage() {
  const [queryResults, setQueryResults] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleQueryExecute = async (query: string, database: string) => {
    setIsExecuting(true)
    try {
      const response = await fetch("/api/sql/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, database }),
      })
      const results = await response.json()
      setQueryResults(results)
    } catch (error) {
      console.error("Query execution failed:", error)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SQL Editor</h1>
        <p className="text-muted-foreground">Execute SQL queries against your databases</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <SqlEditor onExecute={handleQueryExecute} isExecuting={isExecuting} />

          {queryResults && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <QueryResults results={queryResults} />
            </motion.div>
          )}
        </div>

        <div>
          <QueryHistory />
        </div>
      </div>
    </motion.div>
  )
}
