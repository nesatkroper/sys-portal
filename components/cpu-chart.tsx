// components/CpuChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CpuChartProps {
  data: {
    cpuUsage?: string;
    loadAvg?: string;
    topProcesses?: string;
  };
}

export default function CpuChart({ data }: CpuChartProps) {
  // Parse CPU usage data
  const parseCpuUsage = (cpuStr?: string) => {
    if (!cpuStr) return [];
    
    // Example format: "%Cpu(s):  5.3 us,  0.8 sy,  0.0 ni, 93.6 id,  0.0 wa,  0.0 hi,  0.3 si,  0.0 st"
    const matches = cpuStr.match(/(\d+\.\d+)/g);
    if (!matches || matches.length < 4) return [];
    
    const [user, system, idle] = matches;
    return [
      { name: 'User', value: parseFloat(user) },
      { name: 'System', value: parseFloat(system) },
      { name: 'Idle', value: parseFloat(idle) },
    ];
  };

  const cpuData = parseCpuUsage(data.cpuUsage);

  const chartData = {
    labels: cpuData.map(d => d.name),
    datasets: [
      {
        label: 'CPU Usage %',
        data: cpuData.map(d => d.value),
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} />;
}