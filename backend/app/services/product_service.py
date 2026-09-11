from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import NotFoundError
from app.crud.product import count_products, get_product_by_id, get_products


class ProductService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def get_catalog(
        self,
        search: str | None = None,
        brand: str | None = None,
        category: str | None = None,
        gender: str | None = None,
        color: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        sort_by: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> dict:
        products = await get_products(
            self.db,
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
        total = await count_products(self.db)
        return {"success": True, "products": products, "count": len(products), "total": total}

    async def get_product(self, product_id: str) -> dict:
        product = await get_product_by_id(self.db, product_id)
        if not product:
            raise NotFoundError(message=f"Sneaker with ID '{product_id}' was not found.")
        return product
