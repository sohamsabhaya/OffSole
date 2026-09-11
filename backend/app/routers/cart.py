from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from app.database import get_database
from app.core.deps import get_current_user, get_current_user_optional
from app.schemas.cart import (
    AddToCartRequest,
    UpdateCartItemRequest,
    CartResponse,
    CartCountResponse,
)
from app.schemas.orders import ProcessOrderRequest, OrderSuccessResponse
from app.crud.product import get_product_by_id
from app.crud.cart import (
    get_cart_items,
    get_cart_count,
    add_item_to_cart,
    update_item_quantity,
    remove_item_from_cart,
    clear_user_cart,
)
from app.crud.order import create_order_from_cart, get_user_orders

router = APIRouter(prefix="/api/cart", tags=["Cart & Checkout"])


@router.get("/orders/")
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieves all past orders placed by the currently logged-in user.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    username = current_user.get("username")
    orders = await get_user_orders(db, user_id=user_id, username=username)
    return {
        "success": True,
        "count": len(orders),
        "orders": orders
    }



@router.get("/count/", response_model=CartCountResponse)
async def cart_badge_count(
    current_user: Optional[dict] = Depends(get_current_user_optional),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Returns total sneaker count for the Navbar badge.
    Guest visitors get count: 0 without receiving a 401 error.
    """
    if not current_user:
        return CartCountResponse(count=0)
        
    user_id = str(current_user.get("_id") or current_user.get("id"))
    count = await get_cart_count(db, user_id)
    return CartCountResponse(count=count)


@router.get("/get/", response_model=CartResponse)
async def get_user_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieves all items inside the logged-in user's cart.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    items = await get_cart_items(db, user_id)
    return CartResponse(success=True, items=items)


@router.post("/add/", response_model=CartResponse)
async def add_to_cart(
    payload: AddToCartRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Adds a sneaker with specified UK size and quantity to the user's cart.
    """
    # Verify product exists in catalog
    product = await get_product_by_id(db, payload.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{payload.product_id}' not found."
        )

    # Validate size availability
    available_sizes = product.get("available_sizes", {})
    if not available_sizes.get(payload.size, False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Size {payload.size} is currently out of stock for {product.get('name')}."
        )

    user_id = str(current_user.get("_id") or current_user.get("id"))
    items = await add_item_to_cart(
        db=db,
        user_id=user_id,
        product=product,
        size=payload.size,
        quantity=payload.quantity
    )
    return CartResponse(success=True, items=items)


@router.put("/update/{item_id}/", response_model=CartResponse)
async def update_cart_quantity(
    item_id: str,
    payload: UpdateCartItemRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Modifies item quantity in the shopping cart.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    items = await update_item_quantity(
        db=db,
        user_id=user_id,
        item_id=item_id,
        quantity=payload.quantity
    )
    if items is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart item with ID '{item_id}' not found."
        )
    return CartResponse(success=True, items=items)


@router.delete("/remove/{item_id}/", response_model=CartResponse)
async def remove_from_cart(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Removes a specific item from the cart.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    items = await remove_item_from_cart(db, user_id, item_id)
    return CartResponse(success=True, items=items)


@router.post("/clear/", response_model=CartResponse)
async def clear_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Empties all items from the user's cart.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    await clear_user_cart(db, user_id)
    return CartResponse(success=True, items=[])


@router.post("/process-order/", response_model=OrderSuccessResponse)
async def process_checkout_order(
    payload: ProcessOrderRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Processes checkout: creates order record, records shipping info, and empties cart.
    """
    try:
        order = await create_order_from_cart(
            db=db,
            user=current_user,
            order_in=payload
        )
        return OrderSuccessResponse(
            success=True,
            order_id=order["_id"],
            order_number=order["order_number"],
            message="Your order has been placed successfully!",
            total_amount=order["total_amount"]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
