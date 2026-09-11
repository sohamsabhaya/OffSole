import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validatePhoneNumber, validatePincode } from '../utils/validators';
import Loader from '../components/common/Loader';
import PriceSummary from '../components/common/PriceSummary';

const Checkout = () => {
  const {
    cartItems,
    loading,
    processOrder,
    calculateSubtotal,
    calculateShipping,
    calculateGST,
    calculateTotal,
  } = useCart();

  const [orderData, setOrderData] = useState({
    phone_number: '',
    address: '',
    pincode: '',
    payment_method: 'card',
  });

  const [formErrors, setFormErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!orderData.address || orderData.address.trim().length < 10) {
      errors.address = 'Please provide a complete street address (minimum 10 characters).';
    }

    if (!validatePhoneNumber(orderData.phone_number)) {
      errors.phone_number = 'Please enter a valid 10-digit mobile number.';
    }

    if (!validatePincode(orderData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit postal PIN code.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const result = await processOrder(orderData);

      if (result.success) {
        navigate('/order-success', {
          state: {
            orderNumber: result.orderNumber,
            orderId: result.orderId,
          },
        });
      } else {
        setApiError(result.message || 'Error processing order. Please try again.');
      }
    } catch (err) {
      console.error('Error processing order:', err);
      setApiError('Error connecting to backend server. Please verify the API is running.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Loader message="Loading checkout session..." size="lg" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 rounded-4 max-w-md mx-auto">
          <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted">
            Add some sneakers to your cart before proceeding to checkout.
          </p>
          <div>
            <Link to="/products" className="btn btn-primary px-4 py-2 mt-2">
              Browse Sneakers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Checkout & Payment</h1>

      {apiError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <strong>Order Failed:</strong> {apiError}
          <button type="button" className="btn-close" onClick={() => setApiError(null)}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Shipping & Payment Form */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Details */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="fw-bold mb-0">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i> 1. Delivery Address
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Street Address & Landmark *</label>
                    <textarea
                      name="address"
                      rows="3"
                      className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                      placeholder="House/Flat No., Street Name, Area, Landmark"
                      value={orderData.address}
                      onChange={handleInputChange}
                    ></textarea>
                    {formErrors.address && (
                      <div className="invalid-feedback">{formErrors.address}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">+91</span>
                      <input
                        type="tel"
                        name="phone_number"
                        className={`form-control ${formErrors.phone_number ? 'is-invalid' : ''}`}
                        placeholder="10-digit mobile number"
                        value={orderData.phone_number}
                        onChange={handleInputChange}
                        maxLength="10"
                      />
                      {formErrors.phone_number && (
                        <div className="invalid-feedback">{formErrors.phone_number}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Postal PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      className={`form-control ${formErrors.pincode ? 'is-invalid' : ''}`}
                      placeholder="6-digit PIN code"
                      value={orderData.pincode}
                      onChange={handleInputChange}
                      maxLength="6"
                    />
                    {formErrors.pincode && (
                      <div className="invalid-feedback">{formErrors.pincode}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="fw-bold mb-0">
                  <i className="fas fa-credit-card text-primary me-2"></i> 2. Payment Method
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="d-flex flex-column gap-3">
                  <label className="form-check border p-3 rounded-3 d-flex align-items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      className="form-check-input me-3"
                      checked={orderData.payment_method === 'card'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <div className="fw-bold">Credit / Debit Card</div>
                      <small className="text-muted">Visa, MasterCard, RuPay accepted</small>
                    </div>
                  </label>

                  <label className="form-check border p-3 rounded-3 d-flex align-items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      className="form-check-input me-3"
                      checked={orderData.payment_method === 'upi'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <div className="fw-bold">UPI / QR Code</div>
                      <small className="text-muted">Google Pay, PhonePe, Paytm, BHIM</small>
                    </div>
                  </label>

                  <label className="form-check border p-3 rounded-3 d-flex align-items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      className="form-check-input me-3"
                      checked={orderData.payment_method === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <div className="fw-bold">Cash on Delivery (COD)</div>
                      <small className="text-muted">Pay with cash upon delivery</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span> Processing
                  Order...
                </>
              ) : (
                <>
                  <i className="fas fa-lock me-2"></i> Confirm & Pay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="col-lg-4">
          <PriceSummary
            subtotal={calculateSubtotal()}
            shipping={calculateShipping()}
            gst={calculateGST()}
            total={calculateTotal()}
            showCheckoutBtn={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
