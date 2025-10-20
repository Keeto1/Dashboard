import { apiGet, apiPut } from '../utils/api'
import { ENDPOINTS } from '../config/api'

/**
 * Get user settings
 * Backend endpoint: GET /api/settings
 */
export async function getSettings() {
  return apiGet(ENDPOINTS.SETTINGS)
}

/**
 * Update user settings
 * Backend endpoint: PUT /api/settings
 * Body: { notifications, emailAlerts, language, timezone, theme }
 */
export async function updateSettings(settings) {
  return apiPut(ENDPOINTS.UPDATE_SETTINGS, settings)
}

/**
 * Settings data structure expected from backend:
 * {
 *   notifications: boolean,
 *   emailAlerts: boolean,
 *   autoSave: boolean,
 *   language: string,
 *   timezone: string,
 *   theme: 'light' | 'dark'
 * }
 */
