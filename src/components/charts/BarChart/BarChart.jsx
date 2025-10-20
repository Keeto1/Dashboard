import React from 'react'
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const BarChart = ({ data, height = 300, bars = [{ dataKey: 'value', fill: '#4361ee' }] }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar 
            key={index} 
            dataKey={bar.dataKey} 
            fill={bar.fill} 
            radius={[8, 8, 0, 0]}
            name={bar.name || bar.dataKey}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
