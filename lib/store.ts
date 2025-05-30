import { create } from "zustand"

// Database types
export interface Database {
  id: string
  name: string
  host: string
  port: number
  username: string
  status: "connected" | "disconnected" | "error"
  lastConnected?: string
  tables?: number
  size?: string
}

export interface User {
  id: string
  username: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin?: string
  permissions: string[]
}

export interface BackupItem {
  id: string
  name: string
  database: string
  size: string
  createdAt: string
  status: "completed" | "failed" | "in-progress"
  type: "full" | "incremental" | "differential"
}

export interface ExportItem {
  id: string
  name: string
  format: "xlsx" | "csv" | "json" | "sql"
  database: string
  tables?: string[]
  status: "processing" | "completed" | "failed"
  progress?: number
  size?: number
  createdAt: string
  downloadUrl?: string
}

export interface QueryHistoryItem {
  id: string
  query: string
  database: string
  executedAt: string
  duration: number
  status: "success" | "error"
  rowsAffected?: number
}

export interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  connections: number
  activeQueries: number
  timestamp: string
}

// Database Store
interface DatabaseStore {
  databases: Database[]
  selectedDatabase: string | null
  isConnecting: boolean
  addDatabase: (database: Omit<Database, "id">) => void
  removeDatabase: (id: string) => void
  selectDatabase: (id: string) => void
  updateDatabaseStatus: (id: string, status: Database["status"]) => void
}

export const useDatabaseStore = create<DatabaseStore>((set) => ({
  databases: [
    {
      id: "1",
      name: "ecommerce_prod",
      host: "prod-db.company.com",
      port: 5432,
      username: "admin",
      status: "connected",
      lastConnected: new Date().toISOString(),
      tables: 24,
      size: "2.4 GB",
    },
    {
      id: "2",
      name: "analytics_db",
      host: "analytics.company.com",
      port: 5432,
      username: "analyst",
      status: "connected",
      lastConnected: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      tables: 12,
      size: "890 MB",
    },
    {
      id: "3",
      name: "staging_env",
      host: "staging-db.company.com",
      port: 5432,
      username: "developer",
      status: "disconnected",
      tables: 18,
      size: "1.2 GB",
    },
  ],
  selectedDatabase: "1",
  isConnecting: false,
  addDatabase: (database) =>
    set((state) => ({
      databases: [...state.databases, { ...database, id: Date.now().toString() }],
    })),
  removeDatabase: (id) =>
    set((state) => ({
      databases: state.databases.filter((db) => db.id !== id),
    })),
  selectDatabase: (id) => set({ selectedDatabase: id }),
  updateDatabaseStatus: (id, status) =>
    set((state) => ({
      databases: state.databases.map((db) => (db.id === id ? { ...db, status } : db)),
    })),
}))

// User Store
interface UserStore {
  users: User[]
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [
    {
      id: "1",
      username: "admin",
      email: "admin@company.com",
      role: "Database Administrator",
      status: "active",
      lastLogin: new Date().toISOString(),
      permissions: ["read", "write", "delete", "admin"],
    },
    {
      id: "2",
      username: "analyst",
      email: "analyst@company.com",
      role: "Data Analyst",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      permissions: ["read"],
    },
    {
      id: "3",
      username: "developer",
      email: "dev@company.com",
      role: "Developer",
      status: "inactive",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      permissions: ["read", "write"],
    },
  ],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: Date.now().toString() }],
    })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}))

// Backup Store
interface BackupStore {
  backups: BackupItem[]
  createBackup: (backup: Omit<BackupItem, "id" | "createdAt">) => void
  deleteBackup: (id: string) => void
}

