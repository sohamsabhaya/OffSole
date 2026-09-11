# OffSole — Backend API ⚙️

[![GitHub Repository](https://img.shields.io/badge/GitHub-sohamsabhaya%2FOffSole-181717?style=flat&logo=github)](https://github.com/sohamsabhaya/OffSole)

FastAPI-powered asynchronous REST API for the **OffSole** sneaker e-commerce platform. Integrates with MongoDB Atlas, handles JWT authentication via secure cookies, product inventory, shopping carts, order checkouts, and admin sales analytics.

- **Main Repository**: [https://github.com/sohamsabhaya/OffSole](https://github.com/sohamsabhaya/OffSole)

---

## 🛠️ Tech Stack & Dependencies

- **FastAPI** — High-performance Python web framework for APIs.
- **Motor** — Asynchronous Python driver for MongoDB.
- **Pydantic v2** — Data parsing, schema definition, and validation.
- **passlib + bcrypt** — Robust password hashing.
- **python-jose** — JWT token encoding and signature validation.
- **Uvicorn** — Lightning-fast ASGI web server implementation.
- **python-multipart** — Form data parser for file/image uploads.

---

## 📁 Directory Layout

`	ext
backend/
|-- app/
|   |-- core/
|   |   |-- config.py         # Application configuration & settings
|   |   |-- database.py       # MongoDB client & collection handles
|   |   |-- deps.py           # Dependency injection for auth & admin checks
|   |   -- security.py       # Passlib hashing & JWT helpers
|   |-- crud/
|   |   |-- product.py        # Database operations for products
|   |   -- order.py          # Database operations for orders & logs
|   |-- routers/
|   |   |-- admin.py          # /api/admin/* (Metrics, charts, product CRUD)
|   |   |-- auth.py           # /api/auth/* (Register, login, me, delete account)
|   |   |-- cart.py           # /api/cart/* (Get cart, add, update, remove, checkout)
|   |   -- products.py       # /api/products/* (Catalog listing, filtering, detail)
|   |-- schemas/
|   |   |-- admin.py          # Admin analytics response schemas
|   |   |-- auth.py           # Auth payload & user response schemas
|   |   |-- cart.py           # Cart & cart-item models
|   |   |-- orders.py         # Order & transaction schemas
|   |   -- product.py        # Product schemas
|   -- main.py               # Application factory & middleware setup
|-- media/                    # Static image directory
|-- requirements.txt          # Python package requirements
|-- .env.example              # Sample environment variables
-- README.md                 # Backend documentation
`

---

## ⚙️ Environment Variables

Create a .env file inside the ackend/ directory:

`env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/offsole?retryWrites=true&w=majority
DATABASE_NAME=offsole
SECRET_KEY=your_secret_key_change_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:3000
MEDIA_DIR=media
`

---

## 🚀 Running the Server

`ash
# 1. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# 2. Run with uvicorn
uvicorn app.main:app --reload --port 8000
`

---

## 📡 API Endpoints Overview

### Authentication (/api/auth)
- POST /api/auth/register — Register a new customer account.
- POST /api/auth/login — Authenticate and set HTTP-only JWT cookie.
- POST /api/auth/logout — Clear auth cookie.
- GET /api/auth/me — Get current user profile.
- DELETE /api/auth/delete-account — Delete current user account and clean up cart.

### Products (/api/products)
- GET /api/products — List products with filters (rand, category, gender, color, sort, search).
- GET /api/products/{id} — Get single product details.

### Cart & Orders (/api/cart)
- GET /api/cart — View user's current shopping cart.
- POST /api/cart/items — Add an item (with size) to cart.
- PUT /api/cart/items/{item_id} — Update item quantity.
- DELETE /api/cart/items/{item_id} — Remove item from cart.
- POST /api/cart/checkout — Checkout cart and create order record.

### Admin (/api/admin)
- GET /api/admin/metrics — Aggregate summary (revenue, orders, units sold, AOV).
- GET /api/admin/sales-analytics — Chart data for brand, gender, color, and monthly sales.
- GET /api/admin/sales-log — Paginated list of recent purchases.
- POST /api/admin/products — Create a new product.
- PUT /api/admin/products/{id} — Update an existing product.
- DELETE /api/admin/products/{id} — Delete a product.

Interactive Swagger documentation is available at http://localhost:8000/docs.
