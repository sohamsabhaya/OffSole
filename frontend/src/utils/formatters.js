/**
 * Utility functions for data formatting
 */

/**
 * Format a number or numeric string as Indian Rupee (INR)
 * @param {number|string} amount
 * @returns {string} e.g. "₹14,999.00"
 */
export const formatCurrency = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Format a date string into readable format
 * @param {string|Date} date
 * @returns {string} e.g. "Sep 11, 2026, 10:00 AM"
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