export const useBackupStore = create<BackupStore>((set) => ({
  backups: [
    {
      id: "1",
      name: "Daily Backup - Production",
      database: "ecommerce_prod",
      size: "2.1 GB",
      createdAt: new Date().toISOString(),
      status: "completed",
      type: "full",
    },
    {
      id: "2",
      name: "Weekly Analytics Backup",
      database: "analytics_db",
      size: "850 MB",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      type: "incremental",
    },
    {
      id: "3",
      name: "Staging Environment Backup",
      database: "staging_env",
      size: "1.1 GB",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "failed",
      type: "full",
    },
  ],
  createBackup: (backup) =>
    set((state) => ({
      backups: [
        {
          ...backup,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
        ...state.backups,
      ],
    })),
  deleteBackup: (id) =>
    set((state) => ({
      backups: state.backups.filter((backup) => backup.id !== id),
    })),
}))

// Export Store
interface ExportStore {
  exports: ExportItem[]
  createExport: (data: Partial<ExportItem>) => Promise<void>
  downloadExport: (id: string) => void
  deleteExport: (id: string) => void
}

export const useExportStore = create<ExportStore>((set, get) => ({
  exports: [
    {
      id: "1",
      name: "Monthly Users Report",
      format: "xlsx",
      database: "ecommerce_prod",
      status: "completed",
      progress: 100,
      size: 2.4 * 1024 * 1024, // 2.4 MB in bytes
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      downloadUrl: "/exports/monthly-users-report.xlsx",
    },
    {
      id: "2",
      name: "Orders Data Export",
      format: "csv",
      database: "ecommerce_prod",
      status: "processing",
      progress: 65,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Product Catalog Backup",
      format: "sql",
      database: "ecommerce_staging",
      status: "completed",
      progress: 100,
      size: 15.7 * 1024 * 1024, // 15.7 MB in bytes
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: "/exports/product-catalog-backup.sql",
    },
  ],

  createExport: async (data) => {
    const newExport: ExportItem = {
      id: Date.now().toString(),
      name: data.name || "Untitled Export",
      format: data.format || "xlsx",
      database: data.database || "",
      tables: data.tables || [],
      status: "processing",
      progress: 0,
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      exports: [newExport, ...state.exports],
    }))

    // Simulate export progress
    const progressInterval = setInterval(() => {
      set((state) => ({
        exports: state.exports.map((exp) =>
          exp.id === newExport.id
            ? {
                ...exp,
                progress: Math.min((exp.progress || 0) + Math.random() * 20, 100),
              }
            : exp,
        ),
      }))

      const currentExport = get().exports.find((exp) => exp.id === newExport.id)
      if (currentExport && (currentExport.progress || 0) >= 100) {
        clearInterval(progressInterval)

        // Mark as completed and add download info
        set((state) => ({
          exports: state.exports.map((exp) =>
            exp.id === newExport.id
              ? {
                  ...exp,
                  status: "completed",
                  progress: 100,
                  size: Math.random() * 10 * 1024 * 1024, // Random size up to 10MB
                  downloadUrl: `/exports/${exp.name.toLowerCase().replace(/\s+/g, "-")}.${exp.format}`,
                }
              : exp,
          ),
        }))
      }
    }, 1000)
  },

  downloadExport: (id) => {
    const exportItem = get().exports.find((exp) => exp.id === id)
    if (exportItem && exportItem.downloadUrl) {
      // Create mock download data based on format
      let content = ""
      let mimeType = ""
      const filename = `${exportItem.name}.${exportItem.format}`

      switch (exportItem.format) {
        case "xlsx":
          content = createMockExcelData()
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          break
        case "csv":
          content = createMockCSVData()
          mimeType = "text/csv"
          break
        case "json":
          content = createMockJSONData()
          mimeType = "application/json"
          break
        case "sql":
          content = createMockSQLData()
          mimeType = "application/sql"
          break
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  },

  deleteExport: (id) => {
    set((state) => ({
      exports: state.exports.filter((exp) => exp.id !== id),
    }))
  },
}))

// Query History Store
interface QueryHistoryStore {
  queries: QueryHistoryItem[]
  addQuery: (query: Omit<QueryHistoryItem, "id" | "executedAt">) => void
  clearHistory: () => void
}

export const useQueryHistoryStore = create<QueryHistoryStore>((set) => ({
  queries: [
    {
      id: "1",
      query: "SELECT * FROM users WHERE status = 'active'",
      database: "ecommerce_prod",
      executedAt: new Date().toISOString(),
      duration: 45,
      status: "success",
      rowsAffected: 1250,
    },
    {
      id: "2",
      query: "UPDATE products SET price = price * 1.1 WHERE category = 'electronics'",
      database: "ecommerce_prod",
      executedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      duration: 120,
      status: "success",
      rowsAffected: 89,
    },
    {
      id: "3",
      query: "SELECT COUNT(*) FROM orders WHERE created_at >= '2024-01-01'",
      database: "analytics_db",
      executedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      duration: 2340,
      status: "error",
    },
  ],
  addQuery: (query) =>
    set((state) => ({
      queries: [
        {
          ...query,
          id: Date.now().toString(),
          executedAt: new Date().toISOString(),
        },
        ...state.queries,
      ],
    })),
  clearHistory: () => set({ queries: [] }),
}))

// System Metrics Store
interface SystemMetricsStore {
  metrics: SystemMetrics[]
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  addMetric: (metric: SystemMetrics) => void
}

export const useSystemMetricsStore = create<SystemMetricsStore>((set, get) => ({
  metrics: [
    {
      cpu: 45,
      memory: 68,
      disk: 32,
      connections: 24,
      activeQueries: 8,
      timestamp: new Date().toISOString(),
    },
  ],
  isMonitoring: false,
  startMonitoring: () => {
    set({ isMonitoring: true })

    const interval = setInterval(() => {
      const newMetric: SystemMetrics = {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        connections: Math.floor(Math.random() * 50) + 10,
        activeQueries: Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        metrics: [...state.metrics.slice(-19), newMetric], // Keep last 20 metrics
      }))
    }, 2000)

    // Store interval ID for cleanup
    ;(get() as any).monitoringInterval = interval
  },
  stopMonitoring: () => {
    set({ isMonitoring: false })
    const interval = (get() as any).monitoringInterval
    if (interval) {
      clearInterval(interval)
    }
  },
  addMetric: (metric) =>
    set((state) => ({
      metrics: [...state.metrics.slice(-19), metric],
    })),
}))

