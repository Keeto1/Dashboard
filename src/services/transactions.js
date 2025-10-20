import { apiGet, apiPost } from '../utils/api'
import { ENDPOINTS } from '../config/api'

/**
 * Get all transactions
 * Backend endpoint: GET /api/transactions
 * Query params: ?page=1&limit=50&status=completed
 */
export async function getTransactions(params = {}) {
  const query = new URLSearchParams(params).toString()
  const endpoint = query ? `${ENDPOINTS.TRANSACTIONS}?${query}` : ENDPOINTS.TRANSACTIONS
  return apiGet(endpoint)
}

/**
 * Get transaction by ID
 * Backend endpoint: GET /api/transactions/:id
 */
export async function getTransactionById(id) {
  return apiGet(ENDPOINTS.TRANSACTION_BY_ID(id))
}

/**
 * Export transactions
 * Backend endpoint: POST /api/transactions/export
 * Body: { format: 'csv' | 'pdf', filters: {} }
 */
export async function exportTransactions(format = 'csv', filters = {}) {
  return apiPost(ENDPOINTS.EXPORT_TRANSACTIONS, { format, filters })
}

/**
 * Transaction data structure expected from backend:
 * {
 *   id: string,
 *   date: string (ISO 8601),
 *   customer: string,
 *   amount: number,
 *   status: 'completed' | 'pending' | 'failed',
 *   type: 'payment' | 'refund',
 *   createdAt: string,
 *   updatedAt: string
 * }
 */
