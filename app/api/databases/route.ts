import { NextResponse } from "next/server"

export async function GET() {
  // Comprehensive mock database data
  const databases = [
    {
      id: "1",
      name: "ecommerce_prod",
      size: "15.4 GB",
      tables: 45,
      connections: 23,
      status: "online",
      owner: "admin",
      createdAt: "2024-01-15",
      lastBackup: "2024-01-30 14:30:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
    {
      id: "2",
      name: "analytics_warehouse",
      size: "8.7 GB",
      tables: 28,
      connections: 12,
      status: "online",
      owner: "analytics_user",
      createdAt: "2024-01-20",
      lastBackup: "2024-01-30 02:00:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
    {
      id: "3",
      name: "user_sessions",
      size: "2.1 GB",
      tables: 8,
      connections: 45,
      status: "online",
      owner: "session_manager",
      createdAt: "2024-01-25",
      lastBackup: "2024-01-30 06:00:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
    {
      id: "4",
      name: "logs_archive",
      size: "32.8 GB",
      tables: 12,
      connections: 3,
      status: "maintenance",
      owner: "log_admin",
      createdAt: "2024-01-10",
      lastBackup: "2024-01-29 23:00:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
    {
      id: "5",
      name: "inventory_mgmt",
      size: "5.2 GB",
      tables: 22,
      connections: 8,
      status: "online",
      owner: "inventory_user",
      createdAt: "2024-01-18",
      lastBackup: "2024-01-30 10:15:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
    {
      id: "6",
      name: "customer_support",
      size: "3.9 GB",
      tables: 18,
      connections: 15,
      status: "online",
      owner: "support_admin",
      createdAt: "2024-01-22",
      lastBackup: "2024-01-30 08:45:00",
      encoding: "UTF8",
      collation: "en_US.UTF-8",
    },
  ]

  return NextResponse.json(databases)
}

export async function POST(request: Request) {
  const { name, owner } = await request.json()

  const newDatabase = {
    id: Date.now().toString(),
    name,
    size: "0 MB",
    tables: 0,
    connections: 0,
    status: "online",
    owner: owner || "admin",
    createdAt: new Date().toISOString().split("T")[0],
    lastBackup: null,
    encoding: "UTF8",
    collation: "en_US.UTF-8",
  }

  return NextResponse.json(newDatabase, { status: 201 })
}
