from datetime import UTC, datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase


def format_order_doc(doc: dict | None) -> dict | None:
    if not doc:
        return None
    d = dict(doc)
    d["id"] = str(d.get("_id", d.get("id", "")))
    d.pop("_id", None)
    return d


async def create_order(db: AsyncIOMotorDatabase, order_data: dict[str, Any]) -> dict:
    doc = dict(order_data)
    if "created_at" not in doc:
        doc["created_at"] = datetime.now(UTC)
    result = await db.orders.insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_order_doc(doc)


async def get_orders_by_user(db: AsyncIOMotorDatabase, user_id: str) -> list[dict]:
    cursor = db.orders.find({"user_id": str(user_id)}).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        f_doc = format_order_doc(doc)
        if f_doc:
            orders.append(f_doc)
    return orders


async def get_all_orders(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 100) -> list[dict]:
    cursor = db.orders.find({}).sort("created_at", -1).skip(skip).limit(limit)
    orders = []
    async for doc in cursor:
        f_doc = format_order_doc(doc)
        if f_doc:
            orders.append(f_doc)
    return orders


async def count_all_orders(db: AsyncIOMotorDatabase) -> int:
    return await db.orders.count_documents({})
