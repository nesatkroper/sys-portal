// pages/api/network-stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { execSSH } from '@/lib/ssh-utils';

type NetworkStatsResponse = {
  bandwidthUsage?: string;
  socketStats?: string;
  pingResults?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NetworkStatsResponse>
) {
  const commands = [
    'vnstat --json',
    'ss -s',
    'ping -c 4 google.com | tail -n 2'
  ];
  
  const results = await Promise.all(commands.map(cmd => execSSH(cmd)));
  
  // Check if vnstat is installed
  if (results[0].output.includes("command not found")) {
    return res.status(400).json({ 
      error: 'vnstat not installed on server. Run: sudo apt install vnstat'
    });
  }
  
  if (results.some(result => !result.success)) {
    const error = results.find(r => !r.success)?.error;
    return res.status(500).json({ error: error || 'Network stats fetch failed' });
  }
  
  res.status(200).json({
    bandwidthUsage: results[0].output,
    socketStats: results[1].output,
    pingResults: results[2].output
  });
}