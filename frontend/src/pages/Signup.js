import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError('Please provide a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary-subtle text-primary d-inline-flex p-3 mb-2">
                  <i className="fas fa-user-plus fa-2x"></i>
                </div>
                <h3 className="fw-bold">Create Account</h3>
                <p className="text-muted small">Join OffSole to start shopping</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
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
                      <span className="spinner-border spinner-border-sm me-2"></span> Creating
                      Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Log In
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

export default Signup;
