import { NextResponse } from "next/server"
import { VPSSSHClient } from "@/lib/ssh-client"

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    loadAverage: number[]
    model: string
    frequency: string
    temperature?: number
    processes: {
      running: number
      sleeping: number
      stopped: number
      zombie: number
    }
  }
  memory: {
    total: number
    used: number
    free: number
    available: number
    usage: number
    cached: number
    buffers: number
    swap: {
      total: number
      used: number
      free: number
      usage: number
    }
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
    filesystem: string
    mountpoint: string
    inodes: {
      total: number
      used: number
      free: number
      usage: number
    }
    io: {
      reads: number
      writes: number
      read_bytes: number
      write_bytes: number
    }
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
      speed?: string
      status: string
    }>
    connections: {
      established: number
      listen: number
      time_wait: number
      close_wait: number
    }
  }
  system: {
    hostname: string
    kernel: string
    uptime: number
    processes: number
    users: number
    distribution: string
    architecture: string
    timezone: string
    last_boot: string
  }
  services: Array<{
    name: string
    status: string
    pid?: number
    memory?: number
    cpu?: number
  }>
  security: {
    failed_logins: number
    active_sessions: number
    firewall_status: string
    last_login: string
  }
  performance: {
    load_1m: number
    load_5m: number
    load_15m: number
    cpu_temp?: number
    disk_io_wait: number
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
      // Enhanced system information
      system: `
        echo "HOSTNAME:$(hostname)"
        echo "KERNEL:$(uname -r)"
        echo "UPTIME:$(awk '{print $1}' /proc/uptime)"
        echo "PROCESSES:$(ps aux | wc -l)"
        echo "USERS:$(who | wc -l)"
        echo "DISTRIBUTION:$(lsb_release -d 2>/dev/null | cut -f2 || cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 || echo 'Unknown')"
        echo "ARCHITECTURE:$(uname -m)"
        echo "TIMEZONE:$(timedatectl show --property=Timezone --value 2>/dev/null || date +%Z)"
        echo "LAST_BOOT:$(who -b 2>/dev/null | awk '{print $3, $4}' || uptime -s 2>/dev/null || echo 'Unknown')"
      `,

      // Enhanced CPU information
      cpu: `
        echo "CORES:$(nproc)"
        echo "MODEL:$(cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d':' -f2 | xargs)"
        echo "FREQUENCY:$(cat /proc/cpuinfo | grep 'cpu MHz' | head -1 | cut -d':' -f2 | xargs | awk '{print $1 " MHz"}')"
        echo "LOAD:$(cat /proc/loadavg)"
        top -bn1 | grep "Cpu(s)" | awk '{print "USAGE:" $2}' | sed 's/%us,//'
        echo "TEMP:$(sensors 2>/dev/null | grep 'Core 0' | awk '{print $3}' | sed 's/+//;s/°C//' || echo 'N/A')"
        ps aux | awk 'NR>1 {running+=($8=="R"); sleeping+=($8=="S"); stopped+=($8=="T"); zombie+=($8=="Z")} END {print "PROC_RUNNING:" running; print "PROC_SLEEPING:" sleeping; print "PROC_STOPPED:" stopped; print "PROC_ZOMBIE:" zombie}'
      `,

      // Enhanced memory information with swap
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
        /^Swap:/ {
          print "SWAP_TOTAL:" $2
          print "SWAP_USED:" $3
          print "SWAP_FREE:" $4
        }
        '
        free -b | awk '/^Mem:/ && NF==7 {print "MEM_AVAILABLE:" $7}'
      `,

      // Enhanced disk usage with inodes and I/O
      disk: `
        df -B1 / | awk 'NR==2 {
          print "DISK_FILESYSTEM:" $1
          print "DISK_TOTAL:" $2
          print "DISK_USED:" $3
          print "DISK_FREE:" $4
          print "DISK_MOUNTPOINT:" $6
        }'
        df -i / | awk 'NR==2 {
          print "INODE_TOTAL:" $2
          print "INODE_USED:" $3
          print "INODE_FREE:" $4
        }'
        cat /proc/diskstats | awk '$3=="sda" || $3=="vda" || $3=="xvda" {
          print "DISK_READS:" $4
          print "DISK_WRITES:" $8
          print "DISK_READ_BYTES:" $6*512
          print "DISK_WRITE_BYTES:" $10*512
        }' | head -4
      `,

      // Enhanced network with connection states
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
        netstat -an 2>/dev/null | awk '
        /^tcp/ {
          if ($6=="ESTABLISHED") est++;
          if ($6=="LISTEN") listen++;
          if ($6=="TIME_WAIT") tw++;
          if ($6=="CLOSE_WAIT") cw++;
        }
        END {
          print "CONN_ESTABLISHED:" (est ? est : 0)
          print "CONN_LISTEN:" (listen ? listen : 0)
          print "CONN_TIME_WAIT:" (tw ? tw : 0)
          print "CONN_CLOSE_WAIT:" (cw ? cw : 0)
        }'
      `,

      // Service monitoring
      services: `
        systemctl list-units --type=service --state=running --no-pager --no-legend | head -10 | awk '{print "SERVICE:" $1 ":running"}' 2>/dev/null || echo "SERVICE:systemctl:unavailable"
        ps aux | sort -k3 -nr | head -5 | awk 'NR>1 {print "PROCESS:" $11 ":" $2 ":" $3 ":" $4}' 2>/dev/null
      `,

      // Security information
      security: `
        echo "FAILED_LOGINS:$(grep "Failed password" /var/log/auth.log 2>/dev/null | tail -100 | wc -l || echo 0)"
        echo "ACTIVE_SESSIONS:$(who | wc -l)"
        echo "FIREWALL_STATUS:$(ufw status 2>/dev/null | head -1 | awk '{print $2}' || iptables -L 2>/dev/null >/dev/null && echo 'active' || echo 'unknown')"
        echo "LAST_LOGIN:$(last -1 -F 2>/dev/null | head -1 | awk '{print $3, $4, $5, $6}' || echo 'Unknown')"
      `,

      // Performance metrics
      performance: `
        cat /proc/loadavg | awk '{print "LOAD_1M:" $1; print "LOAD_5M:" $2; print "LOAD_15M:" $3}'
        iostat 1 2 2>/dev/null | tail -1 | awk '{print "IO_WAIT:" $4}' || echo "IO_WAIT:0"
      `,
    }

    // Execute all commands with better error handling
    console.log("Executing comprehensive system monitoring commands...")
    const results = await Promise.allSettled([
      sshClient.executeCommand(commands.system),
      sshClient.executeCommand(commands.cpu),
      sshClient.executeCommand(commands.memory),
      sshClient.executeCommand(commands.disk),
      sshClient.executeCommand(commands.network),
      sshClient.executeCommand(commands.services),
      sshClient.executeCommand(commands.security),
      sshClient.executeCommand(commands.performance),
    ])

    const [
      systemOutput,
      cpuOutput,
      memoryOutput,
      diskOutput,
      networkOutput,
      servicesOutput,
      securityOutput,
      performanceOutput,
    ] = results.map((result) => (result.status === "fulfilled" ? result.value : ""))

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
    const distribution =
      systemLines
        .find((line) => line.startsWith("DISTRIBUTION:"))
        ?.split(":")[1]
        ?.trim() || "Unknown"
    const architecture =
      systemLines
        .find((line) => line.startsWith("ARCHITECTURE:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const timezone =
      systemLines
        .find((line) => line.startsWith("TIMEZONE:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const lastBoot =
      systemLines
        .find((line) => line.startsWith("LAST_BOOT:"))
        ?.split(":")[1]
        ?.trim() || "unknown"

    // Parse enhanced CPU information
    const cpuLines = cpuOutput.split("\n")
    const cores = Number.parseInt(cpuLines.find((line) => line.startsWith("CORES:"))?.split(":")[1] || "1")
    const cpuModel =
      cpuLines
        .find((line) => line.startsWith("MODEL:"))
        ?.split(":")[1]
        ?.trim() || "Unknown"
    const frequency =
      cpuLines
        .find((line) => line.startsWith("FREQUENCY:"))
        ?.split(":")[1]
        ?.trim() || "Unknown"
    const loadLine = cpuLines.find((line) => line.startsWith("LOAD:"))?.split(":")[1] || "0 0 0"
    const loadAverage = loadLine.trim().split(" ").slice(0, 3).map(Number)
    const usageLine = cpuLines.find((line) => line.startsWith("USAGE:"))?.split(":")[1] || "0"
    const cpuUsage = Number.parseFloat(usageLine.replace("%", "")) || 0
    const tempLine = cpuLines
      .find((line) => line.startsWith("TEMP:"))
      ?.split(":")[1]
      ?.trim()
    const temperature = tempLine && tempLine !== "N/A" ? Number.parseFloat(tempLine) : undefined

    const procRunning = Number.parseInt(cpuLines.find((line) => line.startsWith("PROC_RUNNING:"))?.split(":")[1] || "0")
    const procSleeping = Number.parseInt(
      cpuLines.find((line) => line.startsWith("PROC_SLEEPING:"))?.split(":")[1] || "0",
    )
    const procStopped = Number.parseInt(cpuLines.find((line) => line.startsWith("PROC_STOPPED:"))?.split(":")[1] || "0")
    const procZombie = Number.parseInt(cpuLines.find((line) => line.startsWith("PROC_ZOMBIE:"))?.split(":")[1] || "0")

    // Parse enhanced memory information
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

    const swapTotal = Number.parseInt(memoryLines.find((line) => line.startsWith("SWAP_TOTAL:"))?.split(":")[1] || "0")
    const swapUsed = Number.parseInt(memoryLines.find((line) => line.startsWith("SWAP_USED:"))?.split(":")[1] || "0")
    const swapFree = Number.parseInt(memoryLines.find((line) => line.startsWith("SWAP_FREE:"))?.split(":")[1] || "0")

    // Parse enhanced disk information
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

    const inodeTotal = Number.parseInt(diskLines.find((line) => line.startsWith("INODE_TOTAL:"))?.split(":")[1] || "0")
    const inodeUsed = Number.parseInt(diskLines.find((line) => line.startsWith("INODE_USED:"))?.split(":")[1] || "0")
    const inodeFree = Number.parseInt(diskLines.find((line) => line.startsWith("INODE_FREE:"))?.split(":")[1] || "0")

    const diskReads = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_READS:"))?.split(":")[1] || "0")
    const diskWrites = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_WRITES:"))?.split(":")[1] || "0")
    const diskReadBytes = Number.parseInt(
      diskLines.find((line) => line.startsWith("DISK_READ_BYTES:"))?.split(":")[1] || "0",
    )
    const diskWriteBytes = Number.parseInt(
      diskLines.find((line) => line.startsWith("DISK_WRITE_BYTES:"))?.split(":")[1] || "0",
    )

    // Parse enhanced network information
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
          status: rxErrors === 0 && txErrors === 0 ? "healthy" : "errors",
        })
      }
    }

    // Parse network connections
    const networkLines = networkOutput.split("\n")
    const connEstablished = Number.parseInt(
      networkLines.find((line) => line.startsWith("CONN_ESTABLISHED:"))?.split(":")[1] || "0",
    )
    const connListen = Number.parseInt(
      networkLines.find((line) => line.startsWith("CONN_LISTEN:"))?.split(":")[1] || "0",
    )
    const connTimeWait = Number.parseInt(
      networkLines.find((line) => line.startsWith("CONN_TIME_WAIT:"))?.split(":")[1] || "0",
    )
    const connCloseWait = Number.parseInt(
      networkLines.find((line) => line.startsWith("CONN_CLOSE_WAIT:"))?.split(":")[1] || "0",
    )

    // Parse services
    const services = []
    const serviceLines = servicesOutput.split("\n")

    for (const line of serviceLines) {
      if (line.startsWith("SERVICE:")) {
        const parts = line.split(":")
        if (parts.length >= 3) {
          services.push({
            name: parts[1],
            status: parts[2],
          })
        }
      } else if (line.startsWith("PROCESS:")) {
        const parts = line.split(":")
        if (parts.length >= 5) {
          services.push({
            name: parts[1],
            status: "running",
            pid: Number.parseInt(parts[2]),
            cpu: Number.parseFloat(parts[3]),
            memory: Number.parseFloat(parts[4]),
          })
        }
      }
    }

    // Parse security information
    const securityLines = securityOutput.split("\n")
    const failedLogins = Number.parseInt(
      securityLines.find((line) => line.startsWith("FAILED_LOGINS:"))?.split(":")[1] || "0",
    )
    const activeSessions = Number.parseInt(
      securityLines.find((line) => line.startsWith("ACTIVE_SESSIONS:"))?.split(":")[1] || "0",
    )
    const firewallStatus =
      securityLines
        .find((line) => line.startsWith("FIREWALL_STATUS:"))
        ?.split(":")[1]
        ?.trim() || "unknown"
    const lastLogin =
      securityLines
        .find((line) => line.startsWith("LAST_LOGIN:"))
        ?.split(":")[1]
        ?.trim() || "unknown"

    // Parse performance metrics
    const performanceLines = performanceOutput.split("\n")
    const load1m = Number.parseFloat(performanceLines.find((line) => line.startsWith("LOAD_1M:"))?.split(":")[1] || "0")
    const load5m = Number.parseFloat(performanceLines.find((line) => line.startsWith("LOAD_5M:"))?.split(":")[1] || "0")
    const load15m = Number.parseFloat(
      performanceLines.find((line) => line.startsWith("LOAD_15M:"))?.split(":")[1] || "0",
    )
    const ioWait = Number.parseFloat(performanceLines.find((line) => line.startsWith("IO_WAIT:"))?.split(":")[1] || "0")

    // Build comprehensive metrics object
    const metrics: SystemMetrics = {
      cpu: {
        usage: Math.min(Math.max(cpuUsage, 0), 100),
        cores,
        loadAverage: loadAverage.length === 3 ? loadAverage : [0, 0, 0],
        model: cpuModel,
        frequency,
        temperature,
        processes: {
          running: procRunning,
          sleeping: procSleeping,
          stopped: procStopped,
          zombie: procZombie,
        },
      },
      memory: {
        total: memTotal,
        used: memUsed,
        free: memFree,
        available: memAvailable,
        usage: memTotal > 0 ? Math.min((memUsed / memTotal) * 100, 100) : 0,
        cached: memCached,
        buffers: memBuffers,
        swap: {
          total: swapTotal,
          used: swapUsed,
          free: swapFree,
          usage: swapTotal > 0 ? Math.min((swapUsed / swapTotal) * 100, 100) : 0,
        },
      },
      disk: {
        total: diskTotal,
        used: diskUsed,
        free: diskFree,
        usage: diskTotal > 0 ? Math.min((diskUsed / diskTotal) * 100, 100) : 0,
        filesystem: diskFilesystem,
        mountpoint: diskMountpoint,
        inodes: {
          total: inodeTotal,
          used: inodeUsed,
          free: inodeFree,
          usage: inodeTotal > 0 ? Math.min((inodeUsed / inodeTotal) * 100, 100) : 0,
        },
        io: {
          reads: diskReads,
          writes: diskWrites,
          read_bytes: diskReadBytes,
          write_bytes: diskWriteBytes,
        },
      },
      network: {
        interfaces: networkInterfaces,
        connections: {
          established: connEstablished,
          listen: connListen,
          time_wait: connTimeWait,
          close_wait: connCloseWait,
        },
      },
      system: {
        hostname,
        kernel,
        uptime,
        processes,
        users,
        distribution,
        architecture,
        timezone,
        last_boot: lastBoot,
      },
      services: services.slice(0, 10), // Limit to top 10
      security: {
        failed_logins: failedLogins,
        active_sessions: activeSessions,
        firewall_status: firewallStatus,
        last_login: lastLogin,
      },
      performance: {
        load_1m: load1m,
        load_5m: load5m,
        load_15m: load15m,
        cpu_temp: temperature,
        disk_io_wait: ioWait,
      },
      timestamp: Date.now(),
    }

    console.log("Successfully fetched comprehensive VPS metrics from", hostname)
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



