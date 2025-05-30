"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react"

export function EnhancedThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Light mode",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      name: "Dark",
      value: "dark",
      icon: Moon,
      description: "Dark mode",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      name: "System",
      value: "system",
      icon: Monitor,
      description: "Follow system",
      gradient: "from-blue-500 to-purple-600",
    },
  ]

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative overflow-hidden border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <CurrentIcon className="h-4 w-4" />
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border border-border/40 shadow-lg backdrop-blur-sm bg-background/95"
      >
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Theme</span>
          </div>
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            const isSelected = theme === themeOption.value

            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className="cursor-pointer hover:bg-accent/50 transition-colors p-3 rounded-md"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-md bg-gradient-to-br ${themeOption.gradient} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{themeOption.name}</div>
                    <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
        <div className="border-t p-2">
          <div className="text-xs text-muted-foreground px-2">
            Current: {resolvedTheme === "dark" ? "Dark" : "Light"} mode
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
