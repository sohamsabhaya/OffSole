# OffSole 👟

[![GitHub Repository](https://img.shields.io/badge/GitHub-sohamsabhaya%2FOffSole-181717?style=flat&logo=github)](https://github.com/sohamsabhaya/OffSole)

A modern, full-stack sneaker e-commerce platform built with **FastAPI**, **MongoDB Atlas**, and **React**. Features full user authentication, catalog browsing with advanced filters, cart & checkout workflows, account deletion, and a dedicated **Admin Dashboard** with real-time sales analytics and product management.

- **Repository**: [https://github.com/sohamsabhaya/OffSole](https://github.com/sohamsabhaya/OffSole)

---

## 🚀 Features

### 🛍️ Customer Experience
- **Interactive Product Catalog**: Real-time filtering by brand (Nike, Adidas, Jordan, etc.), category, gender, size, color, and price sorting.
- **Product Details**: High-resolution image showcases, stock indicators, size selection, and description.
- **Cart & Order Flow**: Live cart item quantity management, cart badge indicator, and immediate checkout with order history.
- **User Account Management**: Secure registration, login, and self-service account deletion (with confirmation modal).

### 📊 Admin Dashboard
- **Sales Analytics**:
  - **KPI Metrics**: Total Revenue, Total Orders, Units Sold, Average Order Value (AOV).
  - **Visual Charts**:
    - Monthly Sales Revenue & Orders (Bar Chart).
    - Sales distribution by Brand (Donut / Pie Chart).
    - Sales distribution by Gender & Category.
    - Sales distribution by Colorway.
- **Recent Transactions Log**: Chronological audit trail of customer purchases with item breakdowns and status.
- **Product Inventory Management**: Add new products, update pricing/stock/details, and delete discontinued items.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend API** | FastAPI (Python 3.11+) |
| **Database** | MongoDB Atlas (Motor async driver) |
| **Authentication** | JWT stored in HTTP-only cookies, bcrypt password hashing |
| **Frontend UI** | React 18, React Router v6, Bootstrap 5, Bootstrap Icons |
| **Data Visualization** | Recharts |
| **HTTP Client** | Axios (with credentials support) |
| **Static Media** | FastAPI StaticFiles (/media) |

---

## 📁 Repository Structure

`	ext
OffSole/
|-- backend/
|   |-- app/
|   |   |-- core/           # Security, password hashing, JWT dependencies
|   |   |-- crud/           # Database query helpers
|   |   |-- routers/        # API route handlers (auth, products, cart, admin)
|   |   |-- schemas/        # Pydantic models for validation
|   |   |-- config.py       # Configuration & environment variables
|   |   |-- database.py     # MongoDB connection & collections
|   |   -- main.py         # FastAPI application entry point
|   |-- media/              # Locally stored product images
|   |-- requirements.txt    # Python dependencies
|   |-- .env.example        # Sample environment configuration
|   -- README.md           # Backend documentation
|
|-- frontend/
|   |-- src/
|   |   |-- components/     # Navbar, Footer, ProductCard, Modals
|   |   |-- pages/          # Home, Shop, ProductDetails, Cart, AdminDashboard, Login, Register
|   |   |-- context/        # Auth and Cart React context providers
|   |   |-- services/       # Axios API client modules
|   |   |-- App.jsx         # Routes and layout setup
|   |   -- index.css       # Custom styling and theme overrides
|   |-- package.json        # Frontend scripts & dependencies
|   -- README.md           # Frontend documentation
|
|-- .gitignore
-- README.md               # Main project documentation
`

---

## ⚡ Quick Start

### 1. Clone the Repository

`ash
git clone https://github.com/sohamsabhaya/OffSole.git
cd OffSole
`

---

### 2. Backend Setup

`ash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
`

Configure your .env file:
`env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/offsole?retryWrites=true&w=majority
DATABASE_NAME=offsole
SECRET_KEY=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:3000
MEDIA_DIR=media
`

Start the backend server:
`ash
uvicorn app.main:app --reload --port 8000
`
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 3. Frontend Setup

`ash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start the React development server
npm start
`

The application will launch at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Admin Access

To access the Admin Dashboard:
1. Log in with an admin account (or set is_admin: true on your user document in MongoDB).
2. The navigation bar will display the **Admin Dashboard** link leading to /admin.
3. Admin accounts are restricted strictly to administrative & analytics operations.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
