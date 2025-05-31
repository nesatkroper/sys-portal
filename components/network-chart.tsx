// components/NetworkChart.tsx
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

interface NetworkChartProps {
  data: {
    bandwidthUsage?: string;
    socketStats?: string;
    pingResults?: string;
  };
}

export default function NetworkChart({ data }: NetworkChartProps) {
  // Parse vnstat JSON output
  const parseNetworkData = (jsonStr?: string) => {
    if (!jsonStr) return { labels: [], rx: [], tx: [] };
    
    try {
      const data = JSON.parse(jsonStr);
      const interfaces = data.interfaces || [];
      const firstInterface = interfaces[0] || {};
      const traffic = firstInterface.traffic || {};
      const daily = traffic.day || [];
      
      return {
        labels: daily.map((day: any) => day.date?.month + '/' + day.date?.day),
        rx: daily.map((day: any) => day.rx || 0),
        tx: daily.map((day: any) => day.tx || 0),
      };
    } catch {
      return { labels: [], rx: [], tx: [] };
    }
  };

  const { labels, rx, tx } = parseNetworkData(data.bandwidthUsage);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Download (MB)',
        data: rx.map((bytes: number) => bytes / 1024 / 1024),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Upload (MB)',
        data: tx.map((bytes: number) => bytes / 1024 / 1024),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
}