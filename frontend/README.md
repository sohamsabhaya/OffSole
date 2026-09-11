# OffSole — Frontend

Single Page Application (SPA) for the OffSole sneaker e-commerce platform and Admin Dashboard, built with React 18, React Router v6, and Bootstrap 5.

---

## Overview

- **User Storefront**: Responsive shopping experience with catalog filtering, detailed product views, and persistent cart checkout.
- **Admin Dashboard**: Analytics dashboard featuring KPI summaries, interactive charts (Recharts), recent transactions log, and product inventory management.
- **State Management**: React Context API for global authentication (AuthContext) and shopping cart (CartContext).
- **HTTP Client**: Axios instance configured with withCredentials: true for secure cookie-based session management.

---

## Project Structure

`	ext
frontend/
├── public/
│   ├── images/               # Promotional and carousel imagery
│   ├── media/                # Local sneaker preview assets
│   ├── index.html            # Main HTML entry file
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── client.js         # Axios base client
│   │   ├── authService.js    # Authentication API calls
│   │   ├── productService.js # Product catalog API calls
│   │   ├── cartService.js    # Shopping cart and checkout API calls
│   │   └── adminService.js   # Admin metrics and inventory API calls
│   ├── components/
│   │   ├── common/           # Reusable loaders, modals, and price widgets
│   │   ├── features/         # ProductCard and storefront components
│   │   ├── Navbar.js         # Header navigation with cart and admin links
│   │   └── Footer.js         # Site footer
│   ├── context/
│   │   ├── AuthContext.js    # User state, login, logout, account deletion
│   │   └── CartContext.js    # Cart state, item counters, add/remove actions
│   ├── pages/
│   │   ├── Home.js           # Homepage with hero and featured releases
│   │   ├── Products.js       # Searchable and filterable catalog
│   │   ├── ProductDetail.js  # Product information and size selection
│   │   ├── Cart.js           # Shopping cart view
│   │   ├── Checkout.js       # Order checkout and shipping details
│   │   ├── OrderSuccess.js   # Confirmation screen
│   │   ├── Orders.js         # User order history
│   │   ├── AdminDashboard.js # Analytics charts, orders table, product CRUD
│   │   ├── Login.js          # Sign in view
│   │   ├── Signup.js         # Account creation view
│   │   ├── About.js          # Brand story
│   │   └── Contact.js        # Contact and inquiry page
│   ├── utils/
│   │   ├── formatters.js     # Currency and date formatting
│   │   └── validators.js     # Form validation utilities
│   ├── App.js                # Application route definitions
│   ├── App.css
│   ├── index.js              # Application root
│   └── index.css             # Theme styling and customizations
├── package.json
└── README.md
`

---

## Setup & Running

`ash
# Install dependencies
npm install

# Start development server
npm start
`

The application runs on http://localhost:3000 by default.

---

## Environment Configuration

Backend API location can be configured in .env:

`env
REACT_APP_API_URL=http://localhost:8000
`