// import { NextResponse } from "next/server"
// import { VPSSSHClient } from "@/lib/ssh-client"

// interface SystemMetrics {
//   cpu: {
//     usage: number
//     cores: number
//     loadAverage: number[]
//     model: string
//   }
//   memory: {
//     total: number
//     used: number
//     free: number
//     available: number
//     usage: number
//     cached: number
//     buffers: number
//   }
//   disk: {
//     total: number
//     used: number
//     free: number
//     usage: number
//     filesystem: string
//     mountpoint: string
//   }
//   network: {
//     interfaces: Array<{
//       name: string
//       rx_bytes: number
//       tx_bytes: number
//       rx_packets: number
//       tx_packets: number
//       rx_errors: number
//       tx_errors: number
//     }>
//   }
//   system: {
//     hostname: string
//     kernel: string
//     uptime: number
//     processes: number
//     users: number
//   }
//   timestamp: number
// }

// export async function GET() {
//   try {
//     // Validate environment variables
//     const sshHost = process.env.SSH_HOST
//     const sshUser = process.env.SSH_USER
//     const sshPassword = process.env.SSH_PASSWORD
//     const sshPort = process.env.SSH_PORT || "22"

//     if (!sshHost || !sshUser) {
//       return NextResponse.json(
//         {
//           error: "SSH credentials not configured",
//           details: "Please set SSH_HOST, SSH_USER, and SSH_PASSWORD environment variables",
//         },
//         { status: 500 },
//       )
//     }

