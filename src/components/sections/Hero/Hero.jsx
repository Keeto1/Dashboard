import React from 'react'
import './Hero.css'

const Hero = ({ onNavigate }) => {
  const handleDownloadReport = () => {
    alert('Generating report... This will download a PDF file.')
    // TODO: Implement actual report download
  }

  const handleViewAnalytics = () => {
    if (onNavigate) {
      onNavigate('Analytics')
    }
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome back, John!</h1>
        <p className="hero-subtitle">Here's what's happening with your store today.</p>
      </div>
      <div className="hero-actions">
        <button className="btn btn--primary" onClick={handleDownloadReport}>
          📥 Download Report
        </button>
        <button className="btn btn--secondary" onClick={handleViewAnalytics}>
          📊 View Analytics
        </button>
      </div>
    </section>
  )
}

export default Hero
