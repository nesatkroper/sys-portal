// components/DiskChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DiskData {
  filesystem: string;
  size: string;
  used: string;
  available: string;
  usePercent: string;
  mounted: string;
}

interface DiskChartProps {
  data: {
    diskUsage?: string;
    ioStats?: string;
    inodeUsage?: string;
    largeDirs?: string;
  };
}

export default function DiskChart({ data }: DiskChartProps) {
  // Parse disk usage from 'df -h' output with proper typing
  const parseDiskUsage = (diskStr?: string): DiskData[] => {
    if (!diskStr) return [];
    
    return diskStr.split('\n')
      .slice(1) // Skip header row
      .map(line => {
        const parts = line.split(/\s+/);
        if (parts.length < 6) return null;
        
        return {
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
          usePercent: parts[4].replace('%', ''),
          mounted: parts[5],
        };
      })
      .filter((d): d is DiskData => d !== null); // Type guard to filter out nulls
  };

  const diskData = parseDiskUsage(data.diskUsage);

  // Prepare chart data with null checks
  const chartData = {
    labels: diskData.map(d => d.mounted),
    datasets: [
      {
        label: 'Disk Usage %',
        data: diskData.map(d => parseFloat(d.usePercent)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} options={{
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const disk = diskData[dataIndex];
            return [
              `Filesystem: ${disk.filesystem}`,
              `Size: ${disk.size}`,
              `Used: ${disk.used}`,
              `Available: ${disk.available}`,
              `Usage: ${disk.usePercent}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Usage Percentage'
        }
      }
    }
  }} />;
}