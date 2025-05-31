// import SSH from 'ssh2-promise';
// import { NextResponse } from 'next/server';

// // Define your SSH config interface
// interface SSHConfig {
//   host: string;
//   port: number;  // Note: must be number, not string
//   username: string;
//   password: string;
//   readyTimeout?: number;
// }

// interface CpuStats {
//   cpuUsage: number;
//   loadAvg: number[];
//   topProcesses: Array<{
//     pid: number;
//     user: string;
//     cpu: number;
//     command: string;
//   }>;
// }

// const getSSHConfig = (): SSHConfig => {
//   const port = process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22;
//   if (isNaN(port)) {
//     throw new Error('SSH_PORT must be a valid number');
//   }

//   return {
//     host: process.env.SSH_HOST || '',
//     port: port,
//     username: process.env.SSH_USER || '',
//     password: process.env.SSH_PASSWORD || '',
//     readyTimeout: 5000,
//   };
// };

// async function execSSH(command: string): Promise<string> {
//   const config = getSSHConfig();
  
//   // Validate required fields
//   if (!config.host || !config.username || !config.password) {
//     throw new Error('Missing required SSH configuration');
//   }

//   const ssh = new SSH(config);
  
//   try {
//     await ssh.connect();
//     const result = await ssh.exec(command);
//     await ssh.close();
//     return result;
//   } catch (error) {
//     throw new Error(`SSH failed: ${error instanceof Error ? error.message : String(error)}`);
//   }
// }

// export async function GET() {
//   try {
//     const commands = [
//       "top -bn1 | grep '%Cpu(s)'",
//       'uptime',
//       'ps -eo pid,user,%cpu,comm --sort=-%cpu | head -n 6',
//     ];

//     const results = await Promise.all(
//       commands.map((cmd) => execSSH(cmd))
//     );

//     // Parse results
//     const cpuMatch = results[0].match(/(\d+\.\d+)%? id/);
//     const cpuUsage = cpuMatch ? 100 - parseFloat(cpuMatch[1]) : 0;
    
//     const loadMatch = results[1].match(/load average: ([\d.]+), ([\d.]+), ([\d.]+)/);
//     const loadAvg = loadMatch ? loadMatch.slice(1, 4).map(Number) : [0, 0, 0];
    
//     const topProcesses = results[2]
//       .split('\n')
//       .slice(1)
//       .filter(line => line.trim())
//       .map(line => {
//         const [pid, user, cpu, ...command] = line.trim().split(/\s+/);
//         return {
//           pid: Number(pid),
//           user,
//           cpu: Number(cpu),
//           command: command.join(' '),
//         };
//       });

//     return NextResponse.json({
//       cpuUsage,
//       loadAvg,
//       topProcesses,
//     }, { status: 200 });

//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     console.error('SSH Error:', errorMessage);
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }