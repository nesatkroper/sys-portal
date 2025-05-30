"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateUserDialog } from "@/components/create-user-dialog"
import { RolePermissionsDialog } from "@/components/role-permissions-dialog"
import { Plus, Search, MoreHorizontal, Users, Shield, Activity, Settings, Trash2, Edit } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)

  useEffect(() => {
    // Mock users data
    setUsers([
      {
        id: 1,
        username: "admin",
        email: "admin@company.com",
        fullName: "System Administrator",
        role: "superuser",
        status: "active",
        lastLogin: "2024-01-30 14:22:15",
        createdAt: "2024-01-01",
        databases: ["ecommerce_prod", "analytics_warehouse"],
        permissions: ["CREATE", "DROP", "SELECT", "INSERT", "UPDATE", "DELETE"],
      },
      {
        id: 2,
        username: "analytics_user",
        email: "analytics@company.com",
        fullName: "Analytics Team",
        role: "analyst",
        status: "active",
        lastLogin: "2024-01-30 11:45:30",
        createdAt: "2024-01-15",
        databases: ["analytics_warehouse", "user_sessions"],
        permissions: ["SELECT"],
      },
      {
        id: 3,
        username: "dev_user",
        email: "dev@company.com",
        fullName: "Development Team",
        role: "developer",
        status: "active",
        lastLogin: "2024-01-30 09:30:20",
        createdAt: "2024-01-20",
        databases: ["ecommerce_prod"],
        permissions: ["SELECT", "INSERT", "UPDATE"],
      },
      {
        id: 4,
        username: "readonly_user",
        email: "readonly@company.com",
        fullName: "Read Only User",
        role: "readonly",
        status: "inactive",
        lastLogin: "2024-01-28 16:10:45",
        createdAt: "2024-01-25",
        databases: ["ecommerce_prod", "customer_support"],
        permissions: ["SELECT"],
      },
    ])

    setRoles([
      {
        id: 1,
        name: "superuser",
        description: "Full system access with all privileges",
        userCount: 1,
        permissions: ["CREATE", "DROP", "SELECT", "INSERT", "UPDATE", "DELETE", "GRANT", "REVOKE"],
        color: "bg-red-500",
      },
      {
        id: 2,
        name: "developer",
        description: "Development access with read/write privileges",
        userCount: 1,
        permissions: ["SELECT", "INSERT", "UPDATE", "CREATE"],
        color: "bg-blue-500",
      },
      {
        id: 3,
        name: "analyst",
        description: "Analytics access with read privileges",
        userCount: 1,
        permissions: ["SELECT"],
        color: "bg-green-500",
      },
      {
        id: 4,
        name: "readonly",
        description: "Read-only access to specific databases",
        userCount: 1,
        permissions: ["SELECT"],
        color: "bg-gray-500",
      },
    ])
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName)
    return role?.color || "bg-gray-500"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Users & Roles
          </h1>
          <p className="text-muted-foreground mt-2">Manage database users, roles, and permissions</p>
        </div>
        <Button onClick={() => setIsCreateUserOpen(true)} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Database Users</span>
                    </CardTitle>
                    <CardDescription>{filteredUsers.length} users found</CardDescription>
                  </div>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-0 bg-white dark:bg-gray-800 shadow-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Databases</TableHead>
                        <TableHead className="font-semibold">Last Login</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className={`${getRoleColor(user.role)} text-white font-semibold`}>
                                  {user.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                <div className="text-xs text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getRoleColor(user.role)} text-white border-0`}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.databases.slice(0, 2).map((db) => (
                                <Badge key={db} variant="outline" className="text-xs">
                                  {db}
                                </Badge>
                              ))}
                              {user.databases.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.databases.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{user.lastLogin}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  Activity Log
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedRole(role)
                  setIsRoleDialogOpen(true)
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${role.color}`} />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 4).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      <CreateUserDialog
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
        roles={roles}
        onSuccess={() => {
          // Refresh users list
        }}
      />
      <RolePermissionsDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen} role={selectedRole} />
    </motion.div>
  )
}