//     console.log(`Connecting to VPS: ${sshUser}@${sshHost}:${sshPort}`)

//     // Create SSH client
//     const sshClient = new VPSSSHClient({
//       host: sshHost,
//       port: Number.parseInt(sshPort),
//       username: sshUser,
//       password: sshPassword,
//     })

//     // Define comprehensive system monitoring commands
//     const commands = {
//       // System information
//       system: `
//         echo "HOSTNAME:$(hostname)"
//         echo "KERNEL:$(uname -r)"
//         echo "UPTIME:$(awk '{print $1}' /proc/uptime)"
//         echo "PROCESSES:$(ps aux | wc -l)"
//         echo "USERS:$(who | wc -l)"
//       `,

//       // CPU information and usage
//       cpu: `
//         echo "CORES:$(nproc)"
//         echo "MODEL:$(cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d':' -f2 | xargs)"
//         echo "LOAD:$(cat /proc/loadavg)"
//         top -bn1 | grep "Cpu(s)" | awk '{print "USAGE:" $2}' | sed 's/%us,//'
//       `,

//       // Memory information
//       memory: `
//         free -b | awk '
//         /^Mem:/ {
//           print "MEM_TOTAL:" $2
//           print "MEM_USED:" $3
//           print "MEM_FREE:" $4
//           print "MEM_SHARED:" $5
//           print "MEM_BUFFERS:" $6
//           print "MEM_CACHED:" $7
//         }
//         /^-\/\+ buffers\/cache:/ {
//           print "MEM_AVAILABLE:" $4
//         }
//         '
//         # For newer systems that show available memory directly
//         free -b | awk '/^Mem:/ && NF==7 {print "MEM_AVAILABLE:" $7}'
//       `,

