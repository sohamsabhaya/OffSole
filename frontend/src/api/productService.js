import api from './client';

/**
 * Product & Sneaker Catalog Service
 */
export const productService = {
  /**
   * Fetch all products, optionally filtered by search term
   * @param {string} search
   */
  async getProducts(search = '') {
    const params = search ? { search } : {};
    const response = await api.get('/api/products/', { params });
    return response.data;
  },

  /**
   * Fetch single product detail by ID
   * @param {number|string} productId
   */
  async getProductDetail(productId) {
    const response = await api.get(`/api/products/${productId}/`);
    return response.data;
  },
};

export default productService;
