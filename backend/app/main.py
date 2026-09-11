import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth_router, products_router, cart_router, admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Context Manager.
    Handles startup DB connection and shutdown cleanup.
    """
    settings = get_settings()
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}...")

    await connect_to_mongo()

    yield  # Server serves requests here

    await close_mongo_connection()



# Initialize FastAPI App
settings = get_settings()
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="High-performance async API for OffSole Sneaker Store built with FastAPI and MongoDB Atlas.",
    lifespan=lifespan
)

# Configure CORS for React Axios withCredentials support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure media directory exists and mount static file serving
os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

# Include Modular API Routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(cart_router)
app.include_router(admin_router)


@app.get("/", tags=["Health"])
async def root():
    """Health check root endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs_url": "/docs"
    }
