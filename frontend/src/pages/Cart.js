import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';
import PriceSummary from '../components/common/PriceSummary';

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeItem,
    calculateSubtotal,
    calculateShipping,
    calculateGST,
    calculateTotal,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItem(itemId);
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemovingItem(itemId);
      await removeItem(itemId);
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Loader message="Loading your shopping cart..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 text-center p-5 rounded-4 max-w-md mx-auto">
          <i className="fas fa-user-lock fa-3x text-primary mb-3"></i>
          <h3 className="fw-bold">Please Log In</h3>
          <p className="text-muted">You need to be logged in to view and manage your shopping cart.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Link to="/login" className="btn btn-primary px-4 py-2 fw-semibold">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-outline-secondary px-4 py-2">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 text-center p-5 rounded-4 max-w-md mx-auto">
          <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Your cart is empty</h3>
          <p className="text-muted">Explore our fresh catalog and grab your favorite pairs.</p>
          <div>
            <Link to="/products" className="btn btn-primary px-4 py-2 fw-semibold mt-2">
              Explore Sneakers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)</h1>

      {error && <div className="alert alert-warning py-2 mb-4">{error}</div>}

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Product</th>
                    <th scope="col">Size</th>
                    <th scope="col">Price</th>
                    <th scope="col" style={{ width: '140px' }}>Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col" className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          {item.product_image ? (
                            <img
                              src={
                                item.product_image.startsWith('http')
                                  ? item.product_image
                                  : `http://localhost:8000${item.product_image}`
                              }
                              alt={item.product_name}
                              className="rounded me-3 border"
                              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                          ) : (
                            <div
                              className="rounded bg-light me-3 d-flex align-items-center justify-content-center border"
                              style={{ width: '60px', height: '60px' }}
                            >
                              <i className="fas fa-shoe-prints text-muted"></i>
                            </div>
                          )}
                          <div>
                            <Link
                              to={`/product/${item.product_id}`}
                              className="fw-bold text-dark text-decoration-none text-truncate d-block"
                              style={{ maxWidth: '200px' }}
                            >
                              {item.product_name}
                            </Link>
                            <small className="text-muted">Item #{item.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">{item.size}</span>
                      </td>
                      <td className="fw-semibold">{formatCurrency(item.product_price)}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: '110px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={item.quantity <= 1 || updatingItem === item.id}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center bg-white"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={updatingItem === item.id}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-dark">{formatCurrency(item.total_price)}</td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItem === item.id}
                          title="Remove item"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center">
              <Link to="/products" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-1"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-lg-4">
          <PriceSummary
            subtotal={calculateSubtotal()}
            shipping={calculateShipping()}
            gst={calculateGST()}
            total={calculateTotal()}
            showCheckoutBtn={true}
            onCheckout={() => navigate('/checkout')}
            btnText="Proceed to Checkout"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;