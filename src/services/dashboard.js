import { apiGet } from '../utils/api'
import { ENDPOINTS } from '../config/api'
import { normalizeMetrics, normalizeTraffic, normalizeActivities, normalizeTeam } from '../utils/responseNormalizer'

/**
 * Get dashboard metrics
 * Backend should return array of metrics with structure:
 * { id, title, value, change, trend: 'up'|'down', color: 'primary'|'success'|'warning'|'info' }
 */
export async function getMetrics() {
  try {
    const response = await apiGet(ENDPOINTS.METRICS)
    return normalizeMetrics(response)
  } catch (err) {
    // If metrics endpoint isn't available on the backend, try to derive
    // high-level metrics from the analytics endpoint as a fallback.
    try {
      const analytics = await apiGet(ENDPOINTS.ANALYTICS)
      const summary = analytics.summary || {}
      const metrics = []
      if (typeof summary.totalRevenue !== 'undefined') {
        metrics.push({ id: 'revenue', title: 'Total Revenue', value: `$${summary.totalRevenue}`, change: summary.revenueChange || 0, trend: summary.revenueChange >= 0 ? 'up' : 'down', color: 'primary' })
      }
      if (typeof summary.transactionCount !== 'undefined') {
        metrics.push({ id: 'transactions', title: 'Transactions', value: `${summary.transactionCount}`, change: 0, trend: 'up', color: 'success' })
      }
      if (typeof summary.averageTransactionValue !== 'undefined') {
        metrics.push({ id: 'avg_tx', title: 'Avg. Transaction', value: `$${summary.averageTransactionValue}`, change: 0, trend: 'up', color: 'info' })
      }
      return normalizeMetrics(metrics)
    } catch (fallbackErr) {
      throw err
    }
  }
}

/**
 * Get traffic data
 * Backend should return array with structure:
 * { name: string, value: number }
 */
export async function getTraffic() {
  try {
    const response = await apiGet(ENDPOINTS.TRAFFIC)
    return normalizeTraffic(response)
  } catch (err) {
    // try alternate path
    if (err.status === 404) {
      try {
        const response = await apiGet('/dashboard/traffic')
        return normalizeTraffic(response)
      } catch (e) {
        throw err
      }
    }
    throw err
  }
}

/**
 * Get recent activities
 * Backend should return array with structure:
 * { time: string, action: string, user: string }
 */
export async function getActivities() {
  try {
    const response = await apiGet(ENDPOINTS.ACTIVITIES)
    return normalizeActivities(response)
  } catch (err) {
    if (err.status === 404) {
      try {
        const response = await apiGet('/activities')
        return normalizeActivities(response)
      } catch (e) {
        throw err
      }
    }
    throw err
  }
}

/**
 * Get donut chart value (percentage)
 * Backend should return number between 0-100
 */
export async function getDonutValue() {
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
  try {
    return await apiGet(ENDPOINTS.ANALYTICS)
  } catch (err) {
    if (err.status === 404) {
      try {
        return await apiGet('/dashboard/analytics')
      } catch (e) {
        throw err
      }
    }
    throw err
  }
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
  try {
    return await apiGet(ENDPOINTS.PERFORMANCE)
  } catch (err) {
    if (err.status === 404) {
      // try alternate path
      try {
        return await apiGet('/performance')
      } catch (e) {
        throw err
      }
    }
    throw err
  }
}

/**
 * Get team members
 * Backend should return array with structure:
 * { name: string, role: string, initials: string, color: string, online: boolean }
 */
export async function getTeamMembers() {
  try {
    const response = await apiGet(ENDPOINTS.TEAM)
    return normalizeTeam(response)
  } catch (err) {
    if (err.status === 404) {
      try {
        const response = await apiGet('/team')
        return normalizeTeam(response)
      } catch (e) {
        throw err
      }
    }
    throw err
  }
}
