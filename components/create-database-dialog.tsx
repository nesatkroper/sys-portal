"use client"

import type React from "react"

import { useState } from "react"
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
import { Loader2, Database, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateDatabaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateDatabaseDialog({ open, onOpenChange, onSuccess }: CreateDatabaseDialogProps) {
  const [name, setName] = useState("")
  const [owner, setOwner] = useState("admin")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validate schema name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      setError("Schema name must start with a letter or underscore and contain only letters, numbers, and underscores")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/schemas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, owner, description }),
      })

      if (response.ok) {
        toast({
          title: "Schema created",
          description: `Schema "${name}" has been created successfully`,
        })
        onSuccess()
        onOpenChange(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create schema")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setOwner("admin")
    setDescription("")
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Create New Schema</DialogTitle>
          </div>
          <DialogDescription>Create a new PostgreSQL schema with the specified configuration.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Schema Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my_schema"
                required
              />
              <p className="text-xs text-muted-foreground">
                Must start with a letter or underscore and contain only letters, numbers, and underscores.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="postgres">postgres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for this schema..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schema"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Loader2 } from "lucide-react"

// interface CreateDatabaseDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onSuccess: () => void
// }

// export function CreateDatabaseDialog({ open, onOpenChange, onSuccess }: CreateDatabaseDialogProps) {
//   const [name, setName] = useState("")
//   const [owner, setOwner] = useState("admin")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/databases", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, owner }),
//       })

//       if (response.ok) {
//         onSuccess()
//         onOpenChange(false)
//         setName("")
//         setOwner("")
//       }
//     } catch (error) {
//       console.error("Failed to create database:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Schema</DialogTitle>
//           <DialogDescription>Create a new PostgreSQL schema with the specified configuration.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="col-span-3"
//                 placeholder="my_database"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="owner" className="text-right">
//                 Owner
//               </Label>
//               <Input
//                 id="owner"
//                 value={owner}
//                 onChange={(e) => setOwner(e.target.value)}
//                 className="col-span-3"
//                 placeholder="admin"
//                 readOnly
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Schema"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
