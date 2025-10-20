import React, { useState, useEffect } from 'react'
import './Performance.css'
import LineChart from '../../charts/LineChart/LineChart'
import Loading from '../../common/Loading/Loading'
import { getPerformanceData } from '../../../services/dashboard'

const Performance = () => {
  const [loading, setLoading] = useState(true)
  const [performanceMetrics, setPerformanceMetrics] = useState([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await getPerformanceData()
        if (!mounted) return
        setPerformanceMetrics(data || [])
      } catch (err) {
        console.error('Failed to load performance data', err)
        if (!mounted) return
        setPerformanceMetrics([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className="performance">
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Loading />
        </div>
      </section>
    )
  }

  return (
    <section className="performance">
      <h2 className="section-title">Performance Metrics</h2>
      <div className="performance-grid">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="performance-card">
            <div className="performance-card__header">
              <h4>{metric.title}</h4>
              <span className={`badge badge--${metric.status}`}>{metric.status}</span>
            </div>
            <div className="performance-card__value">
              <span className="value">{metric.value}</span>
              <span className={`change ${metric.trend === 'up' ? 'positive' : 'negative'}`}>
                {metric.change}%
              </span>
            </div>
            <div className="performance-card__chart">
              <LineChart data={metric.data} height={60} stroke={metric.color} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Performance