//       // Disk usage
//       disk: `
//         df -B1 / | awk 'NR==2 {
//           print "DISK_FILESYSTEM:" $1
//           print "DISK_TOTAL:" $2
//           print "DISK_USED:" $3
//           print "DISK_FREE:" $4
//           print "DISK_MOUNTPOINT:" $6
//         }'
//       `,

//       // Network interfaces
//       network: `
//         cat /proc/net/dev | awk '
//         NR>2 && !/lo:/ {
//           gsub(/:/, "", $1)
//           print "INTERFACE:" $1
//           print "RX_BYTES:" $2
//           print "RX_PACKETS:" $3
//           print "RX_ERRORS:" $4
//           print "TX_BYTES:" $10
//           print "TX_PACKETS:" $11
//           print "TX_ERRORS:" $12
//           print "---"
//         }'
//       `,
//     }

//     // Execute all commands
//     console.log("Executing system monitoring commands...")
//     const [systemOutput, cpuOutput, memoryOutput, diskOutput, networkOutput] = await Promise.all([
//       sshClient.executeCommand(commands.system),
//       sshClient.executeCommand(commands.cpu),
//       sshClient.executeCommand(commands.memory),
//       sshClient.executeCommand(commands.disk),
//       sshClient.executeCommand(commands.network),
//     ])

