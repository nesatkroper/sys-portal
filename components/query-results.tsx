"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, BarChart3 } from "lucide-react"

interface QueryResultsProps {
  results: {
    columns: string[]
    rows: any[][]
    rowCount: number
    executionTime: string
    queryType?: string
  }
}

export function QueryResults({ results }: QueryResultsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Query Results</span>
            </CardTitle>
            <CardDescription>{results.rowCount} rows returned</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{results.executionTime}</span>
            </Badge>
            {results.queryType && <Badge variant="secondary">{results.queryType}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {results.columns.map((column, index) => (
                  <TableHead key={index} className="font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="font-mono text-sm">
                      {cell === null ? (
                        <span className="text-muted-foreground italic">NULL</span>
                      ) : typeof cell === "boolean" ? (
                        <Badge variant={cell ? "default" : "secondary"}>{cell.toString()}</Badge>
                      ) : (
                        cell.toString()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
