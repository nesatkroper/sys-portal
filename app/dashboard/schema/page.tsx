"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Database,
  Table,
  Key,
  Link,
  Download,
  ChevronRight,
  ChevronDown,
  Columns,
  KeyIcon as ForeignKey,
  Eye,
  Copy,
} from "lucide-react"
import { useDatabaseStore } from "@/lib/store"

interface TableColumn {
  name: string
  type: string
  nullable: boolean
  default?: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  references?: string
}

interface TableIndex {
  name: string
  columns: string[]
  unique: boolean
  type: string
}

interface TableConstraint {
  name: string
  type: "PRIMARY KEY" | "FOREIGN KEY" | "UNIQUE" | "CHECK"
  columns: string[]
  references?: string
}

interface DatabaseTable {
  name: string
  schema: string
  rows: number
  size: string
  columns: TableColumn[]
  indexes: TableIndex[]
  constraints: TableConstraint[]
}

const mockTables: DatabaseTable[] = [
  {
    name: "users",
    schema: "public",
    rows: 15420,
    size: "2.3 MB",
    columns: [
      { name: "id", type: "SERIAL", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "email", type: "VARCHAR(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "name", type: "VARCHAR(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      {
        name: "created_at",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        isPrimaryKey: false,
        isForeignKey: false,
      },
      {
        name: "role_id",
        type: "INTEGER",
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: true,
        references: "roles(id)",
      },
    ],
    indexes: [
      { name: "users_pkey", columns: ["id"], unique: true, type: "btree" },
      { name: "users_email_idx", columns: ["email"], unique: true, type: "btree" },
    ],
    constraints: [
      { name: "users_pkey", type: "PRIMARY KEY", columns: ["id"] },
      { name: "users_email_unique", type: "UNIQUE", columns: ["email"] },
      { name: "users_role_fkey", type: "FOREIGN KEY", columns: ["role_id"], references: "roles(id)" },
    ],
  },
  {
    name: "orders",
    schema: "public",
    rows: 45230,
    size: "8.7 MB",
    columns: [
      { name: "id", type: "SERIAL", nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: "user_id",
        type: "INTEGER",
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true,
        references: "users(id)",
      },
      { name: "total", type: "DECIMAL(10,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      {
        name: "status",
        type: "VARCHAR(50)",
        nullable: false,
        default: "'pending'",
        isPrimaryKey: false,
        isForeignKey: false,
      },
      {
        name: "created_at",
        type: "TIMESTAMP",
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        isPrimaryKey: false,
        isForeignKey: false,
      },
    ],
    indexes: [
      { name: "orders_pkey", columns: ["id"], unique: true, type: "btree" },
      { name: "orders_user_id_idx", columns: ["user_id"], unique: false, type: "btree" },
      { name: "orders_status_idx", columns: ["status"], unique: false, type: "btree" },
    ],
    constraints: [
      { name: "orders_pkey", type: "PRIMARY KEY", columns: ["id"] },
      { name: "orders_user_fkey", type: "FOREIGN KEY", columns: ["user_id"], references: "users(id)" },
    ],
  },
  {
    name: "products",
    schema: "public",
    rows: 2340,
    size: "1.2 MB",
    columns: [
      { name: "id", type: "SERIAL", nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: "name", type: "VARCHAR(255)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: "price", type: "DECIMAL(10,2)", nullable: false, isPrimaryKey: false, isForeignKey: false },
      {
        name: "category_id",
        type: "INTEGER",
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: true,
        references: "categories(id)",
      },
      { name: "stock", type: "INTEGER", nullable: false, default: "0", isPrimaryKey: false, isForeignKey: false },
    ],
    indexes: [
      { name: "products_pkey", columns: ["id"], unique: true, type: "btree" },
      { name: "products_name_idx", columns: ["name"], unique: false, type: "btree" },
    ],
    constraints: [
      { name: "products_pkey", type: "PRIMARY KEY", columns: ["id"] },
      { name: "products_category_fkey", type: "FOREIGN KEY", columns: ["category_id"], references: "categories(id)" },
    ],
  },
]

export default function SchemaPage() {
  const { databases, selectedDatabase } = useDatabaseStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null)

  const currentDatabase = databases.find((db) => db.id === selectedDatabase) || databases[0]

  const filteredTables = mockTables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.columns.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleTableExpansion = (tableName: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName)
    } else {
      newExpanded.add(tableName)
    }
    setExpandedTables(newExpanded)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schema Browser</h2>
          <p className="text-muted-foreground">Explore database structure for {currentDatabase?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Schema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Tables ({filteredTables.length})
              </CardTitle>
              <CardDescription>Browse database tables and their structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables and columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredTables.map((table) => (
                      <div key={table.name} className="border rounded-lg">
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            toggleTableExpansion(table.name)
                            setSelectedTable(table)
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            {expandedTables.has(table.name) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Table className="h-4 w-4" />
                            <span className="font-medium">{table.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {table.rows.toLocaleString()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {table.size}
                            </Badge>
                          </div>
                        </div>

                        {expandedTables.has(table.name) && (
                          <div className="border-t bg-muted/20 p-3">
                            <div className="space-y-1">
                              {table.columns.slice(0, 5).map((column) => (
                                <div key={column.name} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Columns className="h-3 w-3 text-muted-foreground" />
                                    <span>{column.name}</span>
                                    {column.isPrimaryKey && <Key className="h-3 w-3 text-yellow-500" />}
                                    {column.isForeignKey && <Link className="h-3 w-3 text-blue-500" />}
                                  </div>
                                  <span className="text-muted-foreground text-xs">{column.type}</span>
                                </div>
                              ))}
                              {table.columns.length > 5 && (
                                <div className="text-xs text-muted-foreground">
                                  +{table.columns.length - 5} more columns
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Details */}
        <div className="lg:col-span-2">
          {selectedTable ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Table className="mr-2 h-5 w-5" />
                      {selectedTable.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedTable.rows.toLocaleString()} rows • {selectedTable.size} • Schema: {selectedTable.schema}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Data
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedTable.name)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Name
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="columns" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="columns">Columns</TabsTrigger>
                    <TabsTrigger value="indexes">Indexes</TabsTrigger>
                    <TabsTrigger value="constraints">Constraints</TabsTrigger>
                  </TabsList>

                  <TabsContent value="columns" className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 font-medium text-sm">
                        <div>Column</div>
                        <div>Type</div>
                        <div>Nullable</div>
                        <div>Default</div>
                        <div>Keys</div>
                        <div>References</div>
                      </div>
                      <Separator />
                      <div className="divide-y">
                        {selectedTable.columns.map((column) => (
                          <div key={column.name} className="grid grid-cols-6 gap-4 p-3 text-sm">
                            <div className="font-medium">{column.name}</div>
                            <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{column.type}</div>
                            <div>
                              <Badge variant={column.nullable ? "secondary" : "destructive"} className="text-xs">
                                {column.nullable ? "NULL" : "NOT NULL"}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground">{column.default || "-"}</div>
                            <div className="flex space-x-1">
                              {column.isPrimaryKey && (
                                <Badge variant="default" className="text-xs">
                                  <Key className="mr-1 h-3 w-3" />
                                  PK
                                </Badge>
                              )}
                              {column.isForeignKey && (
                                <Badge variant="outline" className="text-xs">
                                  <ForeignKey className="mr-1 h-3 w-3" />
                                  FK
                                </Badge>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs">{column.references || "-"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="indexes" className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 font-medium text-sm">
                        <div>Index Name</div>
                        <div>Columns</div>
                        <div>Type</div>
                        <div>Unique</div>
                      </div>
                      <Separator />
                      <div className="divide-y">
                        {selectedTable.indexes.map((index) => (
                          <div key={index.name} className="grid grid-cols-4 gap-4 p-3 text-sm">
                            <div className="font-medium">{index.name}</div>
                            <div className="flex flex-wrap gap-1">
                              {index.columns.map((col) => (
                                <Badge key={col} variant="outline" className="text-xs">
                                  {col}
                                </Badge>
                              ))}
                            </div>
                            <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{index.type}</div>
                            <div>
                              <Badge variant={index.unique ? "default" : "secondary"} className="text-xs">
                                {index.unique ? "UNIQUE" : "NON-UNIQUE"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="constraints" className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 font-medium text-sm">
                        <div>Constraint Name</div>
                        <div>Type</div>
                        <div>Columns</div>
                        <div>References</div>
                      </div>
                      <Separator />
                      <div className="divide-y">
                        {selectedTable.constraints.map((constraint) => (
                          <div key={constraint.name} className="grid grid-cols-4 gap-4 p-3 text-sm">
                            <div className="font-medium">{constraint.name}</div>
                            <div>
                              <Badge
                                variant={constraint.type === "PRIMARY KEY" ? "default" : "outline"}
                                className="text-xs"
                              >
                                {constraint.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {constraint.columns.map((col) => (
                                <Badge key={col} variant="outline" className="text-xs">
                                  {col}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-muted-foreground text-xs">{constraint.references || "-"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center space-y-2">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Select a Table</h3>
                  <p className="text-muted-foreground">Choose a table from the list to view its detailed structure</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
