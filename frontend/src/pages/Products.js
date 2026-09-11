import React, { useState, useEffect } from 'react';
import productService from '../api/productService';
import Loader from '../components/common/Loader';
import ProductCard from '../components/features/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please ensure the backend server is running.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = !selectedBrand || product.brand === selectedBrand;

    let matchesPrice = true;
    if (selectedPriceRange) {
      const price = product.price;
      switch (selectedPriceRange) {
        case '0-5000':
          matchesPrice = price <= 5000;
          break;
        case '5000-10000':
          matchesPrice = price > 5000 && price <= 10000;
          break;
        case '10000-15000':
          matchesPrice = price > 10000 && price <= 15000;
          break;
        case '15000+':
          matchesPrice = price > 15000;
          break;
        default:
          matchesPrice = true;
      }
    }

    let matchesGender = true;
    if (selectedGender) {
      switch (selectedGender) {
        case 'Men':
          matchesGender = product.gender === 'Men' || product.gender === 'Unisex';
          break;
        case 'Women':
          matchesGender = product.gender === 'Women' || product.gender === 'Unisex';
          break;
        case 'Unisex':
          matchesGender = product.gender === 'Unisex';
          break;
        default:
          matchesGender = true;
      }
    }

    return matchesSearch && matchesBrand && matchesPrice && matchesGender;
  });

  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="fw-bold mb-1">Sneaker Collection</h1>
          <p className="text-muted mb-0">Browse and find your next pair of kicks</p>
        </div>
        <div className="mt-3 mt-md-0">
          <span className="badge bg-primary px-3 py-2 fs-6">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Sneaker' : 'Sneakers'}{' '}
            Available
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-light rounded-3">
        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by model, brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-md-6">
            <select
              className="form-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <select
              className="form-select"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="">All Price Ranges</option>
              <option value="0-5000">Under ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000-15000">₹10,000 - ₹15,000</option>
              <option value="15000+">Above ₹15,000</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-6">
            <select
              className="form-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && <Loader message="Loading sneakers catalog..." size="lg" />}

      {error && !loading && (
        <div className="alert alert-danger text-center p-4 rounded-3 shadow-sm" role="alert">
          <h5 className="alert-heading fw-bold">Connection Error</h5>
          <p className="mb-3">{error}</p>
          <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>
            Retry Fetching
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h4>No sneakers found</h4>
              <p className="text-muted">Try changing your search terms or filter selections.</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('');
                  setSelectedPriceRange('');
                  setSelectedGender('');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredProducts.map((product) => (
                <div className="col" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
