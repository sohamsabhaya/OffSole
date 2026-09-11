import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../api/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setCartItems([]);
      } else {
        setError('Failed to fetch cart items');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const data = await cartService.addToCart(productId, size, quantity);
      if (data.success) {
        await fetchCart();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || data.message || 'Failed to add item' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.detail || 'Failed to add to cart',
      };
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartService.updateQuantity(itemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, total_price: item.product_price * newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const processOrder = async (orderData) => {
    try {
      const data = await cartService.processOrder(orderData);
      if (data.success) {
        setCartItems([]);
        return {
          success: true,
          orderId: data.order_id,
          orderNumber: data.order_number,
          message: data.message,
        };
      }
      return {
        success: false,
        message: data.error || data.message || 'Order processing failed',
      };
    } catch (error) {
      console.error('Error processing order:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.detail || 'Order processing failed',
      };
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.total_price || item.product_price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 || subtotal === 0 ? 0 : 99;
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateGST();
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cartItems,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    processOrder,
    calculateSubtotal,
    calculateShipping,
    calculateGST,
    calculateTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;