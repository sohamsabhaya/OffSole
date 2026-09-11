import api from './client';

/**
 * Admin Dashboard API Service
 */
export const adminService = {
  /**
   * Fetch Sales and store overview statistics
   */
  async getStats() {
    const response = await api.get('/api/admin/stats/');
    return response.data;
  },

  /**
   * Fetch aggregated analytics: brand, gender, colour, monthly breakdown
   */
  async getAnalytics() {
    const response = await api.get('/api/admin/analytics/');
    return response.data;
  },

  /**
   * Fetch flat sales log: one row per item sold
   */
  async getSalesLog() {
    const response = await api.get('/api/admin/sales-log/');
    return response.data;
  },

  /**
   * Add a new sneaker to the catalog
   */
  async createProduct(productData) {
    const response = await api.post('/api/admin/products/', productData);
    return response.data;
  },

  /**
   * Update an existing sneaker
   */
  async updateProduct(productId, productData) {
    const response = await api.put(`/api/admin/products/${productId}/`, productData);
    return response.data;
  },

  /**
   * Delete a sneaker from the catalog
   */
  async deleteProduct(productId) {
    const response = await api.delete(`/api/admin/products/${productId}/`);
    return response.data;
  },
};

export default adminService;
