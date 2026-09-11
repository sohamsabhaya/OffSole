import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cartService from '../api/cartService';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';

const Orders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserOrders();
    }
  }, [isAuthenticated]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Unable to load your order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') {
      return <span className="badge bg-success-subtle text-success border border-success px-3 py-2">Delivered</span>;
    }
    if (s === 'shipped') {
      return <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2">Shipped</span>;
    }
    return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2">Processing</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="container py-5">
        <Loader message="Loading your order history..." size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">My Orders</h2>
          <p className="text-muted small mb-0">Track and review your past sneaker purchases</p>
        </div>
        <Link to="/products" className="btn btn-outline-dark btn-sm">
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center py-5 my-4">
          <div className="card-body">
            <div className="display-4 text-muted mb-3">
              <i className="fas fa-box-open"></i>
            </div>
            <h4 className="fw-bold">No Orders Found</h4>
            <p className="text-muted mb-4">You have not placed any sneaker orders with OffSole yet.</p>
            <Link to="/products" className="btn btn-primary px-4 py-2 fw-semibold">
              Explore Sneaker Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const items = order.items || [];
            const formattedDate = order.created_at
              ? new Date(order.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div key={order.id || order.order_number} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  {/* Order Header */}
                  <div className="card-header bg-dark text-white p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                      <span className="text-uppercase small text-light opacity-75 d-block">Order Reference</span>
                      <span className="fw-bold fs-5 text-white">{order.order_number}</span>
                    </div>
                    <div>
                      <span className="text-uppercase small text-light opacity-75 d-block">Date Placed</span>
                      <span className="text-white small">{formattedDate}</span>
                    </div>
                    <div>
                      <span className="text-uppercase small text-light opacity-75 d-block">Total Amount</span>
                      <span className="fw-bold fs-5 text-success">{formatCurrency(order.total_amount)}</span>
                    </div>
                    <div>
                      {getStatusBadge(order.order_status)}
                    </div>
                  </div>

                  {/* Order Body / Items */}
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">Ordered Items ({items.length})</h6>
                    <div className="table-responsive">
                      <table className="table table-borderless align-middle mb-0">
                        <tbody>
                          {items.map((item, idx) => {
                            const imgSrc = item.image
                              ? item.image.startsWith('http')
                                ? item.image
                                : `http://localhost:8000${item.image}`
                              : '/media/sneakers/images/nike_air_max_270.jpg';

                            return (
                              <tr key={idx} className="border-bottom">
                                <td style={{ width: '80px' }}>
                                  <img
                                    src={imgSrc}
                                    alt={item.name}
                                    className="rounded-3 border"
                                    style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/media/sneakers/images/nike_air_max_270.jpg';
                                    }}
                                  />
                                </td>
                                <td>
                                  <div className="fw-bold">{item.name}</div>
                                  <div className="text-muted small">Brand: {item.brand || 'OffSole'}</div>
                                </td>
                                <td>
                                  <span className="badge bg-secondary-subtle text-dark border font-monospace">
                                    Size: {item.size}
                                  </span>
                                </td>
                                <td>
                                  <small className="text-muted d-block">Qty: {item.quantity}</small>
                                </td>
                                <td className="text-end fw-bold">
                                  {formatCurrency(item.total_price || item.price * item.quantity)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Shipping and Payment info */}
                    <div className="row mt-3 pt-3 border-top g-3 bg-light rounded-3 p-3">
                      <div className="col-md-8">
                        <small className="text-muted fw-bold text-uppercase d-block mb-1">Shipping Address</small>
                        <p className="mb-0 text-dark small">
                          <strong>{order.username}</strong><br />
                          {order.address}, Pincode: {order.pincode}<br />
                          Phone: {order.phone_number}
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <small className="text-muted fw-bold text-uppercase d-block mb-1">Payment Method</small>
                        <span className="badge bg-dark text-uppercase">{order.payment_method || 'Card'}</span>
                        <div className="small text-muted mt-1">
                          Payment: <strong className="text-uppercase">{order.payment_status || 'Paid'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
