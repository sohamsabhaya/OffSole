import uuid
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import BadRequestError, NotFoundError, StockUnavailableError
from app.crud.cart import clear_cart_by_user_id, get_cart_by_user_id, save_user_cart
from app.crud.product import get_product_by_id


def normalize_cart_item(item: dict) -> dict:
    d = dict(item)
    item_id = str(d.get("item_id") or d.get("id") or str(uuid.uuid4())[:8])
    name = str(d.get("name") or d.get("product_name") or "")
    price = float(d.get("price") or d.get("product_price") or 0.0)
    image = str(d.get("image") or d.get("product_image") or "")
    qty = int(d.get("quantity", 1))

    return {
        "id": item_id,
        "item_id": item_id,
        "product_id": str(d.get("product_id", "")),
        "name": name,
        "product_name": name,
        "price": price,
        "product_price": price,
        "image": image,
        "product_image": image,
        "brand": str(d.get("brand", "")),
        "size": str(d.get("size", "Standard")),
        "quantity": qty,
        "total_price": round(price * qty, 2),
    }


class CartService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def get_cart(self, user_id: str) -> dict:
        raw_cart = await get_cart_by_user_id(self.db, user_id)
        raw_items = raw_cart.get("items", [])
        norm_items = [normalize_cart_item(it) for it in raw_items]
        total_items = sum(it["quantity"] for it in norm_items)
        subtotal = round(sum(it["total_price"] for it in norm_items), 2)
        return {
            "success": True,
            "items": norm_items,
            "total_items": total_items,
            "subtotal": subtotal,
        }

    async def get_cart_count(self, user_id: str | None) -> int:
        if not user_id:
            return 0
        cart = await self.get_cart(user_id)
        return cart.get("total_items", 0)

    async def add_item(self, user_id: str, product_id: str, size: Any, quantity: int = 1) -> dict:
        if quantity <= 0:
            raise BadRequestError(message="Quantity must be at least 1.")

        product = await get_product_by_id(self.db, product_id)
        if not product:
            raise NotFoundError(message=f"Product '{product_id}' not found.")

        in_stock = int(product.get("in_stock", product.get("stock", 10)))
        if in_stock < quantity:
            raise StockUnavailableError(message=f"Only {in_stock} items available in stock.")

        cart = await self.get_cart(user_id)
        items = list(cart.get("items", []))

        size_str = str(size)
        found = False
        for item in items:
            if (
                str(item.get("product_id")) == str(product["id"])
                and str(item.get("size")) == size_str
            ):
                new_qty = int(item.get("quantity", 1)) + quantity
                if new_qty > in_stock:
                    raise StockUnavailableError(
                        message=f"Cannot add more. Total in cart ({new_qty}) exceeds available stock ({in_stock})."
                    )
                item["quantity"] = new_qty
                item["total_price"] = round(item["price"] * new_qty, 2)
                found = True
                break

        if not found:
            images = product.get("images", [])
            primary_image = images[0] if images else product.get("image", "")
            price = float(product.get("price", 0.0))
            new_item = normalize_cart_item(
                {
                    "item_id": str(uuid.uuid4())[:8],
                    "product_id": str(product["id"]),
                    "name": product["name"],
                    "brand": product.get("brand", ""),
                    "price": price,
                    "size": size_str,
                    "image": primary_image,
                    "quantity": quantity,
                }
            )
            items.append(new_item)

        await save_user_cart(self.db, user_id, items)
        return await self.get_cart(user_id)

    async def update_quantity(self, user_id: str, item_id: str, quantity: int) -> dict:
        cart = await self.get_cart(user_id)
        items = list(cart.get("items", []))

        if quantity <= 0:
            items = [
                item
                for item in items
                if str(item.get("id")) != str(item_id) and str(item.get("item_id")) != str(item_id)
            ]
            await save_user_cart(self.db, user_id, items)
            return await self.get_cart(user_id)

        found = False
        for item in items:
            if str(item.get("id")) == str(item_id) or str(item.get("item_id")) == str(item_id):
                product = await get_product_by_id(self.db, str(item["product_id"]))
                if product:
                    in_stock = int(product.get("in_stock", product.get("stock", 10)))
                    if quantity > in_stock:
                        raise StockUnavailableError(
                            message=f"Only {in_stock} items available in stock."
                        )
                item["quantity"] = quantity
                item["total_price"] = round(item["price"] * quantity, 2)
                found = True
                break

        if not found:
            raise NotFoundError(message="Cart item not found.")

        await save_user_cart(self.db, user_id, items)
        return await self.get_cart(user_id)

    async def remove_item(self, user_id: str, item_id: str) -> dict:
        cart = await self.get_cart(user_id)
        items = [
            item
            for item in cart.get("items", [])
            if str(item.get("id")) != str(item_id) and str(item.get("item_id")) != str(item_id)
        ]
        await save_user_cart(self.db, user_id, items)
        return await self.get_cart(user_id)

    async def clear_cart(self, user_id: str) -> bool:
        return await clear_cart_by_user_id(self.db, user_id)
