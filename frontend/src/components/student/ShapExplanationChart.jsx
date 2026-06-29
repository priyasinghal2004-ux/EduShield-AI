import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ShapExplanationChart({ shapValues }) {
  // Format data for Recharts, taking only the top 5 most impactful features
  const data = shapValues.slice(0, 5).map(item => ({
    name: item.feature,
    value: item.direction === 'negative' ? -Math.abs(item.value) : Math.abs(item.value),
    displayValue: Math.abs(item.value).toFixed(2),
    direction: item.direction,
    impact: Math.abs(item.value)
  })).reverse(); // Reverse so largest impact is at the top in a vertical bar chart

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
          <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
          <p className="text-gray-600">
            Impact: <span className="font-medium text-gray-900">{data.displayValue}</span>
          </p>
          <p className={`${data.direction === 'positive' ? 'text-red-600' : 'text-green-600'} font-medium text-xs mt-1`}>
            {data.direction === 'positive' ? 'Increases Risk' : 'Decreases Risk'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#4b5563' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
          <ReferenceLine x={0} stroke="#e5e7eb" />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.direction === 'positive' ? '#ef4444' : '#22c55e'} 
                radius={entry.direction === 'positive' ? [0, 4, 4, 0] : [4, 0, 0, 4]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-8">
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-500"></div> Reduces Risk</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500"></div> Increases Risk</span>
      </div>
    </div>
  );
}
