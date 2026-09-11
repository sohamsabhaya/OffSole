import uuid
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional


async def get_or_create_cart(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    """Finds user's cart or creates an empty one if it doesn't exist."""
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart:
        cart = {
            "user_id": user_id,
            "items": []
        }
        result = await db.carts.insert_one(cart)
        cart["_id"] = str(result.inserted_id)
    return cart


async def get_cart_items(db: AsyncIOMotorDatabase, user_id: str) -> List[dict]:
    """Retrieves all items inside the user's active bag."""
    cart = await get_or_create_cart(db, user_id)
    return cart.get("items", [])


async def get_cart_count(db: AsyncIOMotorDatabase, user_id: str) -> int:
    """Returns the total number of sneaker pairs in the cart."""
    items = await get_cart_items(db, user_id)
    return sum(item.get("quantity", 0) for item in items)


async def add_item_to_cart(
    db: AsyncIOMotorDatabase,
    user_id: str,
    product: dict,
    size: str,
    quantity: int = 1
) -> List[dict]:
    """
    Adds a sneaker to the user's cart.
    If already present with the same size, increments quantity.
    """
    cart = await get_or_create_cart(db, user_id)
    items = cart.get("items", [])
    
    # Check if item with identical product_id and size already exists
    item_found = False
    for item in items:
        if str(item.get("product_id")) == str(product["id"]) and item.get("size") == size:
            item["quantity"] = min(item["quantity"] + quantity, 10)
            item["total_price"] = round(item["quantity"] * float(item["product_price"]), 2)
            item_found = True
            break
            
    if not item_found:
        unit_price = float(product.get("price", 0.0))
        new_item = {
            "id": str(uuid.uuid4())[:8],
            "product_id": str(product["id"]),
            "product_name": product.get("name", "Sneaker"),
            "product_price": unit_price,
            "product_image": product.get("image", ""),
            "size": size,
            "quantity": quantity,
            "total_price": round(unit_price * quantity, 2)
        }
        items.append(new_item)
        
    # Save updated items array to MongoDB
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": items}}
    )
    return items


async def update_item_quantity(
    db: AsyncIOMotorDatabase,
    user_id: str,
    item_id: str,
    quantity: int
) -> Optional[List[dict]]:
    """Updates the quantity of an item in the cart."""
    cart = await get_or_create_cart(db, user_id)
    items = cart.get("items", [])
    
    updated = False
    for item in items:
        if item.get("id") == item_id:
            item["quantity"] = quantity
            item["total_price"] = round(quantity * float(item["product_price"]), 2)
            updated = True
            break
            
    if updated:
        await db.carts.update_one(
            {"user_id": user_id},
            {"$set": {"items": items}}
        )
        return items
    return None


async def remove_item_from_cart(
    db: AsyncIOMotorDatabase,
    user_id: str,
    item_id: str
) -> List[dict]:
    """Removes a specific item from the cart."""
    await db.carts.update_one(
        {"user_id": user_id},
        {"$pull": {"items": {"id": item_id}}}
    )
    return await get_cart_items(db, user_id)


async def clear_user_cart(db: AsyncIOMotorDatabase, user_id: str):
    """Empties all items in the user's cart (used after checkout)."""
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": {"items": []}}
    )
