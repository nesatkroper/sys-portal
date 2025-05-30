"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { HelpDialog } from "@/components/help-dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, User } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger />

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(true)}>
            <HelpCircle className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
            <User className="h-4 w-4" />
            <span className="text-sm">{user?.name || "Admin"}</span>
          </div>
        </div>
      </div>

      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </header>
  )
}
