import React from 'react'
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

const LineChart = ({ points = [10, 30, 20, 50, 40], height = 80, stroke = '#06b6d4', data }) => {
  const chartData = data ? data : points.map((p, i) => ({ name: `${i + 1}`, value: p }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#f5f5f5" vertical={false} />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={{ r: 3 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChart
