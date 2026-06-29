import React from 'react';
import { Users, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function RiskSummaryCard({ stats }) {
  const { total, critical, high, medium, low } = stats;

  const cards = [
    { title: 'Total Students', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Critical Risk', value: critical, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'High Risk', value: high, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Low Risk', value: low, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className={`${c.bg} ${c.color} w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
            <c.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{c.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
