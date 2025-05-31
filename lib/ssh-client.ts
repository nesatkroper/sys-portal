import { Client } from "ssh2"

export interface SSHConfig {
  host: string
  port: number
  username: string
  password?: string
  privateKey?: Buffer
}

export class VPSSSHClient {
  private config: SSHConfig

  constructor(config: SSHConfig) {
    this.config = config
  }

  async executeCommand(command: string, timeout = 15000): Promise<string> {
    return new Promise((resolve, reject) => {
      const conn = new Client()
      let isResolved = false

      const cleanup = () => {
        if (!isResolved) {
          isResolved = true
          conn.end()
        }
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error(`Command timeout after ${timeout}ms`))
      }, timeout)

      conn
        .on("ready", () => {
          conn.exec(command, (err, stream) => {
            if (err) {
              cleanup()
              clearTimeout(timeoutId)
              reject(err)
              return
            }

            let output = ""
            let errorOutput = ""

            stream
              .on("close", (code: number) => {
                cleanup()
                clearTimeout(timeoutId)
                if (code === 0) {
                  resolve(output.trim())
                } else {
                  reject(new Error(`Command failed with exit code ${code}: ${errorOutput}`))
                }
              })
              .on("data", (data: Buffer) => {
                output += data.toString()
              })
              .stderr.on("data", (data: Buffer) => {
                errorOutput += data.toString()
              })
          })
        })
        .on("error", (err) => {
          cleanup()
          clearTimeout(timeoutId)
          reject(err)
        })

      try {
        conn.connect({
          host: this.config.host,
          port: this.config.port,
          username: this.config.username,
          password: this.config.password,
          privateKey: this.config.privateKey,
          readyTimeout: 10000,
          keepaliveInterval: 0,
        })
      } catch (error) {
        cleanup()
        clearTimeout(timeoutId)
        reject(error)
      }
    })
  }

  async testConnection(): Promise<{ success: boolean; responseTime: number; error?: string }> {
    const startTime = Date.now()
    try {
      await this.executeCommand('echo "connection_test"', 8000)
      return {
        success: true,
        responseTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
