// API Configuration
// Change this to your backend URL when ready
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// API Endpoints
export const ENDPOINTS = {
  // Dashboard
  METRICS: '/dashboard/metrics',
  TRAFFIC: '/traffic',
  ACTIVITIES: '/dashboard/activities',
  // Note: backend exposes `/api/analytics` (no `/dashboard` prefix) on some setups
  ANALYTICS: '/analytics',
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
