"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Globe, User, Link } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Schema, Service } from "@/lib/generated/prisma"

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}




export function CreateServiceDialog({ open, onOpenChange, onSuccess }: CreateServiceDialogProps) {
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceType: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    description: "",
    apiUrl: "",
    apiVersion: "v1",
    schema: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [schemas, setSchemas] = useState<Schema[]>([])

  useEffect(() => {
    fetchSchemas()
  }, [])

  const fetchSchemas = async () => {
    try {
      const response = await fetch("/api/schemas")
      const data = await response.json()
      setSchemas(data)
    } catch (error) {
      console.error("Failed to fetch schema:", error)
    }
  }

  const serviceTypes = [
    "API Gateway",
    "Microservice",
    "Database Service",
    "Authentication",
    "Payment Gateway",
    "Notification Service",
    "File Storage",
    "Analytics",
    "Monitoring",
    "Other",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      serviceName: "",
      serviceType: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      description: "",
      apiUrl: "",
      apiVersion: "v1",
      schema: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Service created successfully!",
          description: "Your new service has been created with API credentials.",
        })
        onSuccess()
        onOpenChange(false)
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Failed to create service",
          description: error.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to create service",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Create New Service
          </DialogTitle>
          <DialogDescription>
            Create a new API service with automatic credential generation and management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={formData.serviceName}
                  onChange={(e) => handleInputChange("serviceName", e.target.value)}
                  placeholder="My API Service"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange("serviceType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of your service..."
                rows={3}
              />
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Owner Information
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Select value={formData.schema} onValueChange={(value) => handleInputChange("schema", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {schemas.map((schema) => (
                        <SelectItem key={schema.schema_name} value={schema.schema_name} className="capitalize">
                          {schema.schema_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Phone</Label>
                  <Input
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Link className="h-4 w-4" />
              API Configuration
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input
                  id="apiUrl"
                  value={formData.apiUrl}
                  onChange={(e) => handleInputChange("apiUrl", e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiVersion">API Version</Label>
                <Select value={formData.apiVersion} onValueChange={(value) => handleInputChange("apiVersion", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">v1</SelectItem>
                    <SelectItem value="v2">v2</SelectItem>
                    <SelectItem value="v3">v3</SelectItem>
                    <SelectItem value="beta">beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
