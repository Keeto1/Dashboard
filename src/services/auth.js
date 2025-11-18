import { apiPost, apiGet } from '../utils/api'
import { ENDPOINTS } from '../config/api'

/**
 * Login user
 * Backend endpoint: POST /api/auth/login
 * Body: { email, password }
 */
export async function loginUser(email, password) {
  const response = await apiPost(ENDPOINTS.LOGIN, { email, password })
  if (response.token) {
    localStorage.setItem('authToken', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }
  return response
}

/**
 * Register user
 * Backend endpoint: POST /api/auth/register
 * Body: { email, password, name }
 */
export async function registerUser(email, password, userData) {
  const response = await apiPost(ENDPOINTS.LOGIN, { email, password, ...userData })
  if (response.token) {
    localStorage.setItem('authToken', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }
  return response
}

/**
 * Logout user
 * Backend endpoint: POST /api/auth/logout
 */
export async function logoutUser() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  try {
    await apiPost(ENDPOINTS.LOGOUT, {})
  } catch (err) {
    console.error('Logout error:', err)
  }
  return { success: true }
}

/**
 * Reset password
 * Backend endpoint: POST /api/auth/reset-password
 * Body: { email }
 */
export async function resetPassword(email) {
  return apiPost(ENDPOINTS.LOGIN, { email })
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Get auth token
 */
export function getAuthToken() {
  return localStorage.getItem('authToken')
}

/**
 * Auth state change listener
 */
export function onAuthChange(callback) {
  const user = getCurrentUser()
  callback(user)
  return () => {}
}

/**
 * Get user profile data
 * Backend endpoint: GET /api/auth/profile
 */
export async function getUserData(uid) {
  try {
    return await apiGet(ENDPOINTS.PROFILE)
  } catch (err) {
    console.error('Failed to get user data:', err)
    return getCurrentUser()
  }
}
