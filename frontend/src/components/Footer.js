import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-modern" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="footer-title fw-bold" style={{ color: '#ffffff' }}>OffSole</h5>
                <p className="footer-description" style={{ color: '#cccccc' }}>
                  Your trusted destination for authentic sneakers. We bring you the latest releases,
                  classic favorites, and exclusive collaborations from the world's top brands.
                </p>
                <div className="contact-info" style={{ color: '#cccccc', marginTop: '15px' }}>
                  <p><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i> Shop No. 15, Nikol Market, Nikol, Ahmedabad - 382350, Gujarat, India</p>
                  <p><i className="fas fa-phone" style={{ marginRight: '8px' }}></i> +91-98765-43210</p>
                  <p><i className="fas fa-envelope" style={{ marginRight: '8px' }}></i> support@offsole.in</p>
                </div>
              </div>
            </div>

            {/* Quick Links and Social Media */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="footer-section">
                <div className="row">
                  {/* Quick Links */}
                  <div className="col-md-6">
                    <h6 className="footer-subtitle" style={{ color: '#ffffff' }}>Quick Links</h6>
                    <ul className="footer-links">
                      <li><Link to="/" style={{ color: '#cccccc' }}>Home</Link></li>
                      <li><Link to="/products" style={{ color: '#cccccc' }}>Products</Link></li>
                      <li><Link to="/about" style={{ color: '#cccccc' }}>About Us</Link></li>
                      <li><Link to="/contact" style={{ color: '#cccccc' }}>Contact</Link></li>
                    </ul>
                  </div>

                  {/* Social Media */}
                  <div className="col-md-6">
                    <h6 className="footer-subtitle" style={{ color: '#ffffff' }}>Follow Us</h6>
                    <div className="social-links-horizontal">
                      <a href="#" className="social-link-horizontal" aria-label="Facebook" style={{ color: '#ffffff' }}>
                        <i className="fab fa-facebook-f" style={{ color: '#ffffff' }}></i>
                        <span style={{ color: '#cccccc', marginLeft: '8px' }}>Facebook</span>
                      </a>
                      <a href="#" className="social-link-horizontal" aria-label="Twitter" style={{ color: '#ffffff' }}>
                        <i className="fab fa-twitter" style={{ color: '#ffffff' }}></i>
                        <span style={{ color: '#cccccc', marginLeft: '8px' }}>Twitter</span>
                      </a>
                      <a href="#" className="social-link-horizontal" aria-label="Instagram" style={{ color: '#ffffff' }}>
                        <i className="fab fa-instagram" style={{ color: '#ffffff' }}></i>
                        <span style={{ color: '#cccccc', marginLeft: '8px' }}>Instagram</span>
                      </a>
                      <a href="#" className="social-link-horizontal" aria-label="YouTube" style={{ color: '#ffffff' }}>
                        <i className="fab fa-youtube" style={{ color: '#ffffff' }}></i>
                        <span style={{ color: '#cccccc', marginLeft: '8px' }}>YouTube</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <p className="copyright" style={{ color: '#999999' }}>&copy; 2026 OffSole. All rights reserved. | Nikol, Ahmedabad, Gujarat, India</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 