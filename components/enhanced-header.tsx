"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"
import { useDatabaseStore, useUserStore, useUIStore } from "@/lib/store"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Menu,
  Command,
  Plus,
  Download,
  FileText,
  BarChart3,
} from "lucide-react"

export function EnhancedHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const { databases, selectedDatabase, selectDatabase } = useDatabaseStore()
  const { currentUser } = useUserStore()
  const { notifications, removeNotification, toggleSidebar } = useUIStore()

  const selectedDb = databases.find((db) => db.id === selectedDatabase)
  const connectedDatabases = databases.filter((db) => db.status === "connected")
  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === "Escape") {
        setShowSearch(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-accent/50 transition-colors">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Database Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-start gap-2">
                <Database className="h-4 w-4" />
                <span className="truncate">{selectedDb ? selectedDb.name : "Select Database"}</span>
                {selectedDb && (
                  <Badge variant={selectedDb.status === "connected" ? "default" : "secondary"} className="ml-auto">
                    {selectedDb.status}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <div className="p-2">
                <h4 className="font-medium mb-2">Available Databases</h4>
                {databases.map((db) => (
                  <DropdownMenuItem
                    key={db.id}
                    onClick={() => selectDatabase(db.id)}
                    className="flex items-center justify-between p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          db.status === "connected"
                            ? "bg-green-500"
                            : db.status === "error"
                              ? "bg-red-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{db.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {db.application} • {db.environment}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {db.connections}/{db.maxConnections}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search databases, tables, queries... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="pl-10 pr-4 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Database className="mr-2 h-4 w-4" />
                New Database
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                New Query
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                {connectedDatabases.length} Active
              </span>
            </div>
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/50">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs text-white font-medium">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  </motion.div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-sm text-muted-foreground">{unreadNotifications} unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border-b hover:bg-accent/50 cursor-pointer"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {notification.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {notification.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {notification.type === "info" && <Activity className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle */}
          <EnhancedThemeToggle />

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hover:bg-accent/50">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {currentUser?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-background border rounded-lg shadow-lg p-4">
                <Input
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg border-0 focus:ring-0"
                  autoFocus
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">Recent searches</div>
                  <div className="space-y-1">
                    <div className="p-2 hover:bg-accent rounded cursor-pointer">SELECT * FROM users</div>
                    <div className="p-2 hover:bg-accent rounded cursor-pointer">Database performance</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
