"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Check } from "lucide-react"

interface RolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: any
}

export function RolePermissionsDialog({ open, onOpenChange, role }: RolePermissionsDialogProps) {
  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${role.color}`} />
            <span>{role.name} Role</span>
          </DialogTitle>
          <DialogDescription>{role.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Permissions</span>
              </CardTitle>
              <CardDescription>Granted permissions for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {role.permissions.map((permission: string) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <Badge variant="outline">{permission}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Role Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Users:</span>
                <span className="font-medium">{role.userCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-medium">{role.permissions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
