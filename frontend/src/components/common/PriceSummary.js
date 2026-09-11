import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const PriceSummary = ({
  subtotal,
  shipping,
  gst,
  total,
  showCheckoutBtn = false,
  onCheckout,
  btnText = 'Proceed to Checkout',
}) => {
  return (
    <div className="card shadow-sm border-0 rounded-3">
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-3">Order Summary</h5>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Subtotal</span>
          <span className="fw-semibold">{formatCurrency(subtotal)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">
            Estimated Delivery
            {shipping === 0 && (
              <span className="badge bg-success-subtle text-success ms-2">FREE</span>
            )}
          </span>
          <span className="fw-semibold">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">GST (18%)</span>
          <span className="fw-semibold">{formatCurrency(gst)}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between mb-4">
          <span className="fs-5 fw-bold">Total Amount</span>
          <span className="fs-5 fw-bold text-primary">{formatCurrency(total)}</span>
        </div>

        {subtotal > 0 && subtotal < 1000 && (
          <div className="alert alert-info py-2 px-3 small mb-3">
            Add <strong>{formatCurrency(1000 - subtotal)}</strong> more for{' '}
            <strong>FREE Delivery</strong>!
          </div>
        )}

        {showCheckoutBtn && (
          <button className="btn btn-primary w-100 py-2 fw-semibold shadow-sm" onClick={onCheckout}>
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceSummary;
