
// components/MetricCard.tsx
import React from 'react';

type StatusType = 'normal' | 'warning' | 'critical';

interface MetricCardProps {
  title: string;
  value: string;
  status?: StatusType;
  tooltip?: string;
  children?: React.ReactNode; // Add children prop
}

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

export default function MetricCard({ 
  title, 
  value, 
  children,
  status = 'normal',
  tooltip 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {status && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.toUpperCase()}
          </span>
        )}
      </div>
      {children && (
        <div className="mt-4" style={{ height: '200px' }}>
          {children}
        </div>
      )}
      {tooltip && (
        <p className="mt-2 text-xs text-gray-500">{tooltip}</p>
      )}
    </div>
  );
}

// // components/MetricCard.tsx
// import React from 'react';

// type StatusType = 'normal' | 'warning' | 'critical';

// interface MetricCardProps {
//   title: string;
//   value: string;
//   children: React.ReactNode;
//   status?: StatusType;
//   tooltip?: string;
// }

// const statusColors = {
//   normal: 'bg-green-100 text-green-800',
//   warning: 'bg-yellow-100 text-yellow-800',
//   critical: 'bg-red-100 text-red-800',
// };

// export default function MetricCard({ 
//   title, 
//   value, 
//   children, 
//   status = 'normal',
//   tooltip 
// }: MetricCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//           <p className="text-2xl font-semibold mt-1">{value}</p>
//         </div>
//         {status && (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
//             {status.toUpperCase()}
//           </span>
//         )}
//       </div>
//       <div className="mt-4" style={{ height: '200px' }}>
//         {children}
//       </div>
//       {tooltip && (
//         <p className="mt-2 text-xs text-gray-500">{tooltip}</p>
//       )}
//     </div>
//   );
// }