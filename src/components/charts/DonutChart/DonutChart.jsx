import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './DonutChart.css'

const DonutChart = ({ value = 65, color = '#4361ee' }) => {
  const data = [
    { name: 'Completed', value },
    { name: 'Remaining', value: 100 - value },
  ]
  const COLORS = [color, '#e2e8f0']

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-wrapper">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie 
              data={data} 
              innerRadius={40} 
              outerRadius={60} 
              dataKey="value" 
              startAngle={90} 
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-chart-center">
          <span className="donut-chart-value">{value}%</span>
          <span className="donut-chart-label">Complete</span>
        </div>
      </div>
      <div className="donut-chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: color }}></span>
          <span className="legend-text">Completed ({value}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#e2e8f0' }}></span>
          <span className="legend-text">Remaining ({100 - value}%)</span>
        </div>
      </div>
    </div>
  )
}

export default DonutChart
