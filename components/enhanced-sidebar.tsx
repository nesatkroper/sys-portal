"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Activity,
  Code,
  Database,
  Download,
  FileText,
  HardDrive,
  LayoutDashboard,
  Monitor,
  Settings,
  Shield,
  Table,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Router,
} from "lucide-react"

const navigationItems = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Main dashboard overview" },
      { name: "Databases", href: "/dashboard/databases", icon: Database, description: "Manage database connections" },
      { name: "Services", href: "/dashboard/service", icon: Router, description: "Host system overview" },
    ],
  },
  {
    title: "Data Management",
    items: [
      {
        name: "Schema Browser",
        href: "/dashboard/schema",
        icon: Table,
        description: "Browse database schemas",
        badge: "New",
      },
      { name: "SQL Editor", href: "/dashboard/sql-editor", icon: Code, description: "Execute SQL queries" },
      {
        name: "Export Center",
        href: "/dashboard/export",
        icon: Download,
        description: "Export data in multiple formats",
        badge: "New",
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        name: "Performance",
        href: "/dashboard/performance",
        icon: Activity,
        description: "Real-time performance metrics",
        badge: "New",
      },
      { name: "System Monitor", href: "/dashboard/system", icon: Monitor, description: "System resource monitoring" },
      { name: "Reports", href: "/dashboard/reports", icon: FileText, description: "Generate comprehensive reports" },
    ],
  },
  {
    title: "Administration",
    items: [
      { name: "Users & Roles", href: "/dashboard/users", icon: Users, description: "Manage users and permissions" },
      {
        name: "Backup & Restore",
        href: "/dashboard/backup",
        icon: HardDrive,
        description: "Database backup management",
      },
      { name: "Security", href: "/dashboard/security", icon: Shield, description: "Security settings and audit" },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Application configuration" },
    ],
  },
]

export function EnhancedSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

  const handleSignOut = () => {
    localStorage.removeItem("user")
    router.push("/auth/signin")
  }

  return (
    <TooltipProvider>
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-card border-r border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                >
                  <Database className="w-4 h-4 text-white" />
                </motion.div>
                <span className="font-semibold text-foreground">PostgreSQL Admin</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto">
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                  >
                    {section.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  const linkContent = (
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />

                        <AnimatePresence>
                          {!sidebarCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex items-center justify-between flex-1"
                            >
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 bg-primary rounded-lg -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="flex flex-col gap-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return <div key={item.name}>{linkContent}</div>
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
