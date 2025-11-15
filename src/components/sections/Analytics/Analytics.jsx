'use client'
import React, { useState, useEffect, useRef } from 'react'
import './Analytics.css'
import AreaChart from '../../charts/AreaChart/AreaChart'
import BarChart from '../../charts/BarChart/BarChart'
import Loading from '../../common/Loading/Loading'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [filter, setFilter] = useState('7')
  const intervalRef = useRef(null)

  const load = async () => {
    try {
      // Always show loading on refresh, optional
      setLoading(true)
      console.log('Fetching analytics from: http://localhost:4000/api/analytics?days=' + filter)
      const response = await fetch(`http://localhost:4000/api/analytics?days=${filter}`)
      console.log('Response status:', response.status)
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

      const data = await response.json()
      console.log('Analytics data received:', data)
      setRevenueData(data.revenue || [])
      setCategoryData(data.categories || [])
    } catch (err) {
      console.error('Failed to load analytics data:', err)
      setRevenueData([])
      setCategoryData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // Run on mount
    load()

    // Poll every 10 seconds for real-time updates
    intervalRef.current = setInterval(() => {
      if (mounted) load()
    }, 10000) // 10 seconds

    // Clean up interval on unmount
    return () => {
      mounted = false
      clearInterval(intervalRef.current)
    }
  }, [filter])

  if (loading && (!revenueData.length || !categoryData.length)) {
    return (
      <section className="analytics">
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Loading size={48} />
        </div>
      </section>
    )
  }

  return (
    <section className="analytics">
      <div className="analytics-grid">
        {/* Revenue Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3>Revenue Overview</h3>
            <select
              className="date-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="analytics-card__content">
            <AreaChart data={revenueData} height={300} dataKey="revenue" />
          </div>
        </div>

        {/* Category Chart */}
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3>Sales by Category</h3>
          </div>
          <div className="analytics-card__content">
            <BarChart
              data={categoryData}
              height={300}
              bars={[
                { dataKey: 'sales', fill: '#4361ee', name: 'Sales' },
                { dataKey: 'target', fill: '#e2e8f0', name: 'Target' },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Analytics
