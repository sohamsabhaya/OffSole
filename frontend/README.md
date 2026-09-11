# OffSole — Frontend 🎨

[![GitHub Repository](https://img.shields.io/badge/GitHub-sohamsabhaya%2FOffSole-181717?style=flat&logo=github)](https://github.com/sohamsabhaya/OffSole)

The user-facing web application and Admin Dashboard for **OffSole**, built with **React 18** and styled with **Bootstrap 5** and custom CSS.

- **Main Repository**: [https://github.com/sohamsabhaya/OffSole](https://github.com/sohamsabhaya/OffSole)

---

## 🛠️ Features & Tech Stack

- **React 18** & **React Router v6** — Single page application routing and state management.
- **Bootstrap 5 + Bootstrap Icons** — Clean, responsive, human-crafted modern UI layout.
- **Recharts** — Responsive charting library for admin sales analytics (Pie, Bar, Area charts).
- **Axios** — API communication with automatic cookie handling (withCredentials: true).
- **Context API** — Global state management for User Auth and Shopping Cart.

---

## 📁 Directory Layout

`	ext
frontend/
|-- public/
|   |-- images/               # Hero & promotional banner images
|   |-- media/                # Cached sneaker asset images
|   |-- index.html            # HTML shell with Google Fonts & Bootstrap
|   -- favicon.ico
|-- src/
|   |-- api/
|   |   |-- client.js         # Base Axios client with baseURL and credentials
|   |   |-- authService.js    # Auth & user lifecycle API calls
|   |   |-- productService.js # Product catalog & search API calls
|   |   |-- cartService.js    # Shopping cart & checkout API calls
|   |   -- adminService.js   # Admin analytics, logs & product CRUD API calls
|   |-- components/
|   |   |-- common/           # Reusable loaders, price summaries, modals
|   |   |-- features/         # ProductCard and feature components
|   |   |-- Navbar.js         # Navigation header with cart badge and admin indicator
|   |   -- Footer.js         # Modern site footer
|   |-- context/
|   |   |-- AuthContext.js    # Authentication context & actions (login, logout, delete)
|   |   -- CartContext.js    # Shopping cart state & actions (add, update, remove, clear)
|   |-- pages/
|   |   |-- Home.js           # Landing page with hero banner & featured drops
|   |   |-- Products.js       # Product catalog with interactive multi-filter sidebar
|   |   |-- ProductDetail.js  # Product page with gallery, size picker, and cart CTA
|   |   |-- Cart.js           # Shopping cart breakdown
|   |   |-- Checkout.js       # Checkout and address entry
|   |   |-- OrderSuccess.js   # Post-purchase confirmation page
|   |   |-- Orders.js         # User order history
|   |   |-- AdminDashboard.js # Admin dashboard (KPIs, Charts, Orders Log, Product CRUD)
|   |   |-- Login.js          # User login form
|   |   |-- Signup.js         # User registration form
|   |   |-- About.js          # Brand story page
|   |   -- Contact.js        # Support & contact page
|   |-- utils/
|   |   |-- formatters.js     # Currency and date formatters
|   |   -- validators.js     # Form input validators
|   |-- App.js                # Application routing layout
|   |-- App.css
|   |-- index.js              # React DOM entry
|   -- index.css             # Custom styling and theme variables
|-- package.json
-- README.md
`

---

## 🚀 Getting Started

`ash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
`

The app will open automatically at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Environment Configuration

The frontend communicates with the backend via http://localhost:8000. You can configure the API URL in src/api/client.js or via .env:

`env
REACT_APP_API_URL=http://localhost:8000
`
