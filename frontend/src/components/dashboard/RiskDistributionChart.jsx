import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getRiskColor } from '../../utils/riskHelpers';

export default function RiskDistributionChart({ stats }) {
  const data = [
    { name: 'Critical', value: stats.critical, color: getRiskColor('critical') },
    { name: 'High', value: stats.high, color: getRiskColor('high') },
    { name: 'Medium', value: stats.medium, color: getRiskColor('medium') },
    { name: 'Low', value: stats.low, color: getRiskColor('low') },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} Students`, name]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
