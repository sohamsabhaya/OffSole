from datetime import UTC, datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase


def format_cart_doc(cart_doc: dict | None) -> dict:
    if not cart_doc:
        return {"items": [], "total_items": 0, "subtotal": 0.0}
    items = cart_doc.get("items", [])
    total_items = sum(int(item.get("quantity", 1)) for item in items)
    subtotal = sum(float(item.get("price", 0.0)) * int(item.get("quantity", 1)) for item in items)
    return {"items": items, "total_items": total_items, "subtotal": round(subtotal, 2)}


async def get_cart_by_user_id(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    doc = await db.cart.find_one({"user_id": str(user_id)})
    return format_cart_doc(doc)


async def save_user_cart(
    db: AsyncIOMotorDatabase, user_id: str, items: list[dict[str, Any]]
) -> dict:
    cart_data = {"user_id": str(user_id), "items": items, "updated_at": datetime.now(UTC)}
    await db.cart.update_one({"user_id": str(user_id)}, {"$set": cart_data}, upsert=True)
    return format_cart_doc(cart_data)


async def clear_cart_by_user_id(db: AsyncIOMotorDatabase, user_id: str) -> bool:
    result = await db.cart.delete_one({"user_id": str(user_id)})
    return result.deleted_count > 0
