import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../api/productService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductDetail(id);
      setProduct(data?.product || data);
      setError(null);
    } catch (err) {
      setError('Product not found or backend server is unreachable.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setAlertInfo({ type: 'warning', message: 'Please select an available shoe size first.' });
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addToCart(product.id, selectedSize, quantity);

      if (result.success) {
        navigate('/cart');
      } else {
        setAlertInfo({ type: 'danger', message: result.message || 'Failed to add product to cart.' });
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setAlertInfo({ type: 'danger', message: 'Error adding to cart. Please make sure you are logged in.' });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Loader message="Loading sneaker details..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-4 rounded-3 d-inline-block">
          <h5>Product Unavailable</h5>
          <p>{error || 'The requested product could not be found.'}</p>
          <Link to="/products" className="btn btn-outline-danger btn-sm">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const availableSizes = product.available_sizes || {};
  const standardSizes = ['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'];

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {alertInfo && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show`} role="alert">
          {alertInfo.message}
          <button type="button" className="btn-close" onClick={() => setAlertInfo(null)}></button>
        </div>
      )}

      <div className="row g-5">
        {/* Product Image Gallery */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-light p-4 text-center">
            {product.image ? (
              <img
                src={product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`}
                alt={product.name}
                className="img-fluid mx-auto"
                style={{ maxHeight: '450px', objectFit: 'contain' }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <span className="text-muted">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Information & Purchase Controls */}
        <div className="col-lg-6">
          <div className="ps-lg-3">
            <span className="badge bg-dark text-uppercase px-3 py-2 mb-2">{product.brand}</span>
            <span className="badge bg-secondary ms-2 px-3 py-2 mb-2">{product.gender || 'Unisex'}</span>

            <h1 className="fw-bold mb-2">{product.name}</h1>
            <p className="text-muted mb-3">Colorway: <strong>{product.colour || 'Standard'}</strong></p>

            <div className="fs-2 fw-bold text-primary mb-4">
              {formatCurrency(product.price)}
              <small className="text-muted fs-6 fw-normal ms-2">(Inclusive of all taxes)</small>
            </div>

            <hr className="my-4" />

            {/* Size Selector */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-bold">Select UK Size</label>
                <span className="small text-muted">Stock verified in real-time</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {standardSizes.map((size) => {
                  const isAvailable = Boolean(availableSizes[size]);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      className={`btn px-3 py-2 fw-semibold rounded-3 ${
                        isSelected
                          ? 'btn-primary shadow-sm'
                          : isAvailable
                          ? 'btn-outline-dark'
                          : 'btn-outline-secondary text-decoration-line-through opacity-50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="fw-bold mb-2">Quantity</label>
              <div className="input-group" style={{ width: '130px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center bg-white"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-3 mb-4">
              <button
                className="btn btn-primary btn-lg py-3 fw-bold shadow"
                disabled={addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Adding to Cart...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Description Accordion */}
            <div className="card bg-light border-0 rounded-3 p-3">
              <h6 className="fw-bold mb-2">About this pair</h6>
              <p className="text-muted small mb-0" style={{ whiteSpace: 'pre-line' }}>
                {product.description || 'Premium sneakers crafted for style, comfort, and everyday durability.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;