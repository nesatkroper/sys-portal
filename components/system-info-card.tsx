"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Cpu, MemoryStick, HardDrive, Clock, Zap } from "lucide-react"

interface SystemInfoProps {
  metrics: {
    cpu: { cores: number; usage: number }
    memory: { total: number; usage: number }
    disk: { total: number; usage: number }
    system?: { uptime: number }
  }
  status: {
    status: string
    responseTime?: number
  }
}

export function SystemInfoCard({ metrics, status }: SystemInfoProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 GB"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)

    if (days > 0) {
      return `${days} days, ${hours} hours`
    } else if (hours > 0) {
      return `${hours} hours`
    } else {
      return `${Math.floor(seconds / 60)} minutes`
    }
  }

  const getPerformanceLevel = () => {
    const avgUsage = (metrics.cpu.usage + metrics.memory.usage + metrics.disk.usage) / 3
    if (avgUsage < 30) return { level: "Excellent", color: "bg-green-500" }
    if (avgUsage < 60) return { level: "Good", color: "bg-blue-500" }
    if (avgUsage < 80) return { level: "Fair", color: "bg-amber-500" }
    return { level: "Poor", color: "bg-red-500" }
  }

  const performance = getPerformanceLevel()

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          System Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{metrics.cpu.cores} CPU Cores</p>
                <p className="text-xs text-muted-foreground">{metrics.cpu.usage.toFixed(1)}% usage</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{formatBytes(metrics.memory.total)} RAM</p>
                <p className="text-xs text-muted-foreground">{metrics.memory.usage.toFixed(1)}% usage</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{formatBytes(metrics.disk.total)} Storage</p>
                <p className="text-xs text-muted-foreground">{metrics.disk.usage.toFixed(1)}% usage</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.system ? formatUptime(metrics.system.uptime) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <Badge variant="outline" className={`${performance.color}/10 text-white border-${performance.color}/20`}>
              {performance.level}
            </Badge>
          </div>

          {status.responseTime && (
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Response Time</span>
              <span className="font-medium">{status.responseTime}ms</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}





// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Server, Cpu, MemoryStick, HardDrive, Clock, Zap } from "lucide-react"

// interface SystemInfoProps {
//   metrics: {
//     cpu: { cores: number; usage: number }
//     memory: { total: number; usage: number }
//     disk: { total: number; usage: number }
//     uptime: number
//   }
//   status: {
//     status: string
//     responseTime?: number
//   }
// }

// export function SystemInfoCard({ metrics, status }: SystemInfoProps) {
//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return "0 GB"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
//   }

//   const formatUptime = (seconds: number) => {
//     const days = Math.floor(seconds / 86400)
//     const hours = Math.floor((seconds % 86400) / 3600)

//     if (days > 0) {
//       return `${days} days, ${hours} hours`
//     } else if (hours > 0) {
//       return `${hours} hours`
//     } else {
//       return `${Math.floor(seconds / 60)} minutes`
//     }
//   }

//   const getPerformanceLevel = () => {
//     const avgUsage = (metrics.cpu.usage + metrics.memory.usage + metrics.disk.usage) / 3
//     if (avgUsage < 30) return { level: "Excellent", color: "bg-green-500" }
//     if (avgUsage < 60) return { level: "Good", color: "bg-blue-500" }
//     if (avgUsage < 80) return { level: "Fair", color: "bg-amber-500" }
//     return { level: "Poor", color: "bg-red-500" }
//   }

//   const performance = getPerformanceLevel()

//   return (
//     <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-200 dark:border-blue-800">
//       <CardHeader className="pb-3">
//         <CardTitle className="flex items-center gap-2">
//           <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
//             <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//           </div>
//           System Overview
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <Cpu className="h-4 w-4 text-orange-500" />
//               <div>
//                 <p className="text-sm font-medium">{metrics.cpu.cores} CPU Cores</p>
//                 <p className="text-xs text-muted-foreground">{metrics.cpu.usage.toFixed(1)}% usage</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <MemoryStick className="h-4 w-4 text-purple-500" />
//               <div>
//                 <p className="text-sm font-medium">{formatBytes(metrics.memory.total)} RAM</p>
//                 <p className="text-xs text-muted-foreground">{metrics.memory.usage.toFixed(1)}% usage</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <HardDrive className="h-4 w-4 text-green-500" />
//               <div>
//                 <p className="text-sm font-medium">{formatBytes(metrics.disk.total)} Storage</p>
//                 <p className="text-xs text-muted-foreground">{metrics.disk.usage.toFixed(1)}% usage</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Clock className="h-4 w-4 text-blue-500" />
//               <div>
//                 <p className="text-sm font-medium">Uptime</p>
//                 <p className="text-xs text-muted-foreground">{formatUptime(metrics.uptime)}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="pt-3 border-t">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Zap className="h-4 w-4 text-amber-500" />
//               <span className="text-sm font-medium">Performance</span>
//             </div>
//             <Badge variant="outline" className={`${performance.color}/10 text-white border-${performance.color}/20`}>
//               {performance.level}
//             </Badge>
//           </div>

//           {status.responseTime && (
//             <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
//               <span>Response Time</span>
//               <span className="font-medium">{status.responseTime}ms</span>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
