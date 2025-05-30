"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Shield, Save, RefreshCw } from "lucide-react"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    authentication: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
      },
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      lockoutDuration: 15,
      twoFactorAuth: false,
    },
    encryption: {
      sslMode: "require",
      tlsVersion: "1.2",
      encryptBackups: true,
      encryptLogs: false,
    },
    auditing: {
      enableAuditLog: true,
      logConnections: true,
      logDisconnections: true,
      logStatements: true,
      logDDL: true,
      logDML: false,
      retentionDays: 365,
    },
    firewall: {
      enableFirewall: true,
      allowedIPs: "192.168.1.0/24, 10.0.0.0/8",
      blockSuspiciousIPs: true,
      rateLimiting: true,
      maxConnectionsPerIP: 10,
    },
  })

  const handleSave = () => {
    console.log("Saving security settings:", settings)
  }

  const handleReset = () => {
    console.log("Resetting security settings to defaults")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Security Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure security policies and settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Authentication Settings */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Authentication & Access Control</span>
          </CardTitle>
          <CardDescription>Configure user authentication and access policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Password Length</Label>
              <Input
                id="minLength"
                type="number"
                value={settings.authentication.passwordPolicy.minLength}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      passwordPolicy: {
                        ...settings.authentication.passwordPolicy,
                        minLength: Number.parseInt(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.authentication.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      sessionTimeout: Number.parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.authentication.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      maxLoginAttempts: Number.parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.authentication.lockoutDuration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    authentication: {
                      ...settings.authentication,
                      lockoutDuration: Number.parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Password Requirements</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label>Require Uppercase Letters</Label>
                <Switch
                  checked={settings.authentication.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        passwordPolicy: {
                          ...settings.authentication.passwordPolicy,
                          requireUppercase: checked,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Numbers</Label>
                <Switch
                  checked={settings.authentication.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        passwordPolicy: {
                          ...settings.authentication.passwordPolicy,
                          requireNumbers: checked,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Special Characters</Label>
                <Switch
                  checked={settings.authentication.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        passwordPolicy: {
                          ...settings.authentication.passwordPolicy,
                          requireSpecialChars: checked,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch
                  checked={settings.authentication.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      authentication: {
                        ...settings.authentication,
                        twoFactorAuth: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encryption Settings */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Encryption & SSL</CardTitle>
          <CardDescription>Configure encryption and SSL/TLS settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sslMode">SSL Mode</Label>
              <Select
                value={settings.encryption.sslMode}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    encryption: { ...settings.encryption, sslMode: value },
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
              <Label htmlFor="tlsVersion">Minimum TLS Version</Label>
              <Select
                value={settings.encryption.tlsVersion}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    encryption: { ...settings.encryption, tlsVersion: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">TLS 1.0</SelectItem>
                  <SelectItem value="1.1">TLS 1.1</SelectItem>
                  <SelectItem value="1.2">TLS 1.2</SelectItem>
                  <SelectItem value="1.3">TLS 1.3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Encrypt Backups</Label>
                <p className="text-sm text-muted-foreground">Automatically encrypt all database backups</p>
              </div>
              <Switch
                checked={settings.encryption.encryptBackups}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    encryption: { ...settings.encryption, encryptBackups: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Encrypt Logs</Label>
                <p className="text-sm text-muted-foreground">Encrypt audit and system logs</p>
              </div>
              <Switch
                checked={settings.encryption.encryptLogs}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    encryption: { ...settings.encryption, encryptLogs: checked },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auditing Settings */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Audit Logging</CardTitle>
          <CardDescription>Configure audit logging and monitoring settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all database activities for security auditing</p>
              </div>
              <Switch
                checked={settings.auditing.enableAuditLog}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    auditing: { ...settings.auditing, enableAuditLog: checked },
                  })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label>Log Connections</Label>
                <Switch
                  checked={settings.auditing.logConnections}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      auditing: { ...settings.auditing, logConnections: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Log Statements</Label>
                <Switch
                  checked={settings.auditing.logStatements}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      auditing: { ...settings.auditing, logStatements: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Log DDL Operations</Label>
                <Switch
                  checked={settings.auditing.logDDL}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      auditing: { ...settings.auditing, logDDL: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Log DML Operations</Label>
                <Switch
                  checked={settings.auditing.logDML}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      auditing: { ...settings.auditing, logDML: checked },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionDays">Log Retention (days)</Label>
              <Input
                id="retentionDays"
                type="number"
                value={settings.auditing.retentionDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    auditing: { ...settings.auditing, retentionDays: Number.parseInt(e.target.value) },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firewall Settings */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Network Security</CardTitle>
          <CardDescription>Configure firewall and network access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Firewall</Label>
                <p className="text-sm text-muted-foreground">Enable IP-based access control</p>
              </div>
              <Switch
                checked={settings.firewall.enableFirewall}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    firewall: { ...settings.firewall, enableFirewall: checked },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowedIPs">Allowed IP Ranges</Label>
              <Input
                id="allowedIPs"
                value={settings.firewall.allowedIPs}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    firewall: { ...settings.firewall, allowedIPs: e.target.value },
                  })
                }
                placeholder="192.168.1.0/24, 10.0.0.0/8"
              />
              <p className="text-xs text-muted-foreground">Comma-separated list of IP addresses or CIDR ranges</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label>Block Suspicious IPs</Label>
                <Switch
                  checked={settings.firewall.blockSuspiciousIPs}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      firewall: { ...settings.firewall, blockSuspiciousIPs: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Rate Limiting</Label>
                <Switch
                  checked={settings.firewall.rateLimiting}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      firewall: { ...settings.firewall, rateLimiting: checked },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxConnectionsPerIP">Max Connections per IP</Label>
              <Input
                id="maxConnectionsPerIP"
                type="number"
                value={settings.firewall.maxConnectionsPerIP}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    firewall: { ...settings.firewall, maxConnectionsPerIP: Number.parseInt(e.target.value) },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
