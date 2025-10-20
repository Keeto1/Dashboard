import React, { useState } from 'react'
import './StatsCard.css'

const StatsCard = ({ title, value, change, icon, trend = 'up', color = 'primary' }) => {
  const [open, setOpen] = useState(false)
  const trendClass = trend === 'up' ? 'trend-up' : 'trend-down'

  return (
    <div className={`stats-card stats-card--${color}`} onClick={() => setOpen(!open)} role="button" tabIndex={0}>
      <div className="stats-card__content">
        <div className="stats-card__info">
          <h3 className="stats-card__title">{title}</h3>
          <div className="stats-card__value">{value}</div>
          <div className={`stats-card__change ${trendClass}`}>
            {change}% {trend === 'up' ? '↗' : '↘'}
          </div>
        </div>
        
        <div className="stats-card__icon">
          {icon}
        </div>
      </div>

      {open && (
        <div className="stats-card__details">
          <small>More details: last 7 days trend and breakdown.</small>
        </div>
      )}
    </div>
  )
}

export default StatsCard