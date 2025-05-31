// components/MemoryChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MemoryChartProps {
  data: {
    memoryUsage?: string;
    vmStats?: string;
    topProcesses?: string;
  };
}

export default function MemoryChart({ data }: MemoryChartProps) {
  // Parse memory data from 'free -m' output
  const parseMemoryUsage = (memStr?: string) => {
    if (!memStr) return { used: 0, free: 0, total: 0 };
    
    // Example format:
    //               total        used        free      shared  buff/cache   available
    // Mem:           7982        1503        4834          68        1644        6183
    const matches = memStr.match(/Mem:\s+(\d+)\s+(\d+)\s+(\d+)/);
    if (!matches) return { used: 0, free: 0, total: 0 };
    
    return {
      total: parseInt(matches[1]),
      used: parseInt(matches[2]),
      free: parseInt(matches[3]),
    };
  };

  const { used, free, total } = parseMemoryUsage(data.memoryUsage);

  const chartData = {
    labels: ['Used', 'Free'],
    datasets: [
      {
        data: [used, free],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="relative">
      <Doughnut data={chartData} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">
          {Math.round((used / total) * 100)}%
        </span>
      </div>
    </div>
  );
}