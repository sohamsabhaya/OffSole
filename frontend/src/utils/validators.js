/**
 * Form validation utilities
 */

/**
 * Validates Indian 10-digit mobile number
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10;
};

/**
 * Validates 6-digit Indian PIN code
 * @param {string} pincode
 * @returns {boolean}
 */
export const validatePincode = (pincode) => {
  if (!pincode) return false;
  const cleanPincode = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleanPincode);
};

/**
 * Validates standard email address
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
