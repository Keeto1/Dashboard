// API Configuration
// Change this to your backend URL when ready
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// API Endpoints
export const ENDPOINTS = {
  // Dashboard
  METRICS: '/dashboard/metrics',
  TRAFFIC: '/dashboard/traffic',
  ACTIVITIES: '/dashboard/activities',
  ANALYTICS: '/dashboard/analytics',
  PERFORMANCE: '/dashboard/performance',
  TEAM: '/team/members',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id) => `/transactions/${id}`,
  EXPORT_TRANSACTIONS: '/transactions/export',
  
  // Settings
  SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
  
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000

// Use mock data (set to false when backend is ready)
export const USE_MOCK_DATA = true