//     // Parse system information
//     const systemLines = systemOutput.split("\n")
//     const hostname =
//       systemLines
//         .find((line) => line.startsWith("HOSTNAME:"))
//         ?.split(":")[1]
//         ?.trim() || "unknown"
//     const kernel =
//       systemLines
//         .find((line) => line.startsWith("KERNEL:"))
//         ?.split(":")[1]
//         ?.trim() || "unknown"
//     const uptime = Number.parseFloat(systemLines.find((line) => line.startsWith("UPTIME:"))?.split(":")[1] || "0")
//     const processes = Number.parseInt(systemLines.find((line) => line.startsWith("PROCESSES:"))?.split(":")[1] || "0")
//     const users = Number.parseInt(systemLines.find((line) => line.startsWith("USERS:"))?.split(":")[1] || "0")

//     // Parse CPU information
//     const cpuLines = cpuOutput.split("\n")
//     const cores = Number.parseInt(cpuLines.find((line) => line.startsWith("CORES:"))?.split(":")[1] || "1")
//     const cpuModel =
//       cpuLines
//         .find((line) => line.startsWith("MODEL:"))
//         ?.split(":")[1]
//         ?.trim() || "Unknown"
//     const loadLine = cpuLines.find((line) => line.startsWith("LOAD:"))?.split(":")[1] || "0 0 0"
//     const loadAverage = loadLine.trim().split(" ").slice(0, 3).map(Number)
//     const usageLine = cpuLines.find((line) => line.startsWith("USAGE:"))?.split(":")[1] || "0"
//     const cpuUsage = Number.parseFloat(usageLine.replace("%", "")) || 0

