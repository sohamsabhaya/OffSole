from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.product import ProductListResponse, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


def get_product_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> ProductService:
    return ProductService(db)


@router.get("/", response_model=ProductListResponse)
async def list_products(
    search: str | None = Query(None, description="Search term for sneaker name or brand"),
    brand: str | None = Query(None, description="Filter by brand"),
    category: str | None = Query(None, description="Filter by category"),
    gender: str | None = Query(None, description="Filter by gender"),
    color: str | None = Query(None, description="Filter by color"),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    sort_by: str | None = Query(None, description="price_asc, price_desc, name_asc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    service: ProductService = Depends(get_product_service),
):
    return await service.get_catalog(
        search=search,
        brand=brand,
        category=category,
        gender=gender,
        color=color,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
    )


@router.get("/{product_id}/", response_model=ProductResponse)
async def product_detail(product_id: str, service: ProductService = Depends(get_product_service)):
    return await service.get_product(product_id)
