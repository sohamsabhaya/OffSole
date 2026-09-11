import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', gender: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
          <p className="lead text-muted">We'd love to hear from you. Get in touch with us!</p>
        </div>
      </div>

      <div className="row justify-content-center">
        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Send us a Message</h3>

              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <div className="gender-selection">
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="contact-male"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                      />
                      <label htmlFor="contact-male">Male</label>
                    </div>
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="contact-female"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                      />
                      <label htmlFor="contact-female">Female</label>
                    </div>
                    <div className="gender-option">
                      <input
                        type="radio"
                        id="contact-other"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      <label htmlFor="contact-other">Other</label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Enter your message"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h2 className="text-center mb-5">Frequently Asked Questions</h2>
        </div>
        <div className="col-lg-8 mx-auto">
          <div className="accordion" id="contactFAQ">
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
                  How can I track my order?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#contactFAQ"
              >
                <div className="accordion-body">
                  Once your order ships, you'll receive a confirmation email with tracking
                  information. You can also track your order by logging into your account and
                  visiting the "My Orders" section.
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
                  What is your return policy?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#contactFAQ"
              >
                <div className="accordion-body">
                  We offer a 30-day return policy for all unused items in their original packaging.
                  Returns are free and we provide a full refund or exchange.
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
                  Do you offer international shipping?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#contactFAQ"
              >
                <div className="accordion-body">
                  Currently, we only ship within India. We're working on expanding our shipping
                  options to include international destinations.
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
                  How do I know if a sneaker is authentic?
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#contactFAQ"
              >
                <div className="accordion-body">
                  All our sneakers are sourced directly from authorized dealers and come with
                  authenticity guarantees. We provide detailed product information and high-quality
                  images to help you verify the authenticity.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
