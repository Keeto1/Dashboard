import React, { useState, useEffect } from 'react'
import Header from './components/common/Header/Header'
import Sidebar from './components/common/Sidebar/Sidebar'
import Hero from './components/sections/Hero/Hero'
import Metrics from './components/sections/Hero/Metrics/Metrics'
import Activity from './components/sections/Hero/Metrics/Activity/Recent/Activity'
import Analytics from './components/sections/Analytics/Analytics'
import Performance from './components/sections/Performance/Performance'
import Team from './components/sections/Team/Team'
import Users from './components/pages/Users/Users'
import Transactions from './components/pages/Transactions/Transactions'
import Settings from './components/pages/Settings/Settings'
import { useWindowSize } from './hooks/useWindowSize'
import { useTheme } from './hooks/useTheme'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('Dashboard')
  const { width } = useWindowSize()
  const { theme, toggleTheme } = useTheme()
  const isMobile = width < 768

  // Start open on desktop, closed on mobile. Keep this in sync with window size changes.
  React.useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    // Close sidebar only on mobile after navigation to provide expected behavior
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <Metrics />
            <Analytics />
            <Performance />
            <div className="grid-layout">
              <Activity />
              <Team />
            </div>
          </>
        )
      case 'Analytics':
        return (
          <>
            <Analytics />
            <Performance />
            <div className="grid-layout">
              <Activity />
            </div>
          </>
        )
      case 'Users':
        return <Users />
      case 'Transactions':
        return <Transactions />
      case 'Settings':
        return <Settings theme={theme} onToggleTheme={toggleTheme} />
      default:
        return (
          <>
            <Hero />
            <Metrics />
            <Analytics />
            <Performance />
            <div className="grid-layout">
              <Activity />
              <Team />
            </div>
          </>
        )
    }
  }

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="content">
          {renderPage()}
        </main>
      </div>
      
      {sidebarOpen && isMobile && (
        <div 
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default App