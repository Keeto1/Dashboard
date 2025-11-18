import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api'

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

/**
 * API Error Class
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timeout = options.timeout || REQUEST_TIMEOUT
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(id)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return response
  } catch (error) {
    clearTimeout(id)
    
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408, null)
    }
    
    if (error instanceof APIError) {
      throw error
    }
    
    throw new APIError(error.message || 'Network error', 0, null)
  }
}

/**
 * GET request
 */
export async function apiGet(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  console.log('[API] GET request:', url)
  try {
    const response = await fetchWithTimeout(url, {
      method: HTTP_METHODS.GET,
      ...options,
    })
    const data = await response.json()
    console.log('[API] GET response:', data)
    return data
  } catch (error) {
    console.error('[API] GET error:', error.message)
    throw error
  }
}

/**
 * POST request
 */
export async function apiPost(endpoint, data, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetchWithTimeout(url, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(data),
    ...options,
  })
  return response.json()
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetchWithTimeout(url, {
    method: HTTP_METHODS.PUT,
    body: JSON.stringify(data),
    ...options,
  })
  return response.json()
}

/**
 * PATCH request
 */
export async function apiPatch(endpoint, data, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetchWithTimeout(url, {
    method: HTTP_METHODS.PATCH,
    body: JSON.stringify(data),
    ...options,
  })
  return response.json()
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetchWithTimeout(url, {
    method: HTTP_METHODS.DELETE,
    ...options,
  })
  return response.json()
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use apiGet instead
 */
export async function getJSON(url, options = {}) {
  const controller = new AbortController()
  const timeout = options.timeout || REQUEST_TIMEOUT
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(id)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    return await res.json()
  } catch (err) {
    clearTimeout(id)
    throw err
  }
}
