/**
 * Response Normalizer Utility
 * Handles normalizing backend response formats to frontend expectations
 * 
 * Backend response format: { value: [...], Count: N }
 * Frontend expectation: [...]
 * 
 * Also maps MongoDB _id to id, and normalizes field names
 */

/**
 * Unwrap backend response wrapper { value: [...], Count: N }
 * Returns the array directly
 * @param {any} response - Backend response
 * @returns {any[]} Unwrapped array or original response if already an array
 */
export function unwrapResponse(response) {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (response.value && Array.isArray(response.value)) return response.value
  return response
}

/**
 * Map MongoDB _id to id for each item in array
 * @param {any[]} items - Array of items with potential _id field
 * @returns {any[]} Items with _id mapped to id
 */
export function mapIdField(items) {
  if (!Array.isArray(items)) return items
  return items.map(item => {
    if (item._id && !item.id) {
      return { ...item, id: item._id }
    }
    return item
  })
}

/**
 * Normalize response for metrics
 * Expects: array of { id, title, value, change, trend, color, icon? }
 * Returns: array with all required fields
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeMetrics(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return items.map((item, index) => ({
    id: item.id || item._id || `metric-${index}`,
    title: item.title || '',
    value: item.value || '0',
    change: typeof item.change === 'number' ? item.change : 0,
    trend: item.trend || 'up',
    color: item.color || 'primary',
    icon: item.icon || '📊'
  }))
}

/**
 * Normalize response for transactions
 * Expects: array of { id, date, customer, amount, status, type, ... }
 * Returns: array with all required fields and type coerced to string
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeTransactions(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return mapIdField(items).map(item => ({
    id: item.id || item._id || '',
    date: item.date || new Date().toISOString().split('T')[0],
    customer: item.customer || item.name || 'Unknown',
    amount: typeof item.amount === 'number' ? item.amount : (typeof item.value === 'number' ? item.value : 0),
    status: item.status || 'pending',
    type: item.type || 'payment',
    createdAt: item.createdAt || item.date,
    updatedAt: item.updatedAt || item.date,
    category: item.category || 'Other'
  }))
}

/**
 * Normalize response for users
 * Expects: array of { id, name, email, role, status, avatar?, ... }
 * Returns: array with all required fields
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeUsers(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return mapIdField(items).map(item => ({
    id: item.id || item._id || '',
    name: item.name || 'Unknown',
    email: item.email || '',
    role: item.role || 'User',
    status: item.status || 'active',
    avatar: item.avatar || '',
    initials: item.initials || getInitials(item.name || 'Unknown'),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  }))
}

/**
 * Normalize response for team members
 * Expects: array of { id, name, role, email?, status?, ... }
 * Returns: array with all required fields
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeTeam(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return mapIdField(items).map(item => ({
    id: item.id || item._id || '',
    name: item.name || 'Unknown',
    role: item.role || 'Team Member',
    email: item.email || '',
    status: item.status || 'active',
    initials: item.initials || getInitials(item.name || 'Unknown'),
    color: item.color || getColorForInitials(item.initials || getInitials(item.name || 'Unknown')),
    online: item.online !== undefined ? item.online : false
  }))
}

/**
 * Normalize response for traffic/activities
 * Expects: array of objects with name/time and value fields
 * Returns: array normalized to { name, value } or { time, action, user }
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeTraffic(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return items.map(item => ({
    name: item.name || item.time || '',
    value: typeof item.value === 'number' ? item.value : (typeof item.sales === 'number' ? item.sales : 0),
    time: item.time,
    action: item.action,
    user: item.user
  }))
}

/**
 * Normalize response for activities
 * Expects: array of { time, action, user, ... }
 * Returns: array with all required fields
 * @param {any} response - Backend response
 * @returns {any[]}
 */
export function normalizeActivities(response) {
  const items = unwrapResponse(response)
  if (!Array.isArray(items)) return []
  
  return items.map(item => ({
    time: item.time || new Date().toISOString(),
    action: item.action || 'Activity',
    user: item.user || 'Unknown',
    type: item.type || 'info',
    icon: item.icon
  }))
}

/**
 * Helper: Generate initials from name
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Helper: Get consistent color from initials
 * @param {string} initials
 * @returns {string}
 */
function getColorForInitials(initials) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
  const charCode = (initials || 'U').charCodeAt(0)
  return colors[charCode % colors.length]
}
