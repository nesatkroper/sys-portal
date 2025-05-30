"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard, Database, Terminal, Users, Activity } from "lucide-react"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help & Documentation</DialogTitle>
          <DialogDescription>Learn how to use the PostgreSQL Admin Dashboard effectively</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
            <TabsTrigger value="sql">SQL Editor</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Welcome to PostgreSQL Admin Dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This dashboard provides comprehensive management tools for your PostgreSQL databases and system
                  monitoring.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      Database Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Create, manage, and monitor your PostgreSQL databases with real-time statistics.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Terminal className="mr-2 h-4 w-4" />
                      SQL Editor
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Execute SQL queries with syntax highlighting and result visualization.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      System Monitoring
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor system resources, connections, and performance metrics in real-time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      User Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Manage database users, roles, and permissions with granular control.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="databases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>How to manage your PostgreSQL databases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Creating a Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Create Database" button to add a new PostgreSQL database. Specify the name, owner, and
                      encoding.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Database Status</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="default">online</Badge>
                      <span className="text-sm">Database is running normally</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">maintenance</Badge>
                      <span className="text-sm">Database is under maintenance</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="destructive">offline</Badge>
                      <span className="text-sm">Database is not accessible</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Database Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the dropdown menu on each database card to manage, backup, or delete databases.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sql" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SQL Editor</CardTitle>
                <CardDescription>Execute and manage SQL queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Query Execution</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a database from the dropdown, write your SQL query, and click Execute to run it.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Sample Queries</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the sample query buttons to quickly load common SQL patterns and examples.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Query History</h4>
                    <p className="text-sm text-muted-foreground">
                      View your recent queries in the history panel and re-run them with a single click.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
                <CardDescription>Understanding system metrics and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Resource Usage</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor CPU, memory, disk, and network usage in real-time with interactive charts.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Connection Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Track active database connections and identify potential bottlenecks.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      System alerts notify you of important events, warnings, and errors that require attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Keyboard className="mr-2 h-5 w-5" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">General</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Toggle sidebar</span>
                        <Badge variant="outline">Ctrl + B</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle theme</span>
                        <Badge variant="outline">Ctrl + Shift + T</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Open help</span>
                        <Badge variant="outline">F1</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">SQL Editor</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Execute query</span>
                        <Badge variant="outline">Ctrl + Enter</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Save query</span>
                        <Badge variant="outline">Ctrl + S</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Format query</span>
                        <Badge variant="outline">Ctrl + Shift + F</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
