// pages/api/disk-stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { execSSH } from '@/lib/ssh-utils';

type DiskStatsResponse = {
  diskUsage?: string;
  ioStats?: string;
  inodeUsage?: string;
  largeDirs?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiskStatsResponse>
) {
  const commands = [
    'df -h',
    'iostat -dx 1 1',
    'df -i',
    'du -sh /var/* | sort -rh | head -n 5'
  ];
  
  const results = await Promise.all(commands.map(cmd => execSSH(cmd)));
  
  if (results.some(result => !result.success)) {
    const error = results.find(r => !r.success)?.error;
    return res.status(500).json({ error: error || 'Disk stats fetch failed' });
  }
  
  res.status(200).json({
    diskUsage: results[0].output,
    ioStats: results[1].output,
    inodeUsage: results[2].output,
    largeDirs: results[3].output
  });
}