//     // Parse memory information
//     const memoryLines = memoryOutput.split("\n")
//     const memTotal = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_TOTAL:"))?.split(":")[1] || "0")
//     const memUsed = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_USED:"))?.split(":")[1] || "0")
//     const memFree = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_FREE:"))?.split(":")[1] || "0")
//     const memCached = Number.parseInt(memoryLines.find((line) => line.startsWith("MEM_CACHED:"))?.split(":")[1] || "0")
//     const memBuffers = Number.parseInt(
//       memoryLines.find((line) => line.startsWith("MEM_BUFFERS:"))?.split(":")[1] || "0",
//     )
//     const memAvailable = Number.parseInt(
//       memoryLines.find((line) => line.startsWith("MEM_AVAILABLE:"))?.split(":")[1] || memFree,
//     )

//     // Parse disk information
//     const diskLines = diskOutput.split("\n")
//     const diskFilesystem =
//       diskLines
//         .find((line) => line.startsWith("DISK_FILESYSTEM:"))
//         ?.split(":")[1]
//         ?.trim() || "unknown"
//     const diskTotal = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_TOTAL:"))?.split(":")[1] || "0")
//     const diskUsed = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_USED:"))?.split(":")[1] || "0")
//     const diskFree = Number.parseInt(diskLines.find((line) => line.startsWith("DISK_FREE:"))?.split(":")[1] || "0")
//     const diskMountpoint =
//       diskLines
//         .find((line) => line.startsWith("DISK_MOUNTPOINT:"))
//         ?.split(":")[1]
//         ?.trim() || "/"

