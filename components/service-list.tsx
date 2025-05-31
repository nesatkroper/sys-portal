"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Settings,
  Trash2,
  Key,
  Globe,
  User,
  Mail,
  Phone,
  Calendar,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Service } from "@/lib/generated/prisma"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface ServiceListProps {
  services: Service[]
  isLoading: boolean
  viewMode: "grid" | "list"
  onRefresh: () => void
}

export function ServiceList({ services, isLoading, viewMode, onRefresh }: ServiceListProps) {
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})

  const toggleApiKeyVisibility = (serviceId: string) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }))
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Service deleted",
          description: "Service has been successfully deleted",
        })
        onRefresh()
      }
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Could not delete the service",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "destructive"
      case "maintenance":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Globe className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No services found</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first service</p>
      </Card>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}
    >
      {services.map((service) => (
        <motion.div key={service.serviceId} variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">{service.serviceName}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs uppercase">
                    {service.schema}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {service.serviceType}
                  </Badge>
                  <Badge variant={getStatusColor(service.status)} className="text-xs">
                    {service.status}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Service
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(service.apiKey || "", "API Key")}>
                    <Key className="mr-2 h-4 w-4" />
                    Copy API Key
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => deleteService(service.serviceId)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              {service.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
              )}

              {/* Owner Information */}
              {(service.ownerName || service.ownerEmail) && (
                <div className="space-y-1">
                  {service.ownerName && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{service.ownerName}</span>
                    </div>
                  )}
                  {service.ownerEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{service.ownerEmail}</span>
                    </div>
                  )}
                  {service.ownerPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{service.ownerPhone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* API Information */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">API Key:</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {showApiKeys[service.serviceId] ? service.apiKey : `${service.apiKey?.substring(0, 8)}...`}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleApiKeyVisibility(service.serviceId)}
                    >
                      {showApiKeys[service.serviceId] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(service.apiKey || "", "API Key")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Version:</span>
                  <Badge variant="outline" className="text-xs">
                    {service.apiVersion}
                  </Badge>
                </div>


                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-mono text-xs truncate max-w-[150px]">{service.apiUrl || 'N/A'}</span>
                </div>


                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(service.createdAt.toString())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
