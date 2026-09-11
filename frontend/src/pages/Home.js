import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section with Carousel */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/images/carousel2.webp"
              className="d-block w-100"
              alt="Sneakers"
              style={{ height: '700px', objectFit: 'cover' }}
            />
            <div
              className="carousel-caption d-none d-md-block"
              style={{
                bottom: '20px',
                top: 'auto',
                right: '50px',
                left: 'auto',
                textAlign: 'right',
                maxWidth: '300px',
              }}
            >
              <h1 className="display-6 fw-bold">Classic Styles</h1>
              <p className="lead" style={{ fontSize: '1rem' }}>
                Timeless sneakers for every occasion.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Explore Collection
              </Link>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/images/carousel3.jpg"
              className="d-block w-100"
              alt="Sneakers"
              style={{ height: '700px', objectFit: 'cover' }}
            />
            <div
              className="carousel-caption d-none d-md-block"
              style={{
                bottom: '20px',
                top: 'auto',
                right: '50px',
                left: 'auto',
                textAlign: 'right',
                maxWidth: '300px',
              }}
            >
              <h1 className="display-6 fw-bold">Exclusive Deals</h1>
              <p className="lead" style={{ fontSize: '1rem' }}>
                Get the best prices on top brands.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-4 mb-4">
              <div className="feature-box p-4">
                <i className="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
                <h4>Fast Shipping</h4>
                <p className="text-muted">Free shipping on orders over ₹1000</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-box p-4">
                <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                <h4>Authentic Products</h4>
                <p className="text-muted">100% genuine sneakers from top brands</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-box p-4">
                <i className="fas fa-undo fa-3x text-primary mb-3"></i>
                <h4>Easy Returns</h4>
                <p className="text-muted">30-day return policy for your peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold">Frequently Asked Questions</h2>
              <p className="lead text-muted">Everything you need to know about shopping with us</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="homeFAQ">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <i className="fas fa-shipping-fast text-primary me-2"></i>
                      Do you offer free shipping?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      Yes! We offer free shipping on all orders over ₹1000. For orders below this
                      amount, a nominal shipping fee of ₹99 applies.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      <i className="fas fa-shield-alt text-primary me-2"></i>
                      Are your products authentic?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      Absolutely! All our sneakers are 100% authentic and sourced directly from
                      authorized dealers and manufacturers. We guarantee the authenticity of every
                      product.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      <i className="fas fa-store text-primary me-2"></i>
                      Can I visit your store?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      Currently, we operate as an online-only store. However, we're working on
                      opening physical locations soon. Stay tuned for updates!
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      <i className="fas fa-gift text-primary me-2"></i>
                      Do you have a loyalty program?
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      Yes! We offer a comprehensive loyalty program with exclusive discounts, early
                      access to new releases, and special member-only deals.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFive"
                      aria-expanded="false"
                      aria-controls="collapseFive"
                    >
                      <i className="fas fa-undo text-primary me-2"></i>
                      What is your return policy?
                    </button>
                  </h2>
                  <div
                    id="collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      We offer a 30-day return policy for all unused items in their original
                      packaging. Returns are free and we provide a full refund or exchange.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingSix">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSix"
                      aria-expanded="false"
                      aria-controls="collapseSix"
                    >
                      <i className="fas fa-globe text-primary me-2"></i>
                      Do you offer international shipping?
                    </button>
                  </h2>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSix"
                    data-bs-parent="#homeFAQ"
                  >
                    <div className="accordion-body">
                      Currently, we only ship within India. We're working on expanding our shipping
                      options to include international destinations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
