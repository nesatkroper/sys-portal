"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { useUIStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { sidebarCollapsed } = useUIStore()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/signin")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <motion.main
          animate={{
            marginLeft: sidebarCollapsed ? 80 : 280,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-auto p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? window.location.pathname : ""}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}
