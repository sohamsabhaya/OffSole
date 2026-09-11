from collections import defaultdict
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import NotFoundError
from app.crud.order import count_all_orders, get_all_orders
from app.crud.product import (
    count_products,
    create_product,
    delete_product,
    update_product,
)


class AdminService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def get_stats(self) -> dict:
        total_orders = await count_all_orders(self.db)
        total_products = await count_products(self.db)
        total_users = await self.db.users.count_documents({})

        orders = await get_all_orders(self.db, skip=0, limit=5000)
        total_revenue = sum(float(o.get("total_amount", 0.0)) for o in orders)
        total_units_sold = sum(
            sum(int(item.get("quantity", 1)) for item in o.get("items", [])) for o in orders
        )
        aov = round(total_revenue / total_orders, 2) if total_orders > 0 else 0.0

        recent_orders = orders[:20]

        return {
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "total_units_sold": total_units_sold,
            "average_order_value": aov,
            "total_products": total_products,
            "total_users": total_users,
            "recent_orders": recent_orders,
        }

    async def get_sales_analytics(self) -> dict:
        orders = await get_all_orders(self.db, skip=0, limit=5000)

        brand_revenue = defaultdict(float)
        gender_revenue = defaultdict(float)
        category_revenue = defaultdict(float)
        color_revenue = defaultdict(float)
        monthly_sales = defaultdict(lambda: {"revenue": 0.0, "orders": 0, "units": 0})

        # Preload products for color/gender enrichment
        products_cursor = self.db.products.find({})
        product_meta = {}
        async for p in products_cursor:
            pid = str(p.get("_id", ""))
            product_meta[pid] = {
                "color": p.get("color", "Multi"),
                "gender": p.get("gender", "Unisex"),
                "category": p.get("category", "Lifestyle"),
                "brand": p.get("brand", "Other"),
            }

        for ord_doc in orders:
            ord_date = ord_doc.get("created_at")
            if ord_date:
                month_key = (
                    ord_date.strftime("%b %Y")
                    if hasattr(ord_date, "strftime")
                    else str(ord_date)[:7]
                )
            else:
                month_key = "Recent"

            monthly_sales[month_key]["revenue"] += float(ord_doc.get("total_amount", 0.0))
            monthly_sales[month_key]["orders"] += 1

            for item in ord_doc.get("items", []):
                qty = int(item.get("quantity", 1))
                price = float(item.get("price", 0.0))
                item_rev = round(price * qty, 2)
                brand = item.get("brand") or "Other"
                brand_revenue[brand] += item_rev
                monthly_sales[month_key]["units"] += qty

                pid = str(item.get("product_id", ""))
                meta = product_meta.get(pid, {})
                color = meta.get("color") or item.get("color") or "Standard"
                gender = meta.get("gender") or "Unisex"
                cat = meta.get("category") or "Lifestyle"

                color_revenue[color] += item_rev
                gender_revenue[gender] += item_rev
                category_revenue[cat] += item_rev

        return {
            "monthly_sales": [{"month": k, **v} for k, v in monthly_sales.items()],
            "by_brand": [{"name": k, "value": round(v, 2)} for k, v in brand_revenue.items()],
            "by_gender": [{"name": k, "value": round(v, 2)} for k, v in gender_revenue.items()],
            "by_category": [{"name": k, "value": round(v, 2)} for k, v in category_revenue.items()],
            "by_color": [{"name": k, "value": round(v, 2)} for k, v in color_revenue.items()],
        }

    async def create_new_product(self, data: dict[str, Any]) -> dict:
        return await create_product(self.db, data)

    async def update_existing_product(self, product_id: str, data: dict[str, Any]) -> dict:
        updated = await update_product(self.db, product_id, data)
        if not updated:
            raise NotFoundError(message=f"Product with ID '{product_id}' not found.")
        return updated

    async def delete_existing_product(self, product_id: str) -> dict:
        deleted = await delete_product(self.db, product_id)
        if not deleted:
            raise NotFoundError(message=f"Product with ID '{product_id}' not found.")
        return {"success": True, "message": f"Product '{product_id}' was deleted."}
