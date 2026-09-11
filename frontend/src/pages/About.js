import React from 'react';

const About = () => {
  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-4">About OffSole</h1>
          <p className="lead text-muted">Your trusted destination for authentic sneakers</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="mb-4">Our Mission</h2>
          <p className="lead">
            At OffSole, we believe everyone deserves access to authentic, high-quality sneakers. Our
            mission is to provide sneaker enthusiasts with a reliable platform to discover,
            purchase, and collect the latest releases and classic favorites from the world's top
            brands.
          </p>
          <p>
            Founded in 2026, we've built our reputation on authenticity, customer service, and a
            passion for sneaker culture. Every product in our collection is sourced directly from
            authorized dealers and manufacturers, ensuring you receive only genuine items.
          </p>
        </div>
        <div className="col-lg-6">
          <div
            className="p-4 bg-light rounded d-flex align-items-center justify-content-center"
            style={{ height: '300px' }}
          >
            <div className="text-center">
              <i className="fas fa-running fa-4x text-primary mb-3"></i>
              <h5 className="text-muted">Premium Sneaker Collection</h5>
              <p className="text-muted">Authentic brands, quality guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-5">Our Values</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Authenticity</h5>
              <p className="card-text">
                Every sneaker in our collection is 100% authentic, sourced directly from authorized
                dealers and manufacturers.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-heart fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Customer First</h5>
              <p className="card-text">
                Your satisfaction is our priority. We provide exceptional service and support
                throughout your shopping journey.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-globe fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Community</h5>
              <p className="card-text">
                We're passionate about sneaker culture and building a community of enthusiasts who
                share our love for kicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title mb-4">Why Choose OffSole?</h2>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled text-start">
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      100% Authentic Products
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      Free Shipping on Orders Over ₹1000
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      30-Day Return Policy
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled text-start">
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      Expert Customer Support
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      Latest Releases & Classics
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check text-success me-2"></i>
                      Secure Payment Options
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
