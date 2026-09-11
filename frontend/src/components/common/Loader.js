import React from 'react';

const Loader = ({ message = 'Loading...', size = 'md' }) => {
  const spinnerSize =
    size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted fw-medium">{message}</p>}
    </div>
  );
};

export default Loader;
