import React, { useState, useEffect } from 'react'
import './Team.css'
import Loading from '../../common/Loading/Loading'
import { getTeamMembers } from '../../../services/dashboard'

const Team = () => {
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await getTeamMembers()
        if (!mounted) return
        setTeamMembers(data || [])
      } catch (err) {
        console.error('Failed to load team members', err)
        if (!mounted) return
        setTeamMembers([])
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
      <section className="team">
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Loading />
        </div>
      </section>
    )
  }

  return (
    <section className="team">
      <h2 className="section-title">Team Members</h2>
      <div className="team-list">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <div className="team-member__avatar" style={{ backgroundColor: member.color }}>
              {member.initials}
            </div>
            <div className="team-member__info">
              <h4 className="team-member__name">{member.name}</h4>
              <p className="team-member__role">{member.role}</p>
            </div>
            <div className="team-member__status">
              <span className={`status-dot ${member.online ? 'online' : 'offline'}`}></span>
              <span className="status-text">{member.online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Team
