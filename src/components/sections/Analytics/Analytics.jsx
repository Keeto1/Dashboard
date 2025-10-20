import React, { useState, useEffect } from 'react'
import './Analytics.css'
import AreaChart from '../../charts/AreaChart/AreaChart'
import BarChart from '../../charts/BarChart/BarChart'
import Loading from '../../common/Loading/Loading'
import { getAnalyticsData } from '../../../services/dashboard'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState([])
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await getAnalyticsData()
        if (!mounted) return
        setRevenueData(data.revenue || [])
        setCategoryData(data.categories || [])
      } catch (err) {
        console.error('Failed to load analytics', err)
        if (!mounted) return
        setRevenueData([])
        setCategoryData([])
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
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3>Revenue Overview</h3>
            <select className="date-filter">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="analytics-card__content">
            <AreaChart data={revenueData} height={300} dataKey="revenue" />
          </div>
        </div>

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
