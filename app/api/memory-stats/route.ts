// pages/api/memory-stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { execSSH } from '@/lib/ssh-utils';

type MemoryStatsResponse = {
  memoryUsage?: string;
  vmStats?: string;
  topProcesses?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemoryStatsResponse>
) {
  const commands = [
    'free -m',
    'vmstat -s',
    'ps -eo pid,user,%mem,rss,comm --sort=-rss | head -n 6'
  ];
  
  const results = await Promise.all(commands.map(cmd => execSSH(cmd)));
  
  if (results.some(result => !result.success)) {
    const error = results.find(r => !r.success)?.error;
    return res.status(500).json({ error: error || 'Memory stats fetch failed' });
  }
  
  res.status(200).json({
    memoryUsage: results[0].output,
    vmStats: results[1].output,
    topProcesses: results[2].output
  });
}