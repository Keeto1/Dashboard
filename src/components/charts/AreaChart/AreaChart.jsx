import React from 'react'
import {
  ResponsiveContainer,
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const AreaChart = ({ data, height = 300, dataKey = 'value', fill = '#4361ee', stroke = '#3a56d4' }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
            <stop offset="95%" stopColor={fill} stopOpacity={0.1} />
          </linearGradient>
        </defs>
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
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={stroke}
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#color-${dataKey})`}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChart
