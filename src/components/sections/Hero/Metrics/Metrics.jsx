import React, { useEffect, useState } from 'react'
import StatsCard from '../../../common/StatsCard/StatsCard'
import './Metrics.css'
import DonutChart from '../../../charts/DonutChart/DonutChart'
import LineChart from '../../../charts/LineChart/LineChart'
import Loading from '../../../common/Loading/Loading'
import { getMetrics, getTraffic, getDonutValue } from '../../../../services/dashboard'

const Metrics = () => {
  const [loading, setLoading] = useState(true)
  const [metricsData, setMetricsData] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [donutValue, setDonutValue] = useState(0)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const [metricsResp, trafficResp, donutResp] = await Promise.all([
          getMetrics(),
          getTraffic(),
          getDonutValue(),
        ])

        if (!mounted) return
        setMetricsData(metricsResp)
        setTrafficData(trafficResp)
        setDonutValue(donutResp)
      } catch (err) {
        console.error('Failed to load mock data', err)
        if (!mounted) return
        setMetricsData([])
        setTrafficData([])
        setDonutValue(0)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="metrics">
      {loading ? (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Loading size={48} />
        </div>
      ) : (
        <>
          <div className="metrics-grid">
            {metricsData.map((metric, index) => (
              <StatsCard
                key={metric.id || index}
                title={metric.title}
                value={metric.value}
                change={(typeof metric.change === 'number' ? (metric.change > 0 ? `+${metric.change}` : `${metric.change}`) : metric.change)}
                trend={metric.trend}
                color={metric.color}
                icon={metric.icon}
              />
            ))}
          </div>

          <div className="metrics-charts">
            <div className="metrics-chart__item">
              <h4>Total Share</h4>
              <DonutChart value={donutValue} />
            </div>

            <div className="metrics-chart__item">
              <h4>Traffic (last 5)</h4>
              <LineChart data={trafficData} height={80} />
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Metrics