//     // Parse network interfaces
//     const networkInterfaces = []
//     const networkSections = networkOutput.split("---").filter((section) => section.trim())

//     for (const section of networkSections) {
//       const lines = section.trim().split("\n")
//       const interfaceLine = lines.find((line) => line.startsWith("INTERFACE:"))

//       if (interfaceLine) {
//         const name = interfaceLine.split(":")[1]?.trim() || "unknown"
//         const rxBytes = Number.parseInt(lines.find((line) => line.startsWith("RX_BYTES:"))?.split(":")[1] || "0")
//         const rxPackets = Number.parseInt(lines.find((line) => line.startsWith("RX_PACKETS:"))?.split(":")[1] || "0")
//         const rxErrors = Number.parseInt(lines.find((line) => line.startsWith("RX_ERRORS:"))?.split(":")[1] || "0")
//         const txBytes = Number.parseInt(lines.find((line) => line.startsWith("TX_BYTES:"))?.split(":")[1] || "0")
//         const txPackets = Number.parseInt(lines.find((line) => line.startsWith("TX_PACKETS:"))?.split(":")[1] || "0")
//         const txErrors = Number.parseInt(lines.find((line) => line.startsWith("TX_ERRORS:"))?.split(":")[1] || "0")

//         networkInterfaces.push({
//           name,
//           rx_bytes: rxBytes,
//           tx_bytes: txBytes,
//           rx_packets: rxPackets,
//           tx_packets: txPackets,
//           rx_errors: rxErrors,
//           tx_errors: txErrors,
//         })
//       }
//     }

//     // Build comprehensive metrics object
//     const metrics: SystemMetrics = {
//       cpu: {
//         usage: Math.min(Math.max(cpuUsage, 0), 100),
//         cores,
//         loadAverage: loadAverage.length === 3 ? loadAverage : [0, 0, 0],
//         model: cpuModel,
//       },
//       memory: {
//         total: memTotal,
//         used: memUsed,
//         free: memFree,
//         available: memAvailable,
//         usage: memTotal > 0 ? Math.min((memUsed / memTotal) * 100, 100) : 0,
//         cached: memCached,
//         buffers: memBuffers,
//       },
//       disk: {
//         total: diskTotal,
//         used: diskUsed,
//         free: diskFree,
//         usage: diskTotal > 0 ? Math.min((diskUsed / diskTotal) * 100, 100) : 0,
//         filesystem: diskFilesystem,
//         mountpoint: diskMountpoint,
//       },
//       network: {
//         interfaces: networkInterfaces,
//       },
//       system: {
//         hostname,
//         kernel,
//         uptime,
//         processes,
//         users,
//       },
//       timestamp: Date.now(),
//     }

//     console.log("Successfully fetched real VPS metrics from", hostname)
//     return NextResponse.json(metrics)
//   } catch (error) {
//     console.error("VPS monitoring error:", error)

//     return NextResponse.json(
//       {
//         error: "Failed to connect to VPS",
//         details: error instanceof Error ? error.message : "Unknown error",
//         timestamp: Date.now(),
//       },
//       { status: 500 },
//     )
//   }
// }
