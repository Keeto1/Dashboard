import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api'
import { ENDPOINTS } from '../config/api'
import { normalizeUsers } from '../utils/responseNormalizer'

/**
 * Get all users
 * Backend endpoint: GET /api/users
 * Response: Array of user objects
 */
export async function getUsers() {
  const response = await apiGet(ENDPOINTS.USERS)
  return normalizeUsers(response)
}

/**
 * Get user by ID
 * Backend endpoint: GET /api/users/:id
 */
export async function getUserById(id) {
  return apiGet(ENDPOINTS.USER_BY_ID(id))
}

/**
 * Create new user
 * Backend endpoint: POST /api/users
 * Body: { name, email, role, status }
 */
export async function createUser(userData) {
  return apiPost(ENDPOINTS.USERS, userData)
}

/**
 * Update user
 * Backend endpoint: PUT /api/users/:id
 * Body: { name, email, role, status }
 */
export async function updateUser(id, userData) {
  return apiPut(ENDPOINTS.USER_BY_ID(id), userData)
}

/**
 * Delete user
 * Backend endpoint: DELETE /api/users/:id
 */
export async function deleteUser(id) {
  return apiDelete(ENDPOINTS.USER_BY_ID(id))
}

/**
 * User data structure expected from backend:
 * {
 *   id: number | string,
 *   name: string,
 *   email: string,
 *   role: string,
 *   status: 'active' | 'inactive',
 *   avatar?: string,
 *   initials?: string,
 *   createdAt?: string,
 *   updatedAt?: string
 * }
 */
