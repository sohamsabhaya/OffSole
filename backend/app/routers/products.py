from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from app.database import get_database
from app.schemas.product import ProductResponse, ProductListResponse
from app.crud.product import get_products, get_product_by_id

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=ProductListResponse)
async def list_products(
    search: Optional[str] = Query(None, description="Search term for sneaker name or brand"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieves sneaker catalog.
    Supports search query parameter (e.g. /api/products/?search=Nike).
    """
    products = await get_products(db, search=search)
    return ProductListResponse(
        success=True,
        products=products,
        count=len(products)
    )


@router.get("/{product_id}/", response_model=ProductResponse)
async def product_detail(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieves full details for a single sneaker by ID.
    """
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sneaker with ID '{product_id}' not found."
        )
    return product
