export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "readonly"
  createdAt: string
  lastLogin?: string
}

export interface Database {
  id: string
  name: string
  size: string
  tables: number
  connections: number
  status: "online" | "offline" | "maintenance"
  owner: string
  createdAt: string
}

export interface Table {
  name: string
  schema: string
  rows: number
  size: string
  lastModified: string
}

export interface QueryResult {
  columns: string[]
  rows: any[][]
  rowCount: number
  executionTime: string
}

export interface SystemMetric {
  timestamp: string
  cpu: number
  memory: number
  disk: number
  network: number
}

export interface Alert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: string
  resolved: boolean
}
