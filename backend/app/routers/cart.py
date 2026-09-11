from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_current_user, get_current_user_optional
from app.database import get_database
from app.schemas.cart import (
    AddToCartRequest,
    CartCountResponse,
    CartResponse,
    UpdateCartItemRequest,
)
from app.schemas.orders import OrderSuccessResponse, ProcessOrderRequest
from app.services.cart_service import CartService
from app.services.order_service import OrderService

router = APIRouter(prefix="/cart", tags=["Cart & Checkout"])


def get_cart_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> CartService:
    return CartService(db)


def get_order_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> OrderService:
    return OrderService(db)


@router.get("/orders/")
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service),
):
    user_id = str(current_user.get("_id") or current_user.get("id"))
    orders = await order_service.get_user_orders(user_id)
    return {"success": True, "count": len(orders), "orders": orders}


@router.get("/count/", response_model=CartCountResponse)
async def cart_badge_count(
    current_user: dict | None = Depends(get_current_user_optional),
    cart_service: CartService = Depends(get_cart_service),
):
    user_id = str(current_user["_id"]) if current_user else None
    count = await cart_service.get_cart_count(user_id)
    return CartCountResponse(count=count)


@router.get("/", response_model=CartResponse)
async def view_cart(
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    user_id = str(current_user["_id"])
    return await cart_service.get_cart(user_id)


@router.post("/items/", response_model=CartResponse)
async def add_item_to_cart(
    item_in: AddToCartRequest,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    user_id = str(current_user["_id"])
    return await cart_service.add_item(
        user_id=user_id, product_id=item_in.product_id, size=item_in.size, quantity=item_in.quantity
    )


@router.put("/items/{item_id}/", response_model=CartResponse)
async def update_item_qty(
    item_id: str,
    update_in: UpdateCartItemRequest,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    user_id = str(current_user["_id"])
    return await cart_service.update_quantity(user_id, item_id, update_in.quantity)


@router.delete("/items/{item_id}/", response_model=CartResponse)
async def delete_item_from_cart(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    user_id = str(current_user["_id"])
    return await cart_service.remove_item(user_id, item_id)


@router.post("/checkout/", response_model=OrderSuccessResponse)
async def checkout_order(
    order_in: ProcessOrderRequest,
    current_user: dict = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service),
):
    user_id = str(current_user["_id"])
    email = current_user.get("email", "")
    username = current_user.get("username", "")
    return await order_service.process_checkout(
        user_id=user_id, user_email=email, username=username, shipping_data=order_in.model_dump()
    )
