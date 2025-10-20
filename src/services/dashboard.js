import { apiGet } from '../utils/api'
import { ENDPOINTS, USE_MOCK_DATA } from '../config/api'
import { getJSON } from '../utils/api'

/**
 * Get dashboard metrics
 * Backend should return array of metrics with structure:
 * { id, title, value, change, trend: 'up'|'down', color: 'primary'|'success'|'warning'|'info' }
 */
export async function getMetrics() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.metrics || []
  }
  return apiGet(ENDPOINTS.METRICS)
}

/**
 * Get traffic data
 * Backend should return array with structure:
 * { name: string, value: number }
 */
export async function getTraffic() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.traffic || []
  }
  return apiGet(ENDPOINTS.TRAFFIC)
}

/**
 * Get recent activities
 * Backend should return array with structure:
 * { time: string, action: string, user: string }
 */
export async function getActivities() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.activities || []
  }
  return apiGet(ENDPOINTS.ACTIVITIES)
}

/**
 * Get donut chart value (percentage)
 * Backend should return number between 0-100
 */
export async function getDonutValue() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.donutValue || 0
  }
  const data = await apiGet(ENDPOINTS.METRICS)
  return data.completionPercentage || 0
}

/**
 * Get analytics data
 * Backend should return object with structure:
 * { 
 *   revenue: [{ name: string, revenue: number }],
 *   categories: [{ name: string, sales: number, target: number }]
 * }
 */
export async function getAnalyticsData() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return {
      revenue: json.revenueData || [],
      categories: json.categoryData || [],
    }
  }
  return apiGet(ENDPOINTS.ANALYTICS)
}

/**
 * Get performance metrics
 * Backend should return array with structure:
 * { 
 *   title: string, 
 *   value: string, 
 *   change: number, 
 *   trend: 'up'|'down', 
 *   status: 'excellent'|'good'|'average'|'poor',
 *   color: string,
 *   data: [{ name: string, value: number }]
 * }
 */
export async function getPerformanceData() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.performance || []
  }
  return apiGet(ENDPOINTS.PERFORMANCE)
}

/**
 * Get team members
 * Backend should return array with structure:
 * { name: string, role: string, initials: string, color: string, online: boolean }
 */
export async function getTeamMembers() {
  if (USE_MOCK_DATA) {
    const json = await getJSON('/mock/data.json')
    return json.team || []
  }
  return apiGet(ENDPOINTS.TEAM)
}
