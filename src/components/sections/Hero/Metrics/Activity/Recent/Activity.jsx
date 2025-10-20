import React, { useEffect, useState } from 'react'
import './Activity.css'
import Loading from '../../../../../common/Loading/Loading'
import { getActivities } from '../../../../../../services/dashboard'

const Activity = () => {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const resp = await getActivities()
        if (!mounted) return
        setActivities(resp)
      } catch (err) {
        console.error('Failed to load activities', err)
        if (!mounted) return
        setActivities([])
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
    <section className="activity">
      <h2 className="section-title">Recent Activity</h2>
      {loading ? (
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Loading />
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-time">{activity.time}</div>
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-user">{activity.user}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Activity