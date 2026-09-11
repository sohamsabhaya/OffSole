# OffSole

OffSole is a full-stack sneaker e-commerce platform built with FastAPI, MongoDB Atlas, and React 18. The application features a 3-tier service architecture, dynamic catalog filtering, cart and checkout workflows, secure JWT cookie session management, self-service account lifecycle features, and an administrative dashboard with interactive sales analytics and product inventory control.

---

## Features

### Storefront & Customer Experience
- **Dynamic Catalog Filtering**: Multi-attribute filtering by brand, category, gender, colorway, and size with real-time price sorting and multi-field keyword search.
- **Product Details**: High-resolution image preview, real-time stock indicator, and size selector.
- **Cart & Checkout**: Persistent cart storage, quantity adjustments, tax & shipping calculation, and atomic checkout processing.
- **User Authentication**: Secure HTTP-only JWT cookies, bcrypt password hashing, session persistence, and self-service account deletion.

### Admin Dashboard & Analytics
- **Sales KPI Metrics**: Total Revenue, Orders Count, Units Sold, and Average Order Value (AOV).
- **Visual Charts & Trends (Recharts)**:
  - Monthly revenue and order volume trends.
  - Brand market share distribution (Donut chart).
  - Category and Gender distribution breakdowns.
  - Colorway sales distribution.
- **Recent Transactions Log**: Chronological audit trail of customer purchases with item-level breakdowns and status tags.
- **Inventory Management**: Create new sneaker listings, update prices/stock/details, and delete discontinued products.

---

## Architecture Flow

The backend adheres to a clean layered architecture:

```
FastAPI Router (Validation & Auth)
       |
       v
Service Layer (Business Logic & Calculations)
       |
       v
CRUD / Repository Layer (Database Queries)
       |
       v
MongoDB Atlas
```

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| Backend API | FastAPI | Asynchronous Python REST API framework with /api/v1 versioning |
| Database | MongoDB Atlas & Motor | Async NoSQL database for products, users, carts, and orders |
| Authentication | Python-Jose & Bcrypt | JWT in secure HTTP-only cookies, bcrypt password hashing |
| Service Layer | Python Services | Decoupled business logic, order totals, tax, and analytics |
| Testing & Linting | Pytest, Mongomock-Motor, Ruff | Standalone automated testing and PEP8 code quality enforcement |
| Frontend | React 18 & React Router v6 | Single Page Application with protected navigation routes |
| Styling | Bootstrap 5 | Responsive UI layout and modern dark-accented CSS styling |
| Data Visualization | Recharts | Interactive charts for admin sales analytics |
| CI/CD | GitHub Actions | Automated linting, test suite execution, and frontend build verification |

---

## Repository Structure

```text
OffSole/
|-- .github/
|   \-- workflows/
|       \-- ci.yml              # GitHub Actions CI workflow (lint + test + build)
|
|-- backend/
|   |-- app/
|   |   |-- core/               # Security utilities, JWT encoding, auth dependencies, exceptions
|   |   |-- crud/               # Database query repositories (user, product, cart, order)
|   |   |-- routers/            # HTTP endpoints (auth, products, cart, admin)
|   |   |-- schemas/            # Pydantic data validation and response models
|   |   |-- services/           # Business logic layer (auth, product, cart, order, admin)
|   |   |-- config.py           # Pydantic settings loaded from environment
|   |   |-- database.py         # MongoDB connection setup and index initialization
|   |   \-- main.py             # FastAPI entry point, CORS, and versioned routing
|   |-- media/                  # Locally served product image assets
|   |-- tests/                  # Automated pytest suite (auth, products, cart, orders, admin)
|   |-- pyproject.toml          # Ruff linter and Pytest configuration
|   |-- requirements.txt        # Python dependencies
|   |-- .env.example            # Environment variable template
|   \-- README.md               # Backend documentation
|
|-- frontend/
|   |-- public/                 # Static HTML template and media assets
|   |-- src/
|   |   |-- api/                # Axios API client modules
|   |   |-- components/         # Reusable UI components (Navbar, Footer, ProductCard, etc.)
|   |   |-- context/            # React Context providers (AuthContext, CartContext)
|   |   |-- pages/              # Application views (Home, Products, AdminDashboard, Cart, etc.)
|   |   |-- utils/              # Formatting and validation helper functions
|   |   |-- App.js              # Route definitions and layout wrapper
|   |   \-- index.js            # React DOM mount point
|   |-- .prettierrc             # Prettier formatting configuration
|   |-- package.json            # Frontend dependencies and npm scripts
|   \-- README.md               # Frontend documentation
|
|-- .gitignore                  # Git ignore rules for node_modules, venv, and .env
\-- README.md                   # Main project documentation
```

---

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher with npm
- MongoDB Atlas cluster or a local MongoDB database

---

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a Python virtual environment:

**Windows (PowerShell):**
```powershell
python -m venv venv
.env\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install required Python packages:
```bash
pip install -r requirements.txt
```

Configure environment variables:
```bash
cp .env.example .env
```

Set your configuration values inside `backend/.env`:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/offsole?retryWrites=true&w=majority
DATABASE_NAME=offsole
SECRET_KEY=your_secure_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:3000
MEDIA_DIR=media
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

Interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

Open a separate terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install npm dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The application will be accessible in your browser at `http://localhost:3000`.

---

## Running Tests & Quality Checks

### Backend Tests
Execute the complete automated test suite (20 tests covering auth, catalog, cart, orders, and admin authorization):
```bash
cd backend
pytest -v
```

### Python Linting
Run Ruff static analysis across the backend:
```bash
cd backend
ruff check .
```

### Frontend Build & Formatting
Run format checks and compile the production bundle:
```bash
cd frontend
npm run format
npm run build
```

---

## Admin Access

1. Register an account or sign in through the UI.
2. In your MongoDB `users` collection, set `"is_admin": true` or `"role": "admin"` on the corresponding user document.
3. Upon refreshing the page, the **Admin Dashboard** option will appear in the navigation bar, linking to `/admin`.
4. Admin accounts have exclusive access to administrative metrics, product CRUD operations, and transaction audit logs.

---

## License

This project is licensed under the MIT License.
