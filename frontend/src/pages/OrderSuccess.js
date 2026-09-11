import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderNumber, orderId } = location.state || {};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card text-center">
            <div className="card-body p-5">
              <div className="mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h1 className="card-title mb-3">Order Placed Successfully!</h1>
              <p className="lead text-muted mb-4">
                Thank you for your purchase. Your order has been confirmed and is being processed.
              </p>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="fas fa-receipt text-primary me-2"></i>
                        Order Number
                      </h6>
                      <p className="card-text mb-1 fw-bold">{orderNumber || 'ORD2026091109301234'}</p>
                      {orderId && <small className="text-muted">Order Ref ID: #{orderId}</small>}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="fas fa-calendar text-primary me-2"></i>
                        Order Date
                      </h6>
                      <p className="card-text">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info" role="alert">
                <h6 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  What's Next?
                </h6>
                <ul className="list-unstyled mb-0">
                  <li>✓ You'll receive an order confirmation email shortly</li>
                  <li>✓ We'll notify you when your order ships</li>
                  <li>✓ Track your order through your account</li>
                  <li>✓ Expected delivery: 3-5 business days</li>
                </ul>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <Link to="/orders" className="btn btn-primary w-100">
                    <i className="fas fa-box me-2"></i>
                    View My Orders
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link to="/products" className="btn btn-outline-primary w-100">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Continue Shopping
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link to="/" className="btn btn-outline-dark w-100">
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-shipping-fast fa-2x text-primary mb-3"></i>
                  <h6 className="card-title">Fast Shipping</h6>
                  <p className="card-text small">Free shipping on orders over ₹1000</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-shield-alt fa-2x text-primary mb-3"></i>
                  <h6 className="card-title">Secure Payment</h6>
                  <p className="card-text small">Your payment is protected and secure</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-undo fa-2x text-primary mb-3"></i>
                  <h6 className="card-title">Easy Returns</h6>
                  <p className="card-text small">30-day return policy for your peace of mind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 