// API Base URL - Update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Token storage keys
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 401) {
          // Token expired or invalid
          this.removeToken()
          throw new Error(data.message || 'Authentication failed. Please login again.')
        }
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      // Network errors
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.')
      }
      throw error
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await this.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await this.apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await this.apiCall('/auth/me', {
        method: 'GET',
      })

      return response.user
    } catch (error) {
      throw new Error(error.message || 'Failed to get user data')
    }
  }

  // Logout
  async logout() {
    try {
      await this.apiCall('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await this.apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset email')
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await this.apiCall('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password: newPassword }),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password')
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await this.apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })

      if (response.token) {
        this.setToken(response.token)
      }

      return response
    } catch (error) {
      this.removeToken()
      throw new Error(error.message || 'Token refresh failed')
    }
  }

  // Token management
  setToken(token, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  setRefreshToken(token, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(REFRESH_TOKEN_KEY, token)
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY)
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken()
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await this.apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to change password')
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

export default authService