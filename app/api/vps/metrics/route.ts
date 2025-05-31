import { NextResponse } from "next/server"
import { VPSSSHClient } from "@/lib/ssh-client"

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    loadAverage: number[]
    model: string
  }
  memory: {
    total: number
    used: number
    free: number
    available: number
    usage: number
    cached: number
    buffers: number
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
    filesystem: string
    mountpoint: string
  }
  network: {
    interfaces: Array<{
      name: string
      rx_bytes: number
      tx_bytes: number
      rx_packets: number
      tx_packets: number
      rx_errors: number
      tx_errors: number
    }>
  }
  system: {
    hostname: string
    kernel: string
    uptime: number
    processes: number
    users: number
  }
  timestamp: number
}

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
          error: "SSH credentials not configured",
          details: "Please set SSH_HOST, SSH_USER, and SSH_PASSWORD environment variables",
        },
        { status: 500 },
      )
    }

    console.log(`Connecting to VPS: ${sshUser}@${sshHost}:${sshPort}`)

    // Create SSH client
    const sshClient = new VPSSSHClient({
      host: sshHost,
      port: Number.parseInt(sshPort),
      username: sshUser,
      password: sshPassword,
    })

    // Define comprehensive system monitoring commands
    const commands = {
      // System information
      system: `
        echo "HOSTNAME:$(hostname)"
        echo "KERNEL:$(uname -r)"
        echo "UPTIME:$(awk '{print $1}' /proc/uptime)"
        echo "PROCESSES:$(ps aux | wc -l)"
        echo "USERS:$(who | wc -l)"
      `,

      // CPU information and usage
      cpu: `
        echo "CORES:$(nproc)"
        echo "MODEL:$(cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d':' -f2 | xargs)"
        echo "LOAD:$(cat /proc/loadavg)"
        top -bn1 | grep "Cpu(s)" | awk '{print "USAGE:" $2}' | sed 's/%us,//'
      `,

      // Memory information
      memory: `
        free -b | awk '
        /^Mem:/ {
          print "MEM_TOTAL:" $2
          print "MEM_USED:" $3
          print "MEM_FREE:" $4
          print "MEM_SHARED:" $5
          print "MEM_BUFFERS:" $6
          print "MEM_CACHED:" $7
        }
        /^-\/\+ buffers\/cache:/ {
          print "MEM_AVAILABLE:" $4
        }
        '
        # For newer systems that show available memory directly
        free -b | awk '/^Mem:/ && NF==7 {print "MEM_AVAILABLE:" $7}'
      `,

      // Disk usage
      disk: `
        df -B1 / | awk 'NR==2 {
          print "DISK_FILESYSTEM:" $1
          print "DISK_TOTAL:" $2
          print "DISK_USED:" $3
          print "DISK_FREE:" $4
          print "DISK_MOUNTPOINT:" $6
        }'
      `,

      // Network interfaces
      network: `
        cat /proc/net/dev | awk '
        NR>2 && !/lo:/ {
          gsub(/:/, "", $1)
          print "INTERFACE:" $1
          print "RX_BYTES:" $2
          print "RX_PACKETS:" $3
          print "RX_ERRORS:" $4
          print "TX_BYTES:" $10
          print "TX_PACKETS:" $11
          print "TX_ERRORS:" $12
          print "---"
        }'
      `,
    }

    // Execute all commands
    console.log("Executing system monitoring commands...")
    const [systemOutput, cpuOutput, memoryOutput, diskOutput, networkOutput] = await Promise.all([
      sshClient.executeCommand(commands.system),
      sshClient.executeCommand(commands.cpu),
      sshClient.executeCommand(commands.memory),
      sshClient.executeCommand(commands.disk),
      sshClient.executeCommand(commands.network),
    ])

    // Parse system information
    const systemLines = systemOutput.split("\n")
    const hostname =
      systemLines
        .find((line) => line.startsWith("HOSTNAME:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const kernel =
      systemLines
        .find((line) => line.startsWith("KERNEL:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const uptime = Number.parseFloat(systemLines.find((line) => line.startsWith("UPTIME:"))?.split(":")[1] || "0")
    const processes = Number.parseInt(systemLines.find((line) => line.startsWith("PROCESSES:"))?.split(":")[1] || "0")
    const users = Number.parseInt(systemLines.find((line) => line.startsWith("USERS:"))?.split(":")[1] || "0")

    // Parse CPU information
    const cpuLines = cpuOutput.split("\n")
    const cores = Number.parseInt(cpuLines.find((line) => line.startsWith("CORES:"))?.split(":")[1] || "1")
    const cpuModel =
      cpuLines
        .find((line) => line.startsWith("MODEL:"))
        ?.split(":")[1]
        ?.trim() || "Unknown"
    const loadLine = cpuLines.find((line) => line.startsWith("LOAD:"))?.split(":")[1] || "0 0 0"
    const loadAverage = loadLine.trim().split(" ").slice(0, 3).map(Number)
    const usageLine = cpuLines.find((line) => line.startsWith("USAGE:"))?.split(":")[1] || "0"
    const cpuUsage = Number.parseFloat(usageLine.replace("%", "")) || 0

    // Parse memory information
    const memoryLines = memoryOutput.split("\n")
    const memTotal = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_TOTAL:"))?.split(":")[1] || "0")
    const memUsed = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_USED:"))?.split(":")[1] || "0")
    const memFree = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_FREE:"))?.split(":")[1] || "0")
    const memCached = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_CACHED:"))?.split(":")[1] || "0")
    const memBuffers = Number.parseInt(
      memoryLines.find((line) => line.startsWith("MEM_BUFFERS:"))?.split(":")[1] || "0",
    )
    const memAvailable = Number.parseInt(
      memoryLines.find((line) => line.startsWith("MEM_AVAILABLE:"))?.split(":")[1] || memFree,
    )

    // Parse disk information
    const diskLines = diskOutput.split("\n")
    const diskFilesystem =
      diskLines
        .find((line) => line.startsWith("DISK_FILESYSTEM:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const diskTotal = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_TOTAL:"))?.split(":")[1] || "0")
    const diskUsed = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_USED:"))?.split(":")[1] || "0")
    const diskFree = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_FREE:"))?.split(":")[1] || "0")
    const diskMountpoint =
      diskLines
        .find((line) => line.startsWith("DISK_MOUNTPOINT:"))
        ?.split(":")[1]
        ?.trim() || "/"

    // Parse network interfaces
    const networkInterfaces = []
    const networkSections = networkOutput.split("---").filter((section) => section.trim())

    for (const section of networkSections) {
      const lines = section.trim().split("\n")
      const interfaceLine = lines.find((line) => line.startsWith("INTERFACE:"))

      if (interfaceLine) {
        const name = interfaceLine.split(":")[1]?.trim() || "unknown"
        const rxBytes = Number.parseInt(lines.find((line) => line.startsWith("RX_BYTES:"))?.split(":")[1] || "0")
        const rxPackets = Number.parseInt(lines.find((line) => line.startsWith("RX_PACKETS:"))?.split(":")[1] || "0")
        const rxErrors = Number.parseInt(lines.find((line) => line.startsWith("RX_ERRORS:"))?.split(":")[1] || "0")
        const txBytes = Number.parseInt(lines.find((line) => line.startsWith("TX_BYTES:"))?.split(":")[1] || "0")
        const txPackets = Number.parseInt(lines.find((line) => line.startsWith("TX_PACKETS:"))?.split(":")[1] || "0")
        const txErrors = Number.parseInt(lines.find((line) => line.startsWith("TX_ERRORS:"))?.split(":")[1] || "0")

        networkInterfaces.push({
          name,
          rx_bytes: rxBytes,
          tx_bytes: txBytes,
          rx_packets: rxPackets,
          tx_packets: txPackets,
          rx_errors: rxErrors,
          tx_errors: txErrors,
        })
      }
    }

    // Build comprehensive metrics object
    const metrics: SystemMetrics = {
      cpu: {
        usage: Math.min(Math.max(cpuUsage, 0), 100),
        cores,
        loadAverage: loadAverage.length === 3 ? loadAverage : [0, 0, 0],
        model: cpuModel,
      },
      memory: {
        total: memTotal,
        used: memUsed,
        free: memFree,
        available: memAvailable,
        usage: memTotal > 0 ? Math.min((memUsed / memTotal) * 100, 100) : 0,
        cached: memCached,
        buffers: memBuffers,
      },
      disk: {
        total: diskTotal,
        used: diskUsed,
        free: diskFree,
        usage: diskTotal > 0 ? Math.min((diskUsed / diskTotal) * 100, 100) : 0,
        filesystem: diskFilesystem,
        mountpoint: diskMountpoint,
      },
      network: {
        interfaces: networkInterfaces,
      },
      system: {
        hostname,
        kernel,
        uptime,
        processes,
        users,
      },
      timestamp: Date.now(),
    }

    console.log("Successfully fetched real VPS metrics from", hostname)
    return NextResponse.json(metrics)
  } catch (error) {
    console.error("VPS monitoring error:", error)

    return NextResponse.json(
      {
        error: "Failed to connect to VPS",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      },
      { status: 500 },
    )
  }
}
