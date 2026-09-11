# OffSole

OffSole is a full-stack sneaker e-commerce platform built with FastAPI, MongoDB Atlas, and React. The application features user authentication, catalog browsing with dynamic filtering, shopping cart checkout workflows, user profile management, and an administrative dashboard with sales analytics and product inventory control.

---

## Features

### Storefront & Customer Experience
- **Product Catalog**: Multi-attribute filtering (brand, category, gender, colorway, size) with price sorting and keyword search.
- **Product Details**: High-resolution image preview, real-time stock availability, and size selection.
- **Cart & Checkout**: Persistent cart management, quantity controls, and streamlined checkout processing.
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies, password hashing with bcrypt, and self-service account deletion.

### Admin Dashboard & Management
- **Sales Analytics**:
  - Key performance indicators: Total Revenue, Orders Count, Units Sold, and Average Order Value (AOV).
  - Monthly revenue and order volume trends.
  - Distribution breakdown by brand, product category, gender, and colorway.
- **Order Logs**: Chronological audit trail of customer transactions with item-level breakdowns.
- **Inventory Management**: Create, update, and remove products with image asset management.

---

## Tech Stack

### Backend
- **FastAPI**: Asynchronous Python web framework for REST APIs
- **MongoDB Atlas & Motor**: Async document database for products, users, carts, and order records
- **Pydantic v2**: Request/response schema validation and settings management
- **Passlib & Bcrypt**: Password hashing and verification
- **Python-Jose**: Cryptographic JWT generation and validation
- **Uvicorn**: ASGI server implementation

### Frontend
- **React 18**: Component-based user interface architecture
- **React Router v6**: Client-side routing and protected navigation guards
- **Bootstrap 5**: Responsive layout grid and modern UI components
- **Recharts**: Data visualization for administrative metrics and charts
- **Axios**: HTTP client configured for cross-origin credentials

---

## Directory Structure

`	ext
OffSole/
├── backend/
│   ├── app/
│   │   ├── core/           # Security, auth dependencies, JWT configuration
│   │   ├── crud/           # Database operations (products, orders, users, cart)
│   │   ├── routers/        # Route endpoints (auth, products, cart, admin)
│   │   ├── schemas/        # Pydantic data validation schemas
│   │   ├── config.py       # Environment configuration
│   │   ├── database.py     # MongoDB connection setup
│   │   └── main.py         # FastAPI application entry point
│   ├── media/              # Product image assets
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variable template
│   └── README.md
│
├── frontend/
│   ├── public/             # Static assets and HTML entry
│   ├── src/
│   │   ├── api/            # API client modules
│   │   ├── components/     # Reusable layout and feature components
│   │   ├── context/        # React Context providers (Auth, Cart)
│   │   ├── pages/          # Application views and routes
│   │   ├── utils/          # Formatting and validation helpers
│   │   ├── App.js          # Route definitions
│   │   └── index.js        # React DOM mount point
│   ├── package.json        # Frontend dependencies and scripts
│   └── README.md
│
├── .gitignore
└── README.md
`

---

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher with npm
- MongoDB Atlas cluster or local MongoDB instance

---

### Backend Setup

1. Navigate to the backend directory:
   `ash
   cd backend
   `

2. Create and activate a Python virtual environment:
   `ash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   `

3. Install required packages:
   `ash
   pip install -r requirements.txt
   `

4. Configure environment variables:
   `ash
   cp .env.example .env
   `
   Edit .env with your database credentials and secret key:
   `env
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/offsole?retryWrites=true&w=majority
   DATABASE_NAME=offsole
   SECRET_KEY=your_secure_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ALLOWED_ORIGINS=http://localhost:3000
   MEDIA_DIR=media
   `

5. Start the backend development server:
   `ash
   uvicorn app.main:app --reload --port 8000
   `
   The interactive API documentation will be available at http://localhost:8000/docs.

---

### Frontend Setup

1. Open a separate terminal and navigate to the frontend directory:
   `ash
   cd frontend
   `

2. Install npm dependencies:
   `ash
   npm install
   `

3. Start the development server:
   `ash
   npm start
   `
   The application will be accessible at http://localhost:3000.

---

## Admin Access

1. Log in with an administrator account (ensure is_admin: true is set on the user document in MongoDB).
2. The **Admin Dashboard** option will appear in the navigation bar, linking to /admin.
3. Administrative routes and dashboard APIs are guarded to prevent unauthorized access.

---

## License

This project is licensed under the MIT License.
