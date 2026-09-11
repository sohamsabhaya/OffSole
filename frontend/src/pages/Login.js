import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData);

    if (result.success) {
      navigate(result.isAdmin ? '/admin' : '/');
    } else {
      setError(result.message || 'Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary-subtle text-primary d-inline-flex p-3 mb-2">
                  <i className="fas fa-shoe-prints fa-2x"></i>
                </div>
                <h3 className="fw-bold">Welcome Back</h3>
                <p className="text-muted small">Sign in to your OffSole account</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Logging In...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;