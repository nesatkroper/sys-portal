"use client"

import { Loader2, Database, Server, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageLoadingProps {
  message?: string
  className?: string
  variant?: "default" | "database" | "server" | "activity"
}

export function PageLoading({ message = "Loading...", className, variant = "default" }: PageLoadingProps) {
  const icons = {
    default: Loader2,
    database: Database,
    server: Server,
    activity: Activity,
  }

  const Icon = icons[variant]

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-muted rounded-full animate-pulse" />

        {/* Inner spinning icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary animate-spin" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
      </div>
    </div>
  )
}
