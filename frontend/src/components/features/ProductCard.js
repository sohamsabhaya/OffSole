import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const availableSizes = product.available_sizes || {};
  const sizesList = Object.keys(availableSizes);

  return (
    <div className="card h-100 product-card shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="position-relative bg-light text-center p-3">
        {product.image ? (
          <img
            src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}
            className="card-img-top img-fluid"
            alt={product.name}
            style={{ height: '220px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ height: '220px' }}>
            <span className="text-muted">No Image Available</span>
          </div>
        )}
        
        {product.gender && (
          <span className="badge bg-dark position-absolute top-0 start-0 m-3 px-2 py-1">
            {product.gender}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="text-uppercase text-muted small fw-bold mb-1">{product.brand}</div>
        <h6 className="card-title fw-bold text-truncate mb-2" title={product.name}>
          <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h6>
        
        <p className="card-text text-muted small text-truncate mb-2">
          {product.colour || 'Standard Edition'}
        </p>

        <div className="mt-auto pt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold text-dark">{formatCurrency(product.price)}</span>
            <span className="badge bg-light text-secondary border">
              {sizesList.length} Sizes Available
            </span>
          </div>

          <div className="d-grid gap-2">
            <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm fw-semibold">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
