import api from './client';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Check current session authentication status
   */
  async checkStatus() {
    const response = await api.get('/api/auth/status/');
    return response.data;
  },

  /**
   * Login user with username & password
   */
  async login(credentials) {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  async signup(userData) {
    const response = await api.post('/api/auth/signup/', userData);
    return response.data;
  },

  /**
   * Logout user and clear session
   */
  async logout() {
    const response = await api.post('/api/auth/logout/');
    return response.data;
  },

  /**
   * Permanently delete user account and cart
   */
  async deleteAccount() {
    const response = await api.delete('/api/auth/delete-account/');
    return response.data;
  },
};

export default authService;
