import api from './client';

/**
 * Shopping Cart & Checkout Service
 */
export const cartService = {
  /**
   * Get total cart item count (badge)
   */
  async getCartCount() {
    const response = await api.get('/api/cart/count/');
    return response.data;
  },

  /**
   * Get all items in user's cart
   */
  async getCart() {
    const response = await api.get('/api/cart/get/');
    return response.data;
  },

  /**
   * Add a sneaker to cart
   * @param {number} productId
   * @param {string} size
   * @param {number} quantity
   */
  async addToCart(productId, size, quantity = 1) {
    const response = await api.post('/api/cart/add/', {
      product_id: productId,
      size,
      quantity,
    });
    return response.data;
  },

  /**
   * Update quantity of a cart item
   * @param {number} itemId
   * @param {number} quantity
   */
  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/api/cart/update/${itemId}/`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Remove item from cart
   * @param {number} itemId
   */
  async removeItem(itemId) {
    const response = await api.delete(`/api/cart/remove/${itemId}/`);
    return response.data;
  },

  /**
   * Clear the entire cart
   */
  async clearCart() {
    const response = await api.post('/api/cart/clear/');
    return response.data;
  },

  /**
   * Process checkout and create order
   * @param {object} orderData { phone_number, address, pincode, payment_method }
   */
  async processOrder(orderData) {
    const response = await api.post('/api/cart/process-order/', orderData);
    return response.data;
  },

  /**
   * Get past orders for logged-in user
   */
  async getMyOrders() {
    const response = await api.get('/api/cart/orders/');
    return response.data;
  },
};

export default cartService;
