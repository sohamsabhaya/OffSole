import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, isAdmin, logout, deleteAccount } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = isAuthenticated ? getCartCount() : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete your OffSole account? This action cannot be undone.'
      )
    ) {
      const res = await deleteAccount();
      if (res.success) {
        alert('Your account has been successfully deleted.');
        navigate('/');
      } else {
        alert(res.message || 'Failed to delete account.');
      }
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className="navbar navbar-expand-lg mb-0"
      style={{ backgroundColor: '#000000', color: '#ffffff' }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-4"
          to="/"
          style={{ color: '#ffffff', letterSpacing: '1px' }}
        >
          OffSole
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: '#ffffff' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto align-items-lg-center">
            <Link
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              to="/"
              style={{ color: '#ffffff' }}
            >
              Home
            </Link>
            <Link
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              to="/products"
              style={{ color: '#ffffff' }}
            >
              Products
            </Link>
            <Link
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              to="/about"
              style={{ color: '#ffffff' }}
            >
              About
            </Link>
            <Link
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              to="/contact"
              style={{ color: '#ffffff' }}
            >
              Contact
            </Link>

            {isAuthenticated && isAdmin && (
              <Link
                className={`nav-link fw-semibold ${isActive('/admin') ? 'active' : ''}`}
                to="/admin"
                style={{ color: '#f59e0b' }}
              >
                <i className="fas fa-tachometer-alt me-1"></i> Admin Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                  to="/orders"
                  style={{ color: '#ffffff' }}
                >
                  <i className="fas fa-box me-1"></i> My Orders
                </Link>
                <Link className="nav-link" to="/cart" style={{ color: '#ffffff' }}>
                  <i className="fas fa-shopping-cart" style={{ color: '#ffffff' }}></i>
                  <span className="badge bg-danger ms-1">{cartCount}</span>
                </Link>
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: '#ffffff' }}
                >
                  Logout ({user})
                </button>
                {!isAdmin && (
                  <button
                    className="nav-link btn btn-link text-danger-emphasis small"
                    onClick={handleDeleteAccount}
                    style={{ background: 'none', border: 'none', color: '#f87171' }}
                    title="Permanently delete your account"
                  >
                    <i className="fas fa-trash-alt me-1"></i> Delete Account
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                  to="/login"
                  style={{ color: '#ffffff' }}
                >
                  Login
                </Link>
                <Link
                  className={`nav-link ${isActive('/signup') ? 'active' : ''}`}
                  to="/signup"
                  style={{ color: '#ffffff' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
