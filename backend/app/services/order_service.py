import random
from datetime import UTC, datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import BadRequestError
from app.crud.cart import clear_cart_by_user_id, get_cart_by_user_id
from app.crud.order import create_order, get_orders_by_user


class OrderService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def process_checkout(
        self, user_id: str, user_email: str, username: str, shipping_data: dict[str, Any]
    ) -> dict:
        cart = await get_cart_by_user_id(self.db, user_id)
        items = cart.get("items", [])
        if not items:
            raise BadRequestError(message="Your shopping cart is empty.")

        subtotal = float(cart.get("subtotal", 0.0))
        shipping_fee = 0.0 if subtotal >= 150.0 else 15.0
        tax = round(subtotal * 0.08, 2)
        total_amount = round(subtotal + shipping_fee + tax, 2)

        timestamp_str = datetime.now(UTC).strftime("%Y%m%d")
        rand_suffix = random.randint(1000, 9999)
        order_number = f"OFF-{timestamp_str}-{rand_suffix}"

        order_record = {
            "order_number": order_number,
            "user_id": str(user_id),
            "user_email": user_email,
            "username": username,
            "items": items,
            "subtotal": subtotal,
            "shipping_fee": shipping_fee,
            "tax": tax,
            "total_amount": total_amount,
            "shipping_address": shipping_data,
            "status": "confirmed",
            "payment_status": "paid",
            "created_at": datetime.now(UTC),
        }

        created = await create_order(self.db, order_record)
        await clear_cart_by_user_id(self.db, user_id)

        order_id = str(created.get("id", created.get("_id", "")))

        return {
            "success": True,
            "message": "Order placed successfully!",
            "order_id": order_id,
            "order_number": order_number,
            "total_amount": total_amount,
            "order": created,
        }

    async def get_user_orders(self, user_id: str) -> list[dict]:
        return await get_orders_by_user(self.db, user_id)
