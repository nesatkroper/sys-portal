import { NextResponse } from "next/server"
import { VPSSSHClient } from "@/lib/ssh-client"

export async function GET() {
  try {
    // Check environment variables
    const sshHost = process.env.SSH_HOST
    const sshUser = process.env.SSH_USER
    const sshPassword = process.env.SSH_PASSWORD
    const sshPort = process.env.SSH_PORT || "22"

    const envCheck = {
      SSH_HOST: !!sshHost,
      SSH_USER: !!sshUser,
      SSH_PASSWORD: !!sshPassword,
      SSH_PORT: sshPort,
    }

    const missingVars = []
    if (!envCheck.SSH_HOST) missingVars.push("SSH_HOST")
    if (!envCheck.SSH_USER) missingVars.push("SSH_USER")
    if (!envCheck.SSH_PASSWORD) missingVars.push("SSH_PASSWORD")

    if (missingVars.length > 0) {
      return NextResponse.json({
        environment: envCheck,
        connectionTest: "missing_credentials",
        missingVariables: missingVars,
        recommendations: [
          "Set the missing environment variables",
          "Ensure your VPS allows SSH connections",
          "Check that the SSH port is correct (default: 22)",
        ],
        timestamp: Date.now(),
      })
    }

    // Test SSH connection
    console.log(`Testing connection to ${sshUser}@${sshHost}:${sshPort}`)

    const sshClient = new VPSSSHClient({
      host: sshHost,
      port: Number.parseInt(sshPort),
      username: sshUser,
      password: sshPassword,
    })

    const connectionTest = await sshClient.testConnection()

    if (connectionTest.success) {
      // Get basic system info
      try {
        const systemInfo = await sshClient.executeCommand("uname -a && whoami && pwd")

        return NextResponse.json({
          environment: envCheck,
          connectionTest: "success",
          responseTime: connectionTest.responseTime,
          systemInfo: systemInfo,
          message: "SSH connection successful!",
          timestamp: Date.now(),
        })
      } catch (error) {
        return NextResponse.json({
          environment: envCheck,
          connectionTest: "connected_but_command_failed",
          responseTime: connectionTest.responseTime,
          error: error instanceof Error ? error.message : "Unknown error",
          message: "Connected but failed to execute commands",
          timestamp: Date.now(),
        })
      }
    } else {
      return NextResponse.json({
        environment: envCheck,
        connectionTest: "failed",
        responseTime: connectionTest.responseTime,
        error: connectionTest.error,
        recommendations: [
          "Check if the SSH host is reachable",
          "Verify SSH credentials are correct",
          "Ensure SSH service is running on the VPS",
          "Check firewall settings",
        ],
        timestamp: Date.now(),
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      },
      { status: 500 },
    )
  }
}
