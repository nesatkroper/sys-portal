"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, AlertTriangle } from "lucide-react"

interface RestoreBackupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  backups: any[]
  onSuccess: () => void
}

export function RestoreBackupDialog({ open, onOpenChange, backups, onSuccess }: RestoreBackupDialogProps) {
  const [formData, setFormData] = useState({
    backup: "",
    targetDatabase: "",
    dropExisting: false,
    createDatabase: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate restore process
    setTimeout(() => {
      onSuccess()
      onOpenChange(false)
      setFormData({
        backup: "",
        targetDatabase: "",
        dropExisting: false,
        createDatabase: false,
      })
      setIsLoading(false)
    }, 3000)
  }

  const selectedBackup = backups.find((b) => b.id.toString() === formData.backup)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Restore Database Backup</span>
          </DialogTitle>
          <DialogDescription>Restore a database from an existing backup file.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: Restoring a backup will overwrite the target database. This action cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="backup">Select Backup</Label>
              <Select
                value={formData.backup}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, backup: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose backup file" />
                </SelectTrigger>
                <SelectContent>
                  {backups.map((backup) => (
                    <SelectItem key={backup.id} value={backup.id.toString()}>
                      <div className="flex flex-col">
                        <span>{backup.filename}</span>
                        <span className="text-xs text-muted-foreground">
                          {backup.database} - {backup.size} - {backup.createdAt}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBackup && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Backup Details</h4>
                <div className="text-sm space-y-1">
                  <div>Database: {selectedBackup.database}</div>
                  <div>Size: {selectedBackup.size}</div>
                  <div>Type: {selectedBackup.type}</div>
                  <div>Created: {selectedBackup.createdAt}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="targetDatabase">Target Database</Label>
              <Select
                value={formData.targetDatabase}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, targetDatabase: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create New Database</SelectItem>
                  <SelectItem value="ecommerce_prod">ecommerce_prod</SelectItem>
                  <SelectItem value="analytics_warehouse">analytics_warehouse</SelectItem>
                  <SelectItem value="user_sessions">user_sessions</SelectItem>
                  <SelectItem value="inventory_mgmt">inventory_mgmt</SelectItem>
                  <SelectItem value="customer_support">customer_support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dropExisting"
                  checked={formData.dropExisting}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, dropExisting: checked as boolean }))}
                />
                <Label htmlFor="dropExisting">Drop existing database before restore</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createDatabase"
                  checked={formData.createDatabase}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, createDatabase: checked as boolean }))
                  }
                />
                <Label htmlFor="createDatabase">Create database if it doesn't exist</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.backup || !formData.targetDatabase}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Restore Backup"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
