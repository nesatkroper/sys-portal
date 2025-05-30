"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Database, Bell, Shield, Palette, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      serverName: "PostgreSQL Production Server",
      timezone: "UTC",
      language: "en",
      autoRefresh: true,
      refreshInterval: 30,
    },
    database: {
      maxConnections: 200,
      sharedBuffers: "256MB",
      workMem: "4MB",
      maintenanceWorkMem: "64MB",
      walBuffers: "16MB",
      checkpointSegments: 32,
      logStatement: "all",
      logDuration: true,
    },
    notifications: {
      emailAlerts: true,
      slackIntegration: false,
      alertThresholds: {
        cpuUsage: 80,
        memoryUsage: 85,
        diskUsage: 90,
        connectionLimit: 90,
      },
    },
    security: {
      sslMode: "require",
      passwordEncryption: "scram-sha-256",
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      auditLogging: true,
    },
    appearance: {
      theme: "system",
      compactMode: false,
      showAnimations: true,
      chartType: "line",
    },
  })

  const handleSave = () => {
    // Save settings logic
    console.log("Saving settings:", settings)
  }

  const handleReset = () => {
    // Reset to defaults
    console.log("Resetting to defaults")
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
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Configure system preferences and database settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} className="shadow-lg">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription>Basic system configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      value={settings.general.serverName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, serverName: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, language: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={settings.general.refreshInterval}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, refreshInterval: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                    </div>
                    <Switch
                      checked={settings.general.autoRefresh}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, autoRefresh: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Database Configuration</span>
                </CardTitle>
                <CardDescription>PostgreSQL server configuration parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxConnections">Max Connections</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      value={settings.database.maxConnections}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, maxConnections: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sharedBuffers">Shared Buffers</Label>
                    <Input
                      id="sharedBuffers"
                      value={settings.database.sharedBuffers}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, sharedBuffers: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workMem">Work Memory</Label>
                    <Input
                      id="workMem"
                      value={settings.database.workMem}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, workMem: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceWorkMem">Maintenance Work Memory</Label>
                    <Input
                      id="maintenanceWorkMem"
                      value={settings.database.maintenanceWorkMem}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, maintenanceWorkMem: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logStatement">Log Statement</Label>
                    <Select
                      value={settings.database.logStatement}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, logStatement: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="ddl">DDL</SelectItem>
                        <SelectItem value="mod">Modifications</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkpointSegments">Checkpoint Segments</Label>
                    <Input
                      id="checkpointSegments"
                      type="number"
                      value={settings.database.checkpointSegments}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, checkpointSegments: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Log Duration</Label>
                      <p className="text-sm text-muted-foreground">Log the duration of each completed statement</p>
                    </div>
                    <Switch
                      checked={settings.database.logDuration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          database: { ...settings.database, logDuration: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>Configure alerts and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for system alerts</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, emailAlerts: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Slack Integration</Label>
                      <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
                    </div>
                    <Switch
                      checked={settings.notifications.slackIntegration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, slackIntegration: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Alert Thresholds</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cpuThreshold">CPU Usage (%)</Label>
                      <Input
                        id="cpuThreshold"
                        type="number"
                        value={settings.notifications.alertThresholds.cpuUsage}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              alertThresholds: {
                                ...settings.notifications.alertThresholds,
                                cpuUsage: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="memoryThreshold">Memory Usage (%)</Label>
                      <Input
                        id="memoryThreshold"
                        type="number"
                        value={settings.notifications.alertThresholds.memoryUsage}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              alertThresholds: {
                                ...settings.notifications.alertThresholds,
                                memoryUsage: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diskThreshold">Disk Usage (%)</Label>
                      <Input
                        id="diskThreshold"
                        type="number"
                        value={settings.notifications.alertThresholds.diskUsage}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              alertThresholds: {
                                ...settings.notifications.alertThresholds,
                                diskUsage: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connectionThreshold">Connection Limit (%)</Label>
                      <Input
                        id="connectionThreshold"
                        type="number"
                        value={settings.notifications.alertThresholds.connectionLimit}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              alertThresholds: {
                                ...settings.notifications.alertThresholds,
                                connectionLimit: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sslMode">SSL Mode</Label>
                    <Select
                      value={settings.security.sslMode}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sslMode: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disable">Disable</SelectItem>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="prefer">Prefer</SelectItem>
                        <SelectItem value="require">Require</SelectItem>
                        <SelectItem value="verify-ca">Verify CA</SelectItem>
                        <SelectItem value="verify-full">Verify Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordEncryption">Password Encryption</Label>
                    <Select
                      value={settings.security.passwordEncryption}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, passwordEncryption: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="scram-sha-256">SCRAM-SHA-256</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, maxLoginAttempts: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Enable comprehensive audit logging</p>
                    </div>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, auditLogging: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  <span>Appearance Settings</span>
                </CardTitle>
                <CardDescription>Customize the look and feel of the dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, theme: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chartType">Chart Type</Label>
                    <Select
                      value={settings.appearance.chartType}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, chartType: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout to show more information
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, compactMode: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
                    </div>
                    <Switch
                      checked={settings.appearance.showAnimations}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, showAnimations: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
