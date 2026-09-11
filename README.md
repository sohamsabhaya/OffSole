# OffSole

OffSole is a full-stack sneaker e-commerce platform built with FastAPI, MongoDB Atlas, and React 18. The application provides dynamic catalog filtering, cart and checkout workflows, JWT cookie-based session management, self-service account lifecycle features, and an administrative dashboard with sales analytics and product inventory control.

---

## Features

### Storefront & Customer Experience
- **Dynamic Catalog Filtering**: Multi-attribute filtering by brand, category, gender, colorway, and size with real-time price sorting and keyword search.
- **Product Details**: High-resolution image preview, real-time stock indicator, and size selector.
- **Cart & Checkout**: Persistent cart storage, quantity adjustments, order summary calculations, and checkout processing.
- **User Authentication**: Secure HTTP-only JWT cookies, bcrypt password hashing, session persistence, and self-service account deletion.

### Admin Dashboard & Analytics
- **Sales KPI Metrics**: Total Revenue, Orders Count, Units Sold, and Average Order Value (AOV).
- **Visual Charts & Trends**:
  - Monthly revenue and order volume trends.
  - Brand market share distribution (Pie / Donut chart).
  - Category and Gender distribution breakdowns.
  - Colorway sales distribution.
- **Recent Transactions Log**: Chronological audit trail of customer purchases with item-level breakdowns and status.
- **Inventory Management**: Create new sneaker listings, update prices/stock/details, and delete discontinued products.

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| Backend API | FastAPI | Asynchronous Python REST API framework |
| Database | MongoDB Atlas & Motor | Async NoSQL database for products, users, carts, and orders |
| Authentication | Python-Jose & Passlib | JWT in secure HTTP-only cookies, bcrypt password hashing |
| Frontend | React 18 & React Router v6 | Single Page Application with protected navigation routes |
| Styling | Bootstrap 5 | Responsive UI layout and modern CSS styling |
| Data Visualization | Recharts | Interactive charts for admin sales analytics |
| HTTP Client | Axios | Configured with cross-origin credentials (withCredentials: true) |
| Server | Uvicorn | ASGI production server |

---

## Repository Structure

`	ext
OffSole/
|-- backend/
|   |-- app/
|   |   |-- core/           # Security utilities, JWT encoding, auth dependencies
|   |   |-- crud/           # Database query functions (products, orders, users, cart)
|   |   |-- routers/        # API endpoints (auth, products, cart, admin)
|   |   |-- schemas/        # Pydantic data validation models
|   |   |-- config.py       # Pydantic settings loaded from environment
|   |   |-- database.py     # MongoDB connection setup and collection handles
|   |   -- main.py         # FastAPI entry point, CORS, and router registration
|   |-- media/              # Locally served product image assets
|   |-- requirements.txt    # Python dependencies
|   |-- .env.example        # Environment variable template
|   -- README.md           # Backend documentation
|
|-- frontend/
|   |-- public/             # Static HTML template and favicon
|   |-- src/
|   |   |-- api/            # Axios API client modules
|   |   |-- components/     # Reusable UI components (Navbar, Footer, ProductCard)
|   |   |-- context/        # React Context providers (AuthContext, CartContext)
|   |   |-- pages/          # Application views (Home, Products, AdminDashboard, Cart, etc.)
|   |   |-- utils/          # Formatting and validation helper functions
|   |   |-- App.js          # Route definitions and layout wrapper
|   |   -- index.js        # React DOM mount point
|   |-- package.json        # Frontend dependencies and npm scripts
|   -- README.md           # Frontend documentation
|
|-- .gitignore              # Git ignore rules for node_modules, venv, and .env
-- README.md               # Main project documentation
`

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
.\venv\Scripts\Activate.ps1
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

## Admin Access

1. Register an account or sign in through the UI.
2. In your MongoDB `users` collection, set `"is_admin": true` on the corresponding user document.
3. Upon refreshing the page, the **Admin Dashboard** option will appear in the navigation bar, linking to `/admin`.
4. Admin accounts have exclusive access to administrative metrics, product CRUD operations, and transaction audit logs.

---

## License

This project is licensed under the MIT License.