// UI Store
interface UIStore {
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean
  notifications: Array<{
    id: string
    title: string
    message: string
    type: "info" | "success" | "warning" | "error"
    timestamp: string
  }>
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<UIStore["notifications"][0], "id" | "timestamp">) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  theme: "system",
  sidebarCollapsed: false,
  notifications: [],
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))

// Mock data generators
function createMockExcelData(): string {
  return `ID,Name,Email,Created At,Status
1,John Doe,john@example.com,2024-01-15,Active
2,Jane Smith,jane@example.com,2024-01-16,Active
3,Bob Johnson,bob@example.com,2024-01-17,Inactive
4,Alice Brown,alice@example.com,2024-01-18,Active
5,Charlie Wilson,charlie@example.com,2024-01-19,Active`
}

function createMockCSVData(): string {
  return `ID,Product Name,Price,Category,Stock
1,"Laptop Pro 15""",1299.99,Electronics,45
2,"Wireless Mouse",29.99,Electronics,120
3,"Office Chair",199.99,Furniture,23
4,"Coffee Mug",12.99,Kitchen,89
5,"Notebook Set",15.99,Office,67`
}

function createMockJSONData(): string {
  return JSON.stringify(
    {
      users: [
        { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-01-15", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-01-16", status: "active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-01-17", status: "inactive" },
      ],
      metadata: {
        total_records: 3,
        export_date: new Date().toISOString(),
        format: "json",
      },
    },
    null,
    2,
  )
}

function createMockSQLData(): string {
  return `-- Database Export
-- Generated on: ${new Date().toISOString()}

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

INSERT INTO users (name, email, created_at, status) VALUES
('John Doe', 'john@example.com', '2024-01-15 10:00:00', 'active'),
('Jane Smith', 'jane@example.com', '2024-01-16 11:30:00', 'active'),
('Bob Johnson', 'bob@example.com', '2024-01-17 09:15:00', 'inactive');

-- End of export`
}
