# OffSole ? Backend API

FastAPI REST API service for the OffSole sneaker e-commerce platform. Handles MongoDB Atlas persistence, JWT-based authentication via HTTP-only cookies, catalog operations, cart lifecycle, order processing, and administrative analytics.

---

## Core Components

- **Authentication & Security**: Password hashing with Passlib/Bcrypt, signed JWT issuance and verification, role-based access dependencies (`get_current_user`, `get_current_admin_user`).
- **Product Management**: Filterable catalog queries, pagination, and administrative CRUD operations.
- **Cart & Orders**: User-associated cart persistence, quantity tracking, and order creation with transaction logs.
- **Admin Analytics**: Aggregated metrics across revenue, order counts, brand distributions, gender categories, and monthly trends.

---

## Tech Stack

- **FastAPI**: Asynchronous web framework
- **Motor / PyMongo**: Async MongoDB driver
- **Pydantic v2**: Data validation and serialization
- **Passlib & Bcrypt**: Password hashing
- **Python-Jose**: JWT management
- **Uvicorn**: ASGI application server

---

## Project Structure

```
backend/
|-- app/
|   |-- core/
|   |   |-- config.py         # Application settings loaded from .env
|   |   |-- database.py       # MongoDB client and collection handles
|   |   |-- deps.py           # Dependency injection for auth and roles
|   |   \-- security.py       # Password hashing and token utilities
|   |-- crud/
|   |   |-- cart.py           # Cart database operations
|   |   |-- order.py          # Order and transaction log queries
|   |   |-- product.py        # Product catalog queries
|   |   \-- user.py           # User account queries
|   |-- routers/
|   |   |-- admin.py          # /api/admin endpoints (analytics, logs, CRUD)
|   |   |-- auth.py           # /api/auth endpoints (login, register, me, delete)
|   |   |-- cart.py           # /api/cart endpoints (cart management, checkout)
|   |   \-- products.py       # /api/products endpoints (catalog listing, details)
|   |-- schemas/
|   |   |-- admin.py          # Pydantic schemas for analytics and dashboards
|   |   |-- auth.py           # Schemas for user registration and auth responses
|   |   |-- cart.py           # Schemas for cart items and payloads
|   |   |-- orders.py         # Schemas for order records and transactions
|   |   \-- product.py        # Schemas for product models
|   \-- main.py               # FastAPI application setup and middleware
|-- media/                    # Static image directory for product assets
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

## API Documentation

Once the server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
