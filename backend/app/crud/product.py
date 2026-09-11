from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Optional


def _format_product(doc: dict) -> dict:
    """Helper to ensure _id is formatted as string 'id' for React."""
    if not doc:
        return doc
    doc_copy = doc.copy()
    doc_copy["id"] = str(doc_copy.pop("_id", ""))
    return doc_copy


async def get_products(
    db: AsyncIOMotorDatabase, search: Optional[str] = None
) -> List[dict]:
    """
    Fetches sneaker catalog from MongoDB.
    Supports case-insensitive search by shoe name or brand.
    """
    query = {}
    if search:
        query = {
            "$or": [
                {"name": {"$regex": search, "$options": "i"}},
                {"brand": {"$regex": search, "$options": "i"}},
            ]
        }
    
    cursor = db.products.find(query)
    products = []
    async for doc in cursor:
        products.append(_format_product(doc))
    return products


async def get_product_by_id(
    db: AsyncIOMotorDatabase, product_id: str
) -> Optional[dict]:
    """
    Fetches a single sneaker by its string or ObjectId identifier.
    """
    # Try querying as string ID first (e.g. from seed data), or ObjectId if MongoDB generated it
    doc = await db.products.find_one({"_id": product_id})
    if not doc:
        if ObjectId.is_valid(product_id):
            doc = await db.products.find_one({"_id": ObjectId(product_id)})
            
    if doc:
        return _format_product(doc)
    return None
