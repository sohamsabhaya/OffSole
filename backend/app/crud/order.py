import time
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.orders import ProcessOrderRequest
from app.crud.cart import get_cart_items, clear_user_cart


async def create_order_from_cart(
    db: AsyncIOMotorDatabase,
    user: dict,
    order_in: ProcessOrderRequest
) -> dict:
    """
    Creates an order from the user's current shopping cart,
    calculates prices, saves the order in MongoDB, and empties the cart.
    """
    user_id = str(user.get("_id") or user.get("id"))
    items = await get_cart_items(db, user_id)
    
    if not items:
        raise ValueError("Cannot place an order with an empty cart.")
        
    # Calculate subtotal
    subtotal = sum(float(item.get("total_price", 0.0)) for item in items)
    
    # Shipping rule: Free shipping over ₹1000, else ₹99
    shipping_charge = 0.0 if subtotal >= 1000.0 else 99.0
    total_amount = round(subtotal + shipping_charge, 2)
    
    # Generate unique order number
    order_number = f"ORD-{int(time.time())}"
    
    order_doc = {
        "user_id": user_id,
        "username": user.get("username"),
        "order_number": order_number,
        "phone_number": order_in.phone_number,
        "address": order_in.address,
        "pincode": order_in.pincode,
        "payment_method": order_in.payment_method,
        "payment_status": "paid" if order_in.payment_method != "cod" else "pending",
        "order_status": "processing",
        "items": items,
        "subtotal": subtotal,
        "shipping_charge": shipping_charge,
        "total_amount": total_amount,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = str(result.inserted_id)
    
    # Empty user's cart after successful order placement
    await clear_user_cart(db, user_id)
    
    return order_doc


async def get_user_orders(
    db: AsyncIOMotorDatabase,
    user_id: str,
    username: str = None
) -> list:
    """
    Retrieves all past orders placed by the user, newest first.
    """
    query_conditions = [{"user_id": user_id}]
    if username:
        query_conditions.append({"username": username})
        
    cursor = db.orders.find({"$or": query_conditions}).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id", ""))
        doc["created_at"] = str(doc.get("created_at", ""))
        orders.append(doc)
    return orders

