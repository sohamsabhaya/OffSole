from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.services.admin_service import AdminService
from app.services.auth_service import AuthService
from app.services.cart_service import CartService
from app.services.order_service import OrderService
from app.services.product_service import ProductService


def get_auth_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AuthService:
    return AuthService(db)


def get_product_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> ProductService:
    return ProductService(db)


def get_cart_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> CartService:
    return CartService(db)


def get_order_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> OrderService:
    return OrderService(db)


def get_admin_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AdminService:
    return AdminService(db)


__all__ = [
    "AuthService",
    "ProductService",
    "CartService",
    "OrderService",
    "AdminService",
    "get_auth_service",
    "get_product_service",
    "get_cart_service",
    "get_order_service",
    "get_admin_service",
]
