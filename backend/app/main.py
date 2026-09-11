import logging
import os
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.core.exceptions import AppException
from app.database import close_mongo_connection, connect_to_mongo
from app.routers.admin import router as admin_router
from app.routers.auth import router as auth_router
from app.routers.cart import router as cart_router
from app.routers.products import router as products_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("offsole")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing OffSole Application...")
    await connect_to_mongo()
    yield
    logger.info("Shutting down OffSole Application...")
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack Sneaker E-Commerce API with FastAPI and MongoDB",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.MEDIA_DIR, exist_ok=True)
app.mount(f"/{settings.MEDIA_DIR}", StaticFiles(directory=settings.MEDIA_DIR), name="media")


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {"code": exc.error_code, "message": exc.message, "details": exc.details},
        },
    )


# Mount versioned API router under /api/v1
api_v1_router = APIRouter(prefix=settings.API_V1_PREFIX)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(products_router)
api_v1_router.include_router(cart_router)
api_v1_router.include_router(admin_router)
app.include_router(api_v1_router)

# Mount unversioned /api aliases for backwards compatibility with existing frontend
api_legacy_router = APIRouter(prefix="/api")
api_legacy_router.include_router(auth_router)
api_legacy_router.include_router(products_router)
api_legacy_router.include_router(cart_router)
api_legacy_router.include_router(admin_router)
app.include_router(api_legacy_router)


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENV,
    }
