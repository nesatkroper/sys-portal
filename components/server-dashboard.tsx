import useSWR from 'swr';
import MetricCard from './metric-card'; // Corrected import
import CpuChart from './cpu-chart';
import MemoryChart from './memory-chart';
import DiskChart from './disk-chart';
import NetworkChart from './network-chart';

// Define types for our API responses
type CpuStats = {
  cpuUsage: string;
  loadAvg: string;
  topProcesses: string;
  error?: string;
};

type MemoryStats = {
  memoryUsage: string;
  vmStats: string;
  topProcesses: string;
  error?: string;
};

type DiskStats = {
  diskUsage: string;
  ioStats: string;
  inodeUsage: string;
  largeDirs: string;
  error?: string;
};

type NetworkStats = {
  bandwidthUsage: string;
  socketStats: string;
  pingResults: string;
  error?: string;
};

// Helper function to extract a summary value from raw command output
const getSummaryValue = (output: string, type: 'cpu' | 'memory' | 'disk' | 'network') => {
  if (!output) return 'N/A';

  try {
    switch (type) {
      case 'cpu':
        const cpuMatch = output.match(/(\d+\.\d+)%\s+id/);
        return cpuMatch ? `${(100 - parseFloat(cpuMatch[1])).toFixed(1)}%` : 'N/A';

      case 'memory':
        const memMatch = output.match(/Mem:\s+(\d+)\s+\d+\s+(\d+)/);
        return memMatch ? `${Math.round((parseInt(memMatch[2]) / parseInt(memMatch[1]) * 100))}%` : 'N/A';

      case 'disk':
        const diskMatch = output.split('\n')[1]?.match(/(\d+)%/);
        return diskMatch ? `${diskMatch[1]}%` : 'N/A';

      case 'network':
        const netMatch = output.match(/"rx":{"total":(\d+)/);
        return netMatch ? `${(parseInt(netMatch[1]) / 1024 / 1024).toFixed(2)} MB` : 'N/A';

      default:
        return 'N/A';
    }
  } catch {
    return 'N/A';
  }
};

export default function ServerDashboard() {
  const { data: cpu } = useSWR<CpuStats>('/api/cpu-stats');
  const { data: memory } = useSWR<MemoryStats>('/api/memory-stats');
  const { data: disk } = useSWR<DiskStats>('/api/disk-stats');
  const { data: network } = useSWR<NetworkStats>('/api/network-stats');

  // Show loading state
  if (!cpu || !memory || !disk || !network) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if any API failed
  if (cpu.error || memory.error || disk.error || network.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load server stats: {cpu.error || memory.error || disk.error || network.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="CPU Usage"
        value={getSummaryValue(cpu?.cpuUsage, 'cpu')}
        status={parseFloat(getSummaryValue(cpu?.cpuUsage, 'cpu')) > 80 ? 'critical' : 'normal'}
      >
        <CpuChart data={cpu} />
      </MetricCard>

      <MetricCard
        title="Memory Usage"
        value={getSummaryValue(memory?.memoryUsage, 'memory')}
        status={parseFloat(getSummaryValue(memory?.memoryUsage, 'memory')) > 80 ? 'critical' : 'normal'}
      >
        <MemoryChart data={memory} />
      </MetricCard>

      <MetricCard
        title="Disk Usage"
        value={getSummaryValue(disk.diskUsage, 'disk')}
        status={parseFloat(getSummaryValue(disk.diskUsage, 'disk')) > 90 ? 'critical' : 'normal'}
      >
        <DiskChart data={disk} />
      </MetricCard>

      <MetricCard
        title="Network Traffic"
        value={getSummaryValue(network.bandwidthUsage, 'network')}
        status="normal"
      >
        <NetworkChart data={network} />
      </MetricCard>
    </div>
  );
}

