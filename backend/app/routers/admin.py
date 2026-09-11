from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_admin_user
from app.database import get_database
from app.schemas.admin import (
    AdminStatsResponse,
    ProductCreate,
    ProductUpdate,
    SalesAnalyticsResponse,
)
from app.schemas.product import ProductResponse
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


def get_admin_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AdminService:
    return AdminService(db)


@router.get("/stats/", response_model=AdminStatsResponse)
async def get_admin_stats(
    admin: dict = Depends(get_current_admin_user),
    service: AdminService = Depends(get_admin_service),
):
    return await service.get_stats()


@router.get("/sales-analytics/", response_model=SalesAnalyticsResponse)
async def get_sales_analytics(
    admin: dict = Depends(get_current_admin_user),
    service: AdminService = Depends(get_admin_service),
):
    return await service.get_sales_analytics()


@router.post("/products/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    admin: dict = Depends(get_current_admin_user),
    service: AdminService = Depends(get_admin_service),
):
    return await service.create_new_product(product_in.model_dump())


@router.put("/products/{product_id}/", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_in: ProductUpdate,
    admin: dict = Depends(get_current_admin_user),
    service: AdminService = Depends(get_admin_service),
):
    update_data = {k: v for k, v in product_in.model_dump().items() if v is not None}
    return await service.update_existing_product(product_id, update_data)


@router.delete("/products/{product_id}/")
async def delete_product(
    product_id: str,
    admin: dict = Depends(get_current_admin_user),
    service: AdminService = Depends(get_admin_service),
):
    return await service.delete_existing_product(product_id)
