# OffSole - Backend API

FastAPI REST API service for the OffSole sneaker e-commerce platform. Built with a 3-layer architecture (`Router -> Service -> CRUD -> Database`), MongoDB Atlas persistence, JWT-based authentication via secure HTTP-only cookies, catalog operations, cart lifecycle, order processing, and administrative analytics.

---

## Architecture

```
FastAPI Router (Validation & Auth)
       |
       v
Service Layer (Business Logic, Totals & Validations)
       |
       v
CRUD / Repository Layer (Database Queries)
       |
       v
MongoDB Atlas
```

---

## Core Components

- **Authentication & Security**: Password hashing with native Bcrypt, signed JWT issuance and verification, role-based access dependencies (`get_current_user`, `get_current_admin_user` checking `is_admin` / `role`).
- **Services Layer**:
  - `auth_service.py`: Registration, login, cookie setting, logout, account deletion.
  - `product_service.py`: Catalog filtering, price ranges, search, detail retrieval.
  - `cart_service.py`: Persistent cart storage, item quantity validation, cart item clearing.
  - `order_service.py`: Checkout processing, stock deduction, tax and shipping calculations.
  - `admin_service.py`: Key performance metrics (Revenue, Orders, Units, AOV) and distribution breakdowns (brand, category, gender, colorway, monthly trends).
- **CRUD Repositories**: Cleanly isolated database access for `user`, `product`, `cart`, and `order`.
- **Centralized Error Handling**: Custom domain exceptions (`NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `BadRequestError`, `StockUnavailableError`).
- **Database Optimization**: Automated MongoDB index initialization for emails, usernames, product filters, and order history on startup.
- **API Versioning**: Standard `/api/v1` routes with backward-compatible `/api` aliases.

---

## Tech Stack

- **FastAPI**: Asynchronous web framework
- **Motor / PyMongo**: Async MongoDB driver
- **Pydantic v2 & Pydantic Settings**: Data validation, serialization, and environment configuration
- **Bcrypt & Python-Jose**: Password hashing and JWT management
- **Pytest & Mongomock-Motor**: Isolated unit and integration testing suite
- **Ruff**: High-performance Python linter and formatter
- **Uvicorn**: ASGI application server

---

## Project Structure

```text
backend/
|-- app/
|   |-- core/
|   |   |-- config.py         # Application settings loaded from .env
|   |   |-- database.py       # MongoDB client and collection handles
|   |   |-- deps.py           # Dependency injection for auth and admin roles
|   |   |-- exceptions.py     # Custom application domain exceptions
|   |   \-- security.py       # Password hashing and token utilities
|   |-- crud/
|   |   |-- cart.py           # Cart database operations
|   |   |-- order.py          # Order and transaction log queries
|   |   |-- product.py        # Product catalog queries
|   |   \-- user.py           # User account queries
|   |-- routers/
|   |   |-- admin.py          # /api/v1/admin endpoints
|   |   |-- auth.py           # /api/v1/auth endpoints
|   |   |-- cart.py           # /api/v1/cart endpoints
|   |   \-- products.py       # /api/v1/products endpoints
|   |-- schemas/
|   |   |-- admin.py          # Pydantic schemas for analytics and dashboards
|   |   |-- auth.py           # Schemas for user registration and auth responses
|   |   |-- cart.py           # Schemas for cart items and payloads
|   |   |-- orders.py         # Schemas for order records and transactions
|   |   \-- product.py        # Schemas for product models
|   |-- services/
|   |   |-- admin_service.py  # Sales KPI calculations and inventory management
|   |   |-- auth_service.py   # User registration, login, and token issuance
|   |   |-- cart_service.py   # Cart operations and quantity validation
|   |   |-- order_service.py  # Checkout calculation and order creation
|   |   \-- product_service.py# Catalog querying and filtering logic
|   \-- main.py               # FastAPI application setup and middleware
|-- media/                    # Static image directory for product assets
|-- tests/                    # 20 automated tests for auth, products, cart, orders, and admin
|-- pyproject.toml            # Ruff linter and Pytest configuration
|-- requirements.txt          # Python dependencies
|-- .env.example              # Sample environment configuration
\-- README.md
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/offsole?retryWrites=true&w=majority
DATABASE_NAME=offsole
SECRET_KEY=your_secure_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:3000
MEDIA_DIR=media
```

---

## Running Locally

```bash
# Windows (PowerShell)
.env\Scripts\Activate.ps1

# Linux / macOS
source venv/bin/activate

# Start server
uvicorn app.main:app --reload --port 8000
```

---

## Running Tests & Linting

```bash
# Run test suite
pytest -v

# Run Ruff linter
ruff check .
```

---

## API Documentation

Once the server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
