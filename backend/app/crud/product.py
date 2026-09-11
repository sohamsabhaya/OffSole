from datetime import UTC, datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


def format_product_doc(product_doc: dict | None) -> dict | None:
    if not product_doc:
        return None
    doc = dict(product_doc)
    doc["id"] = str(doc.get("_id", doc.get("id", "")))
    doc.pop("_id", None)

    raw_images = doc.get("images", [])
    if isinstance(raw_images, str):
        raw_images = [raw_images]
    doc["images"] = [img for img in raw_images if img]
    if not doc["images"] and doc.get("image"):
        doc["images"] = [doc.get("image")]

    raw_sizes = doc.get("sizes", [])
    if isinstance(raw_sizes, (list, tuple)):
        doc["sizes"] = [
            float(s)
            if isinstance(s, (int, float, str)) and str(s).replace(".", "", 1).isdigit()
            else s
            for s in raw_sizes
        ]
    else:
        doc["sizes"] = []

    return doc


async def get_products(
    db: AsyncIOMotorDatabase,
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
) -> list[dict]:
    filter_query: dict[str, Any] = {}

    if search and search.strip():
        term = search.strip()
        filter_query["$or"] = [
            {"name": {"$regex": term, "$options": "i"}},
            {"brand": {"$regex": term, "$options": "i"}},
            {"description": {"$regex": term, "$options": "i"}},
            {"color": {"$regex": term, "$options": "i"}},
        ]

    if brand and brand.strip():
        filter_query["brand"] = {"$regex": f"^{brand.strip()}$", "$options": "i"}

    if category and category.strip():
        filter_query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}

    if gender and gender.strip():
        filter_query["gender"] = {"$regex": f"^{gender.strip()}$", "$options": "i"}

    if color and color.strip():
        filter_query["color"] = {"$regex": color.strip(), "$options": "i"}

    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = float(min_price)
        if max_price is not None:
            price_filter["$lte"] = float(max_price)
        filter_query["price"] = price_filter

    cursor = db.products.find(filter_query)

    if sort_by == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort_by == "price_desc":
        cursor = cursor.sort("price", -1)
    elif sort_by == "name_asc":
        cursor = cursor.sort("name", 1)
    else:
        cursor = cursor.sort("created_at", -1)

    cursor = cursor.skip(skip).limit(limit)

    products = []
    async for doc in cursor:
        formatted = format_product_doc(doc)
        if formatted:
            products.append(formatted)
    return products


async def count_products(
    db: AsyncIOMotorDatabase, filter_query: dict[str, Any] | None = None
) -> int:
    return await db.products.count_documents(filter_query or {})


async def get_product_by_id(db: AsyncIOMotorDatabase, product_id: str) -> dict | None:
    if not ObjectId.is_valid(product_id):
        doc = await db.products.find_one({"id": product_id})
        return format_product_doc(doc)
    doc = await db.products.find_one({"_id": ObjectId(product_id)})
    return format_product_doc(doc)


async def create_product(db: AsyncIOMotorDatabase, data: dict[str, Any]) -> dict:
    doc = dict(data)
    doc["created_at"] = datetime.now(UTC)
    doc["updated_at"] = datetime.now(UTC)
    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_product_doc(doc)


async def update_product(
    db: AsyncIOMotorDatabase, product_id: str, update_data: dict[str, Any]
) -> dict | None:
    if not ObjectId.is_valid(product_id):
        return None
    data = dict(update_data)
    data["updated_at"] = datetime.now(UTC)
    result = await db.products.find_one_and_update(
        {"_id": ObjectId(product_id)}, {"$set": data}, return_document=True
    )
    return format_product_doc(result)


async def delete_product(db: AsyncIOMotorDatabase, product_id: str) -> bool:
    if not ObjectId.is_valid(product_id):
        return False
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0
