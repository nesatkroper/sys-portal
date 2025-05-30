"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, HardDrive } from "lucide-react"

interface CreateBackupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateBackupDialog({ open, onOpenChange, onSuccess }: CreateBackupDialogProps) {
  const [formData, setFormData] = useState({
    database: "",
    type: "full",
    compression: true,
    location: "/backups/",
    filename: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const databases = [
    "ecommerce_prod",
    "analytics_warehouse",
    "user_sessions",
    "logs_archive",
    "inventory_mgmt",
    "customer_support",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate backup creation
    setTimeout(() => {
      onSuccess()
      onOpenChange(false)
      setFormData({
        database: "",
        type: "full",
        compression: true,
        location: "/backups/",
        filename: "",
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Create Database Backup</span>
          </DialogTitle>
          <DialogDescription>Create a new backup of your PostgreSQL database.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Select
                value={formData.database}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, database: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db} value={db}>
                      {db}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Backup Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Backup</SelectItem>
                  <SelectItem value="incremental">Incremental Backup</SelectItem>
                  <SelectItem value="differential">Differential Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filename">Filename (optional)</Label>
              <Input
                id="filename"
                value={formData.filename}
                onChange={(e) => setFormData((prev) => ({ ...prev, filename: e.target.value }))}
                placeholder="Auto-generated if empty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Backup Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="/backups/"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="compression"
                checked={formData.compression}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, compression: checked as boolean }))}
              />
              <Label htmlFor="compression">Enable compression (gzip)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.database}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                "Create Backup"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
