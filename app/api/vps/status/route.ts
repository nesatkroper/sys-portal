import { NextResponse } from "next/server"
import { VPSSSHClient } from "@/lib/ssh-client"

export async function GET() {
  try {
    // Validate environment variables
    const sshHost = process.env.SSH_HOST
    const sshUser = process.env.SSH_USER
    const sshPassword = process.env.SSH_PASSWORD
    const sshPort = process.env.SSH_PORT || "22"

    if (!sshHost || !sshUser) {
      return NextResponse.json(
        {
          status: "offline",
          error: "SSH credentials not configured",
          timestamp: Date.now(),
        },
        { status: 500 },
      )
    }

    const startTime = Date.now()

    // Create SSH client and test connection
    const sshClient = new VPSSSHClient({
      host: sshHost,
      port: Number.parseInt(sshPort),
      username: sshUser,
      password: sshPassword,
    })

    const connectionTest = await sshClient.testConnection()

    if (connectionTest.success) {
      return NextResponse.json({
        status: "online",
        responseTime: connectionTest.responseTime,
        timestamp: Date.now(),
      })
    } else {
      return NextResponse.json(
        {
          status: "offline",
          error: connectionTest.error,
          responseTime: connectionTest.responseTime,
          timestamp: Date.now(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("SSH connection error:", error)

    return NextResponse.json(
      {
        status: "offline",
        error: error instanceof Error ? error.message : "Connection failed",
        timestamp: Date.now(),
      },
      { status: 503 },
    )
  }
}
