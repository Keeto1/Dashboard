import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'
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

// Dashboard Layout Component
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < 768

  // Start open on desktop, closed on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="content">
          {children}
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

// Dashboard Home Component
function DashboardHome() {
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

// Analytics Page Component
function AnalyticsPage() {
  return (
    <>
      <Analytics />
      <Performance />
      <div className="grid-layout">
        <Activity />
      </div>
    </>
  )
}

function App() {
  const { isAuthenticated, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="80"
              strokeDashoffset="60"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 24 24"
                to="360 24 24"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4361ee" />
                <stop offset="100%" stopColor="#7209b7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="loading-text">Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes - Redirect to dashboard if already logged in */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes - Require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings theme={theme} onToggleTheme={toggleTheme} />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Root Route - Redirect based on authentication */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />

      {/* 404 - Redